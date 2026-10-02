// Breathing exercise: an original friendly creature (not any copyrighted
// character) with a big torso that visibly rises and falls. Sequence per
// cycle: inhale -> short hold -> exhale, with the exhale 20% longer than
// the inhale, repeated for 4 cycles.

const PACES = {
  calm: { in: 4000, pause: 1000, out: 4800, label: 'Calm' },
  slow: { in: 6000, pause: 1500, out: 7200, label: 'Slower' }
};
const ORDER = ['in', 'pause', 'out'];
const TOTAL_CYCLES = 4;

export function mount(container, api) {
  let running = false;
  let done = false;
  let phase = 'in';
  let phaseStart = 0;
  let cycle = 1;
  let paceKey = 'calm';
  let raf = null;

  container.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;">
      <button id="creature-btn" aria-label="Start breathing exercise" style="border:none;background:transparent;padding:0;cursor:pointer;width:220px;height:240px;">
        <svg viewBox="0 0 220 240" width="220" height="240">
          <ellipse cx="110" cy="226" rx="56" ry="8" fill="rgba(47,62,58,0.12)"></ellipse>
          <ellipse id="torso" cx="110" cy="140" rx="66" ry="72" fill="var(--accent)"></ellipse>
          <ellipse id="belly" cx="110" cy="168" rx="42" ry="44" fill="var(--accent-tint)"></ellipse>
          <ellipse cx="46" cy="138" rx="14" ry="30" fill="var(--accent)" transform="rotate(20 46 138)"></ellipse>
          <ellipse cx="174" cy="138" rx="14" ry="30" fill="var(--accent)" transform="rotate(-20 174 138)"></ellipse>
          <ellipse cx="88" cy="208" rx="15" ry="19" fill="var(--accent-dark)"></ellipse>
          <ellipse cx="132" cy="208" rx="15" ry="19" fill="var(--accent-dark)"></ellipse>
          <circle cx="110" cy="60" r="38" fill="var(--accent)"></circle>
          <circle cx="80" cy="33" r="11" fill="var(--accent)"></circle>
          <circle cx="140" cy="33" r="11" fill="var(--accent)"></circle>
          <circle cx="80" cy="70" r="8" fill="rgba(226,148,140,0.55)"></circle>
          <circle cx="140" cy="70" r="8" fill="rgba(226,148,140,0.55)"></circle>
          <ellipse cx="92" cy="56" rx="11" ry="13" fill="#FFFFFF"></ellipse>
          <ellipse cx="128" cy="56" rx="11" ry="13" fill="#FFFFFF"></ellipse>
          <circle cx="93" cy="58" r="5.5" fill="#2F3E3A"></circle>
          <circle cx="127" cy="58" r="5.5" fill="#2F3E3A"></circle>
          <path d="M98 76 Q110 84 122 76" stroke="#2F3E3A" stroke-width="3" fill="none" stroke-linecap="round"></path>
        </svg>
      </button>
      <span id="label" style="font-family:var(--font-display);font-weight:600;font-size:19px;">Tap to start</span>
      <div class="dots" id="dots">
        ${[0, 1, 2, 3].map((i) => `<div class="dot" id="dot-${i}"></div>`).join('')}
      </div>
      <span id="cycle-label" style="font-size:13px;color:var(--accent-dark);">Cycle 1 of 4</span>
    </div>
    <div id="finish-row" style="display:none;justify-content:center;padding:0 24px 18px;">
      <button id="finish-btn" class="btn-primary" style="background:var(--accent-dark);">Finish</button>
    </div>
    <div id="pace-row" style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:0 24px calc(28px + env(safe-area-inset-bottom, 0px));">
      <span style="font-size:12px;color:var(--accent-dark);letter-spacing:0.04em;text-transform:uppercase;">Pace</span>
      <div class="pill-toggle" id="pace-toggle" style="color:var(--accent-dark);">
        <button data-pace="calm" class="selected">Calm</button>
        <button data-pace="slow">Slower</button>
      </div>
    </div>
  `;

  const torso = container.querySelector('#torso');
  const belly = container.querySelector('#belly');
  const label = container.querySelector('#label');
  const cycleLabel = container.querySelector('#cycle-label');
  const dots = [0, 1, 2, 3].map((i) => container.querySelector(`#dot-${i}`));
  const creatureBtn = container.querySelector('#creature-btn');
  const finishRow = container.querySelector('#finish-row');
  const finishBtn = container.querySelector('#finish-btn');
  const paceRow = container.querySelector('#pace-row');
  const paceToggle = container.querySelector('#pace-toggle');

  function updateDots() {
    dots.forEach((d, i) => {
      d.style.background = i === cycle - 1 ? 'var(--accent)' : '#B9CBC1';
    });
  }

  function render() {
    let fullness = 0;
    if (running) {
      const d = PACES[paceKey];
      const elapsed = Math.min(performance.now() - phaseStart, d[phase]);
      const frac = d[phase] ? elapsed / d[phase] : 1;
      if (phase === 'in') fullness = frac;
      else if (phase === 'pause') fullness = 1;
      else fullness = 1 - frac;
    }
    torso.setAttribute('rx', (66 + 8 * fullness).toFixed(1));
    torso.setAttribute('ry', (72 + 20 * fullness).toFixed(1));
    belly.setAttribute('rx', (42 + 10 * fullness).toFixed(1));
    belly.setAttribute('ry', (44 + 18 * fullness).toFixed(1));

    label.textContent = !running
      ? (done ? 'Well done!' : 'Tap to start')
      : phase === 'in' ? 'Breathe in' : phase === 'pause' ? 'Hold' : 'Breathe out';
    cycleLabel.textContent = `Cycle ${cycle} of 4`;
    updateDots();

    finishRow.style.display = done ? 'flex' : 'none';
    paceRow.style.display = done ? 'none' : 'flex';
    creatureBtn.setAttribute('aria-label', running ? 'Pause breathing exercise' : 'Start breathing exercise');
  }

  function tick() {
    if (running) {
      const d = PACES[paceKey];
      const elapsed = performance.now() - phaseStart;
      if (elapsed >= d[phase]) {
        const idx = ORDER.indexOf(phase);
        if (idx === ORDER.length - 1) {
          if (cycle >= TOTAL_CYCLES) {
            running = false;
            done = true;
            cycle = 1;
            phase = 'in';
          } else {
            phase = ORDER[0];
            phaseStart = performance.now();
            cycle += 1;
          }
        } else {
          phase = ORDER[idx + 1];
          phaseStart = performance.now();
        }
      }
    }
    render();
    raf = requestAnimationFrame(tick);
  }

  creatureBtn.addEventListener('click', () => {
    if (running) {
      running = false;
    } else {
      running = true;
      done = false;
      phase = 'in';
      cycle = 1;
      phaseStart = performance.now();
    }
    render();
  });

  paceToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-pace]');
    if (!btn) return;
    paceKey = btn.dataset.pace;
    running = false;
    done = false;
    phase = 'in';
    cycle = 1;
    paceToggle.querySelectorAll('button').forEach((b) => b.classList.toggle('selected', b === btn));
    render();
  });

  finishBtn.addEventListener('click', () => api.finish());

  render();
  raf = requestAnimationFrame(tick);

  return () => {
    if (raf) cancelAnimationFrame(raf);
  };
}
