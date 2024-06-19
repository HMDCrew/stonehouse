/**
 * It calls a callback function whenever an element appears or disappears from the viewport
 * @param element - The element to observe.
 * @param callback - A function that will be called when the element appears or disappears.
 */
export const observeElementAppearing = (element, callback) => {

    const ro = new ResizeObserver(() => {
        const r = element.getBoundingClientRect();
        const appearing = Boolean(r.top && r.left && r.width && r.height);
        callback(appearing);
    });

    ro.observe(element);
}