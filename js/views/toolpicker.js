import { TOOLS } from '../registry.js';
import { icon } from '../icons.js';

export function renderToolPicker(root) {
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;padding:22px 24px 6px;">
      <a href="#/home" class="icon-btn" aria-label="Close">${icon.close}</a>
      <span style="font-family:var(--font-display);font-weight:600;font-size:19px;">Choose a tool</span>
    </div>
    <p style="margin:4px 24px 20px;font-size:13px;color:var(--ink-soft);max-width:300px;">Pick one. Any one is okay.</p>

    <div class="tool-grid" style="flex-grow:1;">
      ${TOOLS.map(
        (tool) => `
        <a href="#/tool/${tool.id}" class="tool-tile${tool.wide ? ' wide' : ''}" style="background:${tool.bg};">
          <span style="color:${tool.fg};display:flex;">${tool.tileIcon}</span>
          <div style="display:flex;flex-direction:column;align-items:${tool.wide ? 'flex-start' : 'center'};gap:2px;">
            <span class="tool-name">${tool.label}</span>
            <span class="tool-sub" style="color:${tool.fg};">${tool.sublabel}</span>
          </div>
        </a>`
      ).join('')}
    </div>

    <div style="padding:20px 24px calc(24px + env(safe-area-inset-bottom, 0px));">
      <span style="font-size:12px;color:var(--muted);">You earn points just for trying.</span>
    </div>
  `;
  root.appendChild(screen);
}
