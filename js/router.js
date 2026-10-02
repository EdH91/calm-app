// Minimal hash router. No build step, no framework -- a route is just a
// function that renders into the #app container.

const routes = new Map();
let appEl = null;
let notFound = () => '<div class="screen"><p style="padding:24px">Page not found.</p></div>';

export function registerRoute(path, renderFn) {
  routes.set(path, renderFn);
}

export function navigate(path) {
  if (location.hash === '#' + path) {
    render(); // re-render even if the hash is unchanged
  } else {
    location.hash = path;
  }
}

function currentPath() {
  const hash = location.hash || '#/home';
  return hash.slice(1);
}

function matchRoute(path) {
  // supports a single :param segment, e.g. /tool/:id
  for (const [pattern, fn] of routes) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);
    if (patternParts.length !== pathParts.length) continue;
    const params = {};
    let matched = true;
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        matched = false;
        break;
      }
    }
    if (matched) return { fn, params };
  }
  return null;
}

function render() {
  const path = currentPath();
  const match = matchRoute(path);
  appEl.innerHTML = '';
  if (!match) {
    appEl.innerHTML = notFound();
    return;
  }
  const result = match.fn(appEl, match.params);
  if (typeof result === 'function') {
    // allow a view to return a cleanup function; run it before the next render
    window.__calmapp_cleanup?.();
    window.__calmapp_cleanup = result;
  }
}

export function startRouter(mountEl) {
  appEl = mountEl;
  window.addEventListener('hashchange', render);
  render();
}
