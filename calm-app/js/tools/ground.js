// 5-4-3-2-1 grounding: step through senses, one tap per item found.

const STEPS = [
  { n: 5, label: 'things you can see' },
  { n: 4, label: 'things you can hear' },
  { n: 3, label: 'things you can touch' },
  { n: 2, label: 'things you can smell' },
  { n: 1, label: 'thing you can taste' }
];

export function mount(container, api) {
  let stepIndex = 0;
  let count = 0;
  let done = false;
  let advanceTimer = null;

  container.innerHTML = `
    <div style="display:flex;justify-content:center;gap:10px;padding:4px 0 0;">
      ${STEPS.map((_, i) => `<div class="dot" id="step-dot-${i}"></div>`).join('')}
    </div>
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;padding:0 32px;">
      <div id="active-view" style="display:flex;flex-direction:column;align-items:center;gap:24px;">
        <span id="prompt" style="font-family:var(--font-display);font-weight:600;font-size:20px;text-align:center;line-height:1.4;"></span>
        <div id="marks" style="display:flex;gap:8px;"></div>
        <button id="tap-btn" style="width:172px;height:172px;border-radius:50%;border:none;background:var(--warm);color:#fff;font-family:var(--font-display);font-weight:600;font-size:17px;cursor:pointer;box-shadow:0 10px 30px rgba(47,62,58,0.18);"></button>
        <span id="count-label" style="font-size:13px;color:var(--warm);"></span>
      </div>
      <div id="done-view" style="display:none;flex-direction:column;align-items:center;gap:16px;">
        <div style="width:84px;height:84px;border-radius:50%;background:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--warm)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
        </div>
        <span style="font-family:var(--font-display);font-weight:600;font-size:21px;">Nice noticing!</span>
        <button id="finish-btn" class="btn-primary" style="background:var(--warm);">Finish</button>
      </div>
    </div>
  `;

  const activeView = container.querySelector('#active-view');
  const doneView = container.querySelector('#done-view');
  const prompt = container.querySelector('#prompt');
  const marks = container.querySelector('#marks');
  const tapBtn = container.querySelector('#tap-btn');
  const countLabel = container.querySelector('#count-label');
  const stepDots = STEPS.map((_, i) => container.querySelector(`#step-dot-${i}`));

  function render() {
    activeView.style.display = done ? 'none' : 'flex';
    doneView.style.display = done ? 'flex' : 'none';
    if (done) return;

    const cur = STEPS[stepIndex];
    prompt.textContent = `Find ${cur.n} ${cur.label}`;
    countLabel.textContent = `${count} of ${cur.n}`;
    tapBtn.textContent = count >= cur.n ? 'Got it!' : 'I found one';

    marks.innerHTML = Array.from({ length: cur.n }, (_, i) => {
      const filled = i < count;
      return `<div style="width:16px;height:16px;border-radius:50%;background:${filled ? 'var(--warm)' : 'rgba(138,90,30,0.25)'};"></div>`;
    }).join('');

    stepDots.forEach((d, i) => {
      d.style.background = i < stepIndex ? 'var(--warm)' : i === stepIndex ? '#B9812F' : 'rgba(138,90,30,0.3)';
    });
  }

  tapBtn.addEventListener('click', () => {
    const cur = STEPS[stepIndex];
    count += 1;
    render();
    if (count >= cur.n) {
      advanceTimer = setTimeout(() => {
        if (stepIndex >= STEPS.length - 1) {
          done = true;
        } else {
          stepIndex += 1;
          count = 0;
        }
        render();
      }, 450);
    }
  });

  container.querySelector('#finish-btn').addEventListener('click', () => api.finish());

  render();

  return () => {
    if (advanceTimer) clearTimeout(advanceTimer);
  };
}
