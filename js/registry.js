// The tool registry. This is the single place a new coping tool gets
// plugged in -- see README.md "Adding a new tool" for the steps.
//
// Each entry: { id, label, sublabel, bg, fg, icon, wide?, mount }
// `mount(container, api)` renders the tool's interactive content and
// calls `api.finish()` when the child completes it, or `api.exit()`
// to leave without finishing. It may return a cleanup function, which
// the router calls before navigating away (clear your intervals there).

import { icon, withStroke } from './icons.js';
import { mount as mountBreathe } from './tools/breathe.js';
import { mount as mountGround } from './tools/ground.js';
import { mount as mountFocus } from './tools/focus.js';
import { mount as mountCheckIn } from './tools/checkin.js';
import { mount as mountCrossTap } from './tools/crosstap.js';

export const TOOLS = [
  {
    id: 'breathe',
    label: 'Breathe',
    sublabel: 'Slow breaths',
    bg: 'var(--accent-tint)',
    fg: 'var(--accent-dark)',
    tileIcon: withStroke(icon.lungs, 'var(--accent-dark)'),
    mount: mountBreathe
  },
  {
    id: 'ground',
    label: 'Ground',
    sublabel: '5 things I can find',
    bg: 'var(--warm-tint)',
    fg: 'var(--warm)',
    tileIcon: withStroke(icon.anchor, 'var(--warm)'),
    mount: mountGround
  },
  {
    id: 'focus',
    label: 'Focus',
    sublabel: 'Look at one thing',
    bg: 'var(--lavender-tint)',
    fg: 'var(--lavender)',
    tileIcon: withStroke(icon.target, 'var(--lavender)'),
    mount: mountFocus
  },
  {
    id: 'checkin',
    label: 'Check-in',
    sublabel: 'How big is it?',
    bg: 'var(--clay-tint)',
    fg: 'var(--clay)',
    tileIcon: withStroke(icon.wave, 'var(--clay)'),
    mount: mountCheckIn
  },
  {
    id: 'crosstap',
    label: 'Tap',
    sublabel: 'Cross-tap your shoulders',
    bg: 'var(--rose-tint)',
    fg: 'var(--rose)',
    tileIcon: withStroke(icon.crosstap, 'var(--rose)'),
    wide: true,
    mount: mountCrossTap
  }
];

export function getTool(id) {
  return TOOLS.find((t) => t.id === id);
}
