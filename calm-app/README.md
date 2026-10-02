# Calm Space (working name)

A standalone self-regulation toolkit for Alex -- separate from MintIQ, sharing
only the reward *pattern*, not any code or data between the two apps.

No build step. No Xcode. Plain HTML/CSS/JS, deployable to Cloudflare Pages
exactly like your other Discendia Labs apps.

## Running it locally

Any static file server works, e.g.:

```
cd calm-app
python3 -m http.server 8080
```

Then open `http://localhost:8080`. (Opening `index.html` directly from disk
also mostly works, but ES module imports behave better served over http.)

## Deploying

Drag-and-drop this folder into a new Cloudflare Pages project, or connect it
to a git repo the way MintIQ is deployed -- there's no build command to
configure; the output directory is the project root itself.

## How it's organized

```
index.html          shell + font/manifest links
styles.css           design tokens + shared component styles
manifest.json / sw.js   PWA installability + basic offline cache
js/
  app.js             wires up routes, registers the service worker
  router.js           tiny hash router (no framework)
  state.js             the points ledger -- localStorage only, single profile
  registry.js         the list of coping tools (see below)
  icons.js             shared inline-SVG icons
  views/               Home, Tool Picker, Completion, Rewards, Parent, and
                        the generic Tool wrapper (exit button + shell chrome
                        shared by every tool)
  tools/               one file per tool: breathe.js, ground.js, focus.js,
                        checkin.js, crosstap.js
```

## Adding a new tool

This is the part meant to stay easy as the app grows:

1. Create `js/tools/yourtool.js` exporting `mount(container, api)`:
   - Render your UI into `container`.
   - Call `api.finish()` when the exercise is done -- this records the
     points earn and routes to the Completion screen automatically.
   - Call `api.exit('/pick')` (or any route) if you need to leave early
     without finishing.
   - Return a cleanup function if you set any `setInterval`/`requestAnimationFrame`
     loops, so the router can clear them when the user navigates away.
2. Add one entry to `js/registry.js`: id, label, sublabel, a background/
   foreground color pair, an icon, and `mount` pointing at your new module.

That's it -- the tool picker, routing, exit button, and points ledger all
pick it up automatically. No other file needs to change.

## The reward ledger (`js/state.js`)

- Flat 10 points per tool use, regardless of outcome -- using a tool is the
  win, there's nothing to "fail."
- A soft one-hour-per-tool cooldown stops point-farming without ever
  blocking the tool itself: using it again still works, it just doesn't
  pay out a second time within the hour.
- No streak bonuses, no penalties for a skipped day.
- Everything lives in this device's `localStorage` under a Calm Space-only
  key -- nothing shared with MintIQ or any other app.
- Parent view's reward list is editable in place (Edit/Remove/+Add reward)
  using plain `prompt()` dialogs for now -- functional, but worth swapping
  for a real form if this becomes a daily tool.

## Known rough edges (intentional, for a first pass)

- No accounts, no sync across devices -- single phone/tablet, single
  profile (Alex), as scoped.
- Parent view has no PIN lock yet -- anyone with the device can open it.
- The reward-editing prompts are functional but not polished UI.
- App icons are placeholder art echoing the breathing creature -- swap
  `icons/icon-*.png` (regenerate via `scripts/make_icons.py`, or replace by
  hand) once there's real branding.
- The name "Calm Space" is a placeholder in `manifest.json` and
  `index.html`'s `<title>` -- update both whenever a real name is picked.
