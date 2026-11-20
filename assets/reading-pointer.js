// Chromium can place a collapsed document selection on ordinary text after a pointer click.
// Keep the native caret in editors, keyboard caret navigation and actual text selections.
const editor = 'input,textarea,[role="textbox"]';
function editing(node) {
    return !!node && (node.closest(editor) !== null || (node instanceof HTMLElement && node.isContentEditable));
}
let frame = 0;
document.addEventListener('pointerdown', event => {
    cancelAnimationFrame(frame);
    if (event.isPrimary)
        document.documentElement.toggleAttribute('data-reading-pointer', !editing(event.target));
}, true);
document.addEventListener('keydown', () => {
    cancelAnimationFrame(frame);
    document.documentElement.removeAttribute('data-reading-pointer');
}, true);
document.addEventListener('focusin', event => {
    if (editing(event.target))
        document.documentElement.removeAttribute('data-reading-pointer');
});
document.addEventListener('click', event => {
    if (event.button !== 0 || event.detail !== 1 || event.shiftKey || editing(event.target))
        return;
    frame = requestAnimationFrame(() => {
        if (!document.documentElement.hasAttribute('data-reading-pointer') || editing(document.activeElement))
            return;
        const selection = window.getSelection();
        if (selection?.rangeCount && selection.isCollapsed && !editing(selection.anchorNode?.parentElement ?? null))
            selection.removeAllRanges();
    });
}, true);
export {};
