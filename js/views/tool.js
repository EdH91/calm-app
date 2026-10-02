import { getTool } from '../registry.js';
import { store } from '../state.js';
import { navigate } from '../router.js';

export function renderToolView(root, { id }) {
  const tool = getTool(id);
  if (!tool) {
    root.innerHTML = `<div class="screen"><p style="padding:24px">Unknown tool.</p><a href="#/pick">Back to tools</a></div>`;
    return;
  }

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.style.background = tool.bg;
  screen.innerHTML = `
    <div class="topbar" style="justify-content:flex-end;">
      <a href="#/home" class="exit-link" style="color:${tool.fg};">Done</a>
    </div>
    <div class="tool-content" style="flex:1;display:flex;flex-direction:column;"></div>
  `;
  root.appendChild(screen);
  const content = screen.querySelector('.tool-content');

  const api = {
    tint: tool,
    finish() {
      const pointsAwarded = store.recordToolUse(tool.id);
      navigate(`/finish/${tool.id}/${pointsAwarded}`);
    },
    exit(path) {
      navigate(path || '/home');
    }
  };

  return tool.mount(content, api);
}
