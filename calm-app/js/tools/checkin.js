// Sensory check-in: tap a size from small to big for how the feeling
// feels right now. Small/medium closes the loop on its own; big routes
// back to the tool picker instead, since a big feeling usually needs
// one of the other tools, not just the act of naming it.

const SIZES = [34, 44, 54, 64, 74];

export function mount(container, api) {
  let picked = null;

  container.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;padding:0 32px;">
      <span style="font-family:var(--font-display);font-weight:600;font-size:19px;text-align:center;">How big does this feeling feel?</span>
      <div id="sizes" style="display:flex;align-items:flex-end;gap:14px;height:90px;"></div>
      <div style="display:flex;justify-content:space-between;width:100%;max-width:260px;font-size:11px;color:var(--clay);">
        <span>small</span><span>big</span>
      </div>
      <div id="result" style="display:none;flex-direction:column;align-items:center;gap:18px;">
        <span id="message" style="font-size:14px;text-align:center;max-width:260px;line-height:1.5;"></span>
        <button id="action-btn" class="btn-primary" style="background:var(--clay);"></button>
      </div>
    </div>
  `;

  const sizesEl = container.querySelector('#sizes');
  const result = container.querySelector('#result');
  const message = container.querySelector('#message');
  const actionBtn = container.querySelector('#action-btn');

  function renderSizes() {
    sizesEl.innerHTML = SIZES.map((px, i) => {
      const n = i + 1;
      const isPicked = picked === n;
      const fill = isPicked ? 'var(--clay)' : 'rgba(161,92,72,0.15)';
      const border = isPicked ? 'var(--clay)' : 'rgba(161,92,72,0.35)';
      return `<button data-n="${n}" aria-label="Feeling size ${n} of 5" style="width:${px}px;height:${px}px;border-radius:50%;border:2px solid ${border};background:${fill};cursor:pointer;padding:0;"></button>`;
    }).join('');
  }

  function render() {
    renderSizes();
    if (picked === null) {
      result.style.display = 'none';
      return;
    }
    result.style.display = 'flex';
    if (picked <= 2) {
      message.textContent = "That's small. Nice job noticing!";
      actionBtn.textContent = 'All done';
    } else if (picked === 3) {
      message.textContent = 'That’s medium-sized. Checking in helps.';
      actionBtn.textContent = 'All done';
    } else {
      message.textContent = "That's a big feeling. Let's find a tool to help.";
      actionBtn.textContent = 'Find a tool';
    }
  }

  sizesEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-n]');
    if (!btn) return;
    picked = Number(btn.dataset.n);
    render();
  });

  actionBtn.addEventListener('click', () => {
    if (picked >= 4) {
      api.exit('/pick');
    } else {
      api.finish();
    }
  });

  render();
}
