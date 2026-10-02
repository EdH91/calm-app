import { store } from '../state.js';
import { icon } from '../icons.js';
import { bottomNav } from './nav.js';

export function renderRewards(root) {
  const state = store.getState();

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.innerHTML = `
    <div style="padding:22px 24px 0;">
      <span style="font-family:var(--font-display);font-weight:600;font-size:21px;">My rewards</span>
    </div>

    <div style="margin:16px 24px;background:var(--warm-tint);border-radius:18px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;color:var(--warm);">
      <div style="display:flex;flex-direction:column;gap:2px;">
        <span style="font-size:12px;letter-spacing:0.04em;text-transform:uppercase;">Balance</span>
        <span class="tabular" style="font-family:var(--font-display);font-weight:700;font-size:30px;">${state.points}</span>
      </div>
      ${icon.leaf}
    </div>

    <div id="reward-list" style="flex-grow:1;display:flex;flex-direction:column;gap:10px;padding:0 24px;overflow:auto;"></div>

    ${bottomNav('rewards')}
  `;
  root.appendChild(screen);

  const list = screen.querySelector('#reward-list');

  function renderList() {
    const current = store.getState();
    list.innerHTML = current.rewards
      .map((r) => {
        const canRedeem = current.points >= r.cost;
        if (canRedeem) {
          return `
            <div class="card" style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <span style="font-weight:600;font-size:14px;">${r.name}</span>
                <span class="tabular" style="font-size:12px;color:var(--muted);">${r.cost} points</span>
              </div>
              <button data-redeem="${r.id}" style="border:none;border-radius:999px;background:var(--accent);color:#fff;font-weight:700;font-size:12px;padding:9px 16px;cursor:pointer;">Redeem</button>
            </div>`;
        }
        return `
          <div class="card" style="display:flex;align-items:center;justify-content:space-between;opacity:0.55;">
            <div style="display:flex;flex-direction:column;gap:2px;">
              <span style="font-weight:600;font-size:14px;">${r.name}</span>
              <span class="tabular" style="font-size:12px;color:var(--muted);">${r.cost} points</span>
            </div>
            <span class="tabular" style="font-size:12px;font-weight:600;color:var(--muted);white-space:nowrap;">${r.cost - current.points} to go</span>
          </div>`;
      })
      .join('');
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-redeem]');
    if (!btn) return;
    const ok = store.redeemReward(btn.dataset.redeem);
    if (ok) renderList();
  });

  renderList();
}
