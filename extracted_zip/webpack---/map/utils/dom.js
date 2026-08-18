export function createElem(tagName, className, container) {
    const el = window.document.createElement(tagName);
    if (className !== undefined) {
        el.className = className;
    }
    if (container) {
        container.appendChild(el);
    }
    return el;
}
