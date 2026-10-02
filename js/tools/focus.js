// Single-object focus: a 30-second countdown with a filling progress ring.

const DURATION = 30;

export function mount(container, api) {
  let running = false;
  let remaining = DURATION;
  let done = false;
  let interval = null;

  container.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;padding:0 36px;">
      <span style="font-family:var(--font-display);font-weight:600;font-size:18px;text-align:center;line-height:1.4;">Pick one thing near you.<br>Just look at it.</span>
      <div class="ring-timer" id="ring" style="width:240px;height:240px;">
        <div class="hole" style="width:208px;height:208px;background:var(--lavender-tint);">
          <button id="run-btn" style="width:172px;height:172px;background:var(--lavender);box-shadow:0 10px 30px rgba(47,62,58,0.18);">
            <span id="remaining" class="tabular" style="font-family:var(--font-display);font-weight:700;font-size:34px;"></span>
            <span id="hint" style="font-size:12px;color:rgba(255,255,255,0.85);"></span>
          </button>
        </div>
      </div>
      <div id="done-row" style="display:none;flex-direction:column;align-items:center;gap:16px;">
        <span style="font-family:var(--font-display);font-weight:600;font-size:19px;">Nice focus!</span>
        <button id="finish-btn" class="btn-primary" style="background:var(--lavender);">Finish</button>
      </div>
    </div>
  `;

  const ring = container.querySelector('#ring');
  const runBtn = container.querySelector('#run-btn');
  const remainingEl = container.querySelector('#remaining');
  const hintEl = container.querySelector('#hint');
  const doneRow = container.querySelector('#done-row');

  function render() {
    const deg = Math.round(((DURATION - remaining) / DURATION) * 360);
    ring.style.background = `conic-gradient(var(--lavender) ${deg}deg, rgba(255,255,255,0.55) 0deg)`;
    remainingEl.textContent = remaining;
    hintEl.textContent = done ? 'tap to restart' : running ? 'seconds left' : 'tap to start';
    doneRow.style.display = done ? 'flex' : 'none';
  }

  runBtn.addEventListener('click', () => {
    if (done) {
      remaining = DURATION;
      done = false;
      running = true;
    } else {
      running = !running;
    }
    render();
  });

  interval = setInterval(() => {
    if (!running) return;
    remaining -= 1;
    if (remaining <= 0) {
      remaining = 0;
      running = false;
      done = true;
    }
    render();
  }, 1000);

  container.querySelector('#finish-btn').addEventListener('click', () => api.finish());

  render();

  return () => clearInterval(interval);
}
