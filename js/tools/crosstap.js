// Cross-tap (butterfly-hug style bilateral tapping), the same technique
// Alex's therapist uses -- this just gives him a self-serve version with
// a simple illustration, a steady alternating tap cue, and a timer.

const DURATIONS = [10, 20, 30];
const TAP_INTERVAL_MS = 450;

export function mount(container, api) {
  let duration = 20;
  let remaining = 20;
  let running = false;
  let done = false;
  let tapSide = 'left';
  let countdownInterval = null;
  let tapInterval = null;

  container.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;padding:4px 32px 0;gap:4px;">
      <span style="font-family:var(--font-display);font-weight:600;font-size:18px;text-align:center;">Cross your arms. Tap each shoulder.</span>
    </div>
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;">
      <svg viewBox="0 0 220 230" width="200" height="209">
        <path d="M30 230 L30 150 Q30 80 110 80 Q190 80 190 150 L190 230 Z" fill="#D9B6BE"></path>
        <circle cx="110" cy="46" r="28" fill="#D9B6BE"></circle>
        <ellipse id="hand-left" cx="146" cy="118" rx="19" ry="24" fill="var(--rose)" transform="rotate(-18 146 118)"></ellipse>
        <ellipse id="hand-right" cx="74" cy="118" rx="19" ry="24" fill="var(--rose)" transform="rotate(18 74 118)"></ellipse>
      </svg>
      <span style="font-size:13px;color:var(--rose);max-width:260px;text-align:center;line-height:1.5;">Right hand taps your left shoulder. Left hand taps your right. Slow and steady.</span>
      <div class="ring-timer" id="ring" style="width:150px;height:150px;margin-top:4px;">
        <div class="hole" style="width:128px;height:128px;background:var(--rose-tint);">
          <button id="run-btn" style="width:104px;height:104px;background:var(--rose);">
            <span id="remaining" class="tabular" style="font-family:var(--font-display);font-weight:700;font-size:26px;"></span>
            <span id="hint" style="font-size:11px;color:rgba(255,255,255,0.85);"></span>
          </button>
        </div>
      </div>
      <div id="done-row" style="display:none;">
        <button id="finish-btn" class="btn-primary" style="background:var(--rose);margin-top:6px;">Finish</button>
      </div>
      <div id="duration-row" style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:4px;">
        <span style="font-size:12px;color:var(--rose);letter-spacing:0.04em;text-transform:uppercase;">Time</span>
        <div class="pill-toggle" id="duration-toggle" style="color:var(--rose);">
          ${DURATIONS.map((s) => `<button data-sec="${s}" class="${s === duration ? 'selected' : ''}">${s}s</button>`).join('')}
        </div>
      </div>
    </div>
  `;

  const handLeft = container.querySelector('#hand-left');
  const handRight = container.querySelector('#hand-right');
  const ring = container.querySelector('#ring');
  const runBtn = container.querySelector('#run-btn');
  const remainingEl = container.querySelector('#remaining');
  const hintEl = container.querySelector('#hint');
  const doneRow = container.querySelector('#done-row');
  const durationRow = container.querySelector('#duration-row');
  const durationToggle = container.querySelector('#duration-toggle');

  function render() {
    const deg = Math.round(((duration - remaining) / duration) * 360);
    ring.style.background = `conic-gradient(var(--rose) ${deg}deg, rgba(255,255,255,0.55) 0deg)`;
    remainingEl.textContent = remaining;
    hintEl.textContent = done ? 'tap to restart' : running ? 'seconds left' : 'tap to start';
    doneRow.style.display = done ? 'block' : 'none';
    durationRow.style.display = done ? 'none' : 'flex';

    const baseCy = 118;
    const offset = 10;
    handLeft.setAttribute('cy', running && tapSide === 'left' ? baseCy + offset : baseCy);
    handRight.setAttribute('cy', running && tapSide === 'right' ? baseCy + offset : baseCy);
  }

  runBtn.addEventListener('click', () => {
    if (done) {
      remaining = duration;
      done = false;
      running = true;
      tapSide = 'left';
    } else {
      running = !running;
    }
    render();
  });

  durationToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-sec]');
    if (!btn) return;
    duration = Number(btn.dataset.sec);
    remaining = duration;
    running = false;
    done = false;
    durationToggle.querySelectorAll('button').forEach((b) => b.classList.toggle('selected', b === btn));
    render();
  });

  countdownInterval = setInterval(() => {
    if (!running) return;
    remaining -= 1;
    if (remaining <= 0) {
      remaining = 0;
      running = false;
      done = true;
    }
    render();
  }, 1000);

  tapInterval = setInterval(() => {
    if (!running) return;
    tapSide = tapSide === 'left' ? 'right' : 'left';
    render();
  }, TAP_INTERVAL_MS);

  container.querySelector('#finish-btn').addEventListener('click', () => api.finish());

  render();

  return () => {
    clearInterval(countdownInterval);
    clearInterval(tapInterval);
  };
}
