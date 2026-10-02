import { store } from '../state.js';
import { getTool } from '../registry.js';
import { bottomNav } from './nav.js';

function timeAgo(ts) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (sameDay) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${time}`;
}

export function renderParent(root) {
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;padding:22px 24px 0;">
      <span style="font-family:var(--font-display);font-weight:600;font-size:21px;">Parent view</span>
    </div>

    <div id="stats-row" style="display:flex;gap:10px;padding:16px 24px 0;"></div>

    <div style="padding:20px 24px 8px;">
      <span style="font-size:12px;font-weight:700;color:var(--ink-soft);letter-spacing:0.04em;text-transform:uppercase;">Recent check-ins</span>
    </div>
    <div id="recent-log" style="display:flex;flex-direction:column;gap:8px;padding:0 24px;"></div>

    <div style="padding:18px 24px 8px;">
      <span style="font-size:12px;font-weight:700;color:var(--ink-soft);letter-spacing:0.04em;text-transform:uppercase;">Rewards &amp; costs</span>
    </div>
    <div id="rewards-admin" style="flex-grow:1;display:flex;flex-direction:column;gap:8px;padding:0 24px;overflow:auto;"></div>
    <div style="padding:10px 24px calc(14px + env(safe-area-inset-bottom, 0px));">
      <button id="add-reward-btn" class="btn-ghost" style="width:100%;">+ Add reward</button>
    </div>

    ${bottomNav('parent')}
  `;
  root.appendChild(screen);

  const statsRow = screen.querySelector('#stats-row');
  const recentLog = screen.querySelector('#recent-log');
  const rewardsAdmin = screen.querySelector('#rewards-admin');

  function renderStats() {
    const stats = store.weekStats();
    const mostUsedLabel = stats.mostUsed ? getTool(stats.mostUsed)?.label || stats.mostUsed : '—';
    statsRow.innerHTML = `
      <div class="stat-tile"><span class="tabular" style="font-family:var(--font-display);font-weight:700;font-size:19px;">${stats.checkIns}</span><span style="font-size:11px;color:var(--muted);">check-ins this week</span></div>
      <div class="stat-tile"><span style="font-family:var(--font-display);font-weight:700;font-size:19px;">${mostUsedLabel}</span><span style="font-size:11px;color:var(--muted);">most used tool</span></div>
      <div class="stat-tile"><span class="tabular" style="font-family:var(--font-display);font-weight:700;font-size:19px;">${stats.streak}</span><span style="font-size:11px;color:var(--muted);">day streak</span></div>
    `;
  }

  function renderLog() {
    const entries = store.recentLog(10);
    if (!entries.length) {
      recentLog.innerHTML = `<div class="card"><span style="font-size:13px;color:var(--muted);">No check-ins yet.</span></div>`;
      return;
    }
    recentLog.innerHTML = entries
      .map((e) => {
        const tool = getTool(e.toolId);
        return `
          <div class="card" style="display:flex;align-items:center;gap:12px;">
            <div style="width:30px;height:30px;border-radius:50%;background:${tool ? tool.bg : 'var(--line)'};flex-shrink:0;"></div>
            <span style="flex-grow:1;font-size:13px;">${tool ? tool.label : e.toolId}</span>
            <span style="font-size:12px;color:var(--muted);white-space:nowrap;">${timeAgo(e.ts)}</span>
          </div>`;
      })
      .join('');
  }

  function renderRewardsAdmin() {
    const rewards = store.getState().rewards;
    rewardsAdmin.innerHTML = rewards
      .map(
        (r) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 2px;">
          <span style="font-size:13px;">${r.name}</span>
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="tabular" style="font-size:12px;color:var(--muted);">${r.cost} pts</span>
            <button data-edit="${r.id}" style="border:none;background:transparent;font-size:12px;font-weight:700;color:var(--accent);cursor:pointer;padding:4px;">Edit</button>
            <button data-remove="${r.id}" style="border:none;background:transparent;font-size:12px;font-weight:700;color:var(--muted);cursor:pointer;padding:4px;">Remove</button>
          </div>
        </div>`
      )
      .join('');
  }

  rewardsAdmin.addEventListener('click', (e) => {
    const editBtn = e.target.closest('button[data-edit]');
    const removeBtn = e.target.closest('button[data-remove]');
    if (editBtn) {
      const rewards = store.getState().rewards;
      const reward = rewards.find((r) => r.id === editBtn.dataset.edit);
      const name = prompt('Reward name', reward.name);
      if (name === null) return;
      const costStr = prompt('Point cost', String(reward.cost));
      if (costStr === null) return;
      const cost = Math.max(1, parseInt(costStr, 10) || reward.cost);
      store.updateReward(reward.id, { name, cost });
      renderRewardsAdmin();
    } else if (removeBtn) {
      store.removeReward(removeBtn.dataset.remove);
      renderRewardsAdmin();
    }
  });

  screen.querySelector('#add-reward-btn').addEventListener('click', () => {
    const name = prompt('New reward name');
    if (!name) return;
    const costStr = prompt('Point cost', '30');
    const cost = Math.max(1, parseInt(costStr, 10) || 30);
    store.addReward(name, cost);
    renderRewardsAdmin();
  });

  renderStats();
  renderLog();
  renderRewardsAdmin();
}
