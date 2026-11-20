// Only this host owns the authenticated operator session and service data.
export const workspaceOrigin = 'https://servicemonitor-werkplaats.melianeahmed93162357.chatgpt.site';
export const publicEntry = 'https://fpvarabic.github.io/firecom-monitor/';
const sections = ['overzicht', 'apparaten', 'incidenten', 'onderhoud', 'reparaties', 'locaties', 'klanten', 'compatibiliteit'];
const detailSections = ['reparaties', 'apparaten', 'incidenten', 'onderhoud', 'locaties', 'klanten'];
function route(page, id) {
    if (!page || !sections.includes(page))
        return '#/overzicht';
    if (!id || (page === 'reparaties' && !/^RMA-[a-zA-Z0-9-]+$/.test(id)))
        return '#/' + page;
    if (!detailSections.includes(page) || id.length > 512 || /[\u0000-\u001f\u007f]/.test(id))
        return '#/' + page;
    return '#/' + page + '/' + encodeURIComponent(id);
}
export function readHash(hash) {
    const parts = /^#\/([a-z]+)(?:\/([^/?#]+))?$/.exec(hash);
    if (!parts)
        return '#/overzicht';
    try {
        return route(parts[1], parts[2] ? decodeURIComponent(parts[2]) : null);
    }
    catch {
        return '#/overzicht';
    }
}
export function workspaceEntry(page, id) {
    const url = new URL('/', workspaceOrigin);
    const [, section, item] = route(page, id).split('/');
    url.searchParams.set('view', section);
    if (item)
        url.searchParams.set('item', decodeURIComponent(item));
    return url.href;
}
// The private gateway can retain the query during sign-in. Move the destination into the
// normal client route on arrival. Existing bookmarks from the former popup flow still work.
export function arrivalRoute(search, hash) {
    const query = new URLSearchParams(search);
    if (query.has('view'))
        return route(query.get('view'), query.get('item'));
    if (query.has('route'))
        return readHash(query.get('route') || '');
    if (hash.startsWith('#firecom-pair=') || /^#[a-f\d]{8}-[a-f\d-]{27}(?:&|$)/i.test(hash)) {
        return readHash(new URLSearchParams(hash.slice(1)).get('route') || '');
    }
    return null;
}
