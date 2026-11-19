import { arrivalRoute, readHash, workspaceEntry } from './workspace-link.js?v=16a4c83d1ec5e34d';

// Old bookmarks and confirmation return URLs still land in the same tab.
function openBookmark() {
  const route = arrivalRoute(location.search, location.hash) ||
    (location.hash.startsWith('#/') ? readHash(location.hash) : null);
  if (!route) return;
  const [, page, id] = route.split('/');
  const destination = page === 'compatibiliteit' ? './catalogus.html' :
    workspaceEntry(page, id ? decodeURIComponent(id) : '');
  document.getElementById('open-workspace').href = destination;
  location.replace(destination);
}
openBookmark();
window.addEventListener('hashchange', openBookmark);
