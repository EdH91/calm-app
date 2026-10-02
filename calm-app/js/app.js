import { registerRoute, startRouter } from './router.js';
import { renderHome } from './views/home.js';
import { renderToolPicker } from './views/toolpicker.js';
import { renderToolView } from './views/tool.js';
import { renderCompletion } from './views/completion.js';
import { renderRewards } from './views/rewards.js';
import { renderParent } from './views/parent.js';

registerRoute('/home', renderHome);
registerRoute('/pick', renderToolPicker);
registerRoute('/tool/:id', renderToolView);
registerRoute('/finish/:toolId/:points', renderCompletion);
registerRoute('/rewards', renderRewards);
registerRoute('/parent', renderParent);

startRouter(document.getElementById('app'));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // offline support is a nice-to-have; ignore registration failures
    });
  });
}
