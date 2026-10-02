import { getTool } from '../registry.js';
import { icon } from '../icons.js';

export function renderCompletion(root, { toolId, points }) {
  const tool = getTool(toolId);
  const name = tool ? tool.label : 'that tool';
  const pointsNum = Number(points) || 0;

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.innerHTML = `
    <div style="flex-grow:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:0 36px;">
      <div style="width:84px;height:84px;border-radius:50%;background:var(--accent-tint);display:flex;align-items:center;justify-content:center;color:var(--accent-dark);">
        ${icon.check}
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
        <span style="font-family:var(--font-display);font-weight:600;font-size:22px;">Nice and calm.</span>
        <span style="font-size:14px;color:var(--ink-soft);text-align:center;">You used ${name}.</span>
      </div>
      ${
        pointsNum > 0
          ? `<span class="points-chip">${icon.leaf}<span class="tabular">+${pointsNum} calm points</span></span>`
          : `<span style="font-size:13px;color:var(--ink-soft);">That one's already earned points this hour — nice try again!</span>`
      }
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;padding:0 24px calc(28px + env(safe-area-inset-bottom, 0px));">
      <a href="#/home" class="btn-primary">Back home</a>
      <a href="#/pick" class="btn-ghost">Try another tool</a>
    </div>
  `;
  root.appendChild(screen);
}
