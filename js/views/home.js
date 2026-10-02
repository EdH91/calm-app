import { store } from '../state.js';
import { icon } from '../icons.js';
import { bottomNav } from './nav.js';

function greeting() {
  const hour = new Date().getHours();
  const day = new Date().toLocaleDateString(undefined, { weekday: 'long' });
  const part = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  return `${day} ${part}`;
}

export function renderHome(root) {
  const points = store.getState().points;

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.innerHTML = `
    <div class="topbar">
      <div style="display:flex;flex-direction:column;gap:2px;">
        <span style="font-family:var(--font-display);font-weight:600;font-size:21px;">Hi, Alex</span>
        <span style="font-size:13px;color:var(--ink-soft);">${greeting()}</span>
      </div>
      <a href="#/parent" class="icon-btn" aria-label="Parent settings">${icon.gear}</a>
    </div>

    <div style="flex-grow:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;padding:0 32px;">
      <a href="#/pick" style="text-decoration:none;width:172px;height:172px;border-radius:50%;background:var(--accent);color:#fff;font-family:var(--font-display);font-weight:600;font-size:21px;line-height:1.3;cursor:pointer;box-shadow:0 14px 26px rgba(47,62,58,0.22);display:flex;align-items:center;justify-content:center;text-align:center;box-shadow:0 0 0 14px var(--accent-tint), 0 14px 26px rgba(47,62,58,0.22);">I need<br>a minute</a>
      <p style="margin:0;text-align:center;font-size:14px;line-height:1.5;color:var(--ink-soft);max-width:250px;">Tap here. Let's feel calm together.</p>
    </div>

    <div style="display:flex;justify-content:center;padding-bottom:14px;">
      <span class="points-chip">${icon.leaf}<span class="tabular">${points} calm points</span></span>
    </div>

    ${bottomNav('home')}
  `;
  root.appendChild(screen);
}
