let lastKnownScrollPosition = 0;
let ticking = false;


/**
 * The function "handle_scroll" is used to debounce scroll events and execute a callback function with
 * the last known scroll position.
 * @param event - The `event` parameter is the event object that is passed to the `handle_scroll`
 * function. It contains information about the scroll event, such as the scroll position and any other
 * relevant data.
 * @param callback - The `callback` parameter is a function that will be called when the scroll event
 * occurs. It takes two parameters: `event` and `lastKnownScrollPosition`. The `event` parameter
 * represents the scroll event object, which contains information about the scroll event. The
 * `lastKnownScrollPosition` parameter
 */
const handle_scroll = (event, callback) => {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            callback(event, lastKnownScrollPosition);
            ticking = false;
        });

        ticking = true;
    }
}


/**
 * The function `on_scroll` adds an event listener to the document that triggers a callback function
 * when the scroll event occurs.
 * @param callback - The `callback` parameter is a function that will be called whenever the scroll
 * event occurs. It is a function that you can define and pass as an argument to the `on_scroll`
 * function. The `callback` function will be executed with the `event` object as its argument.
 */
export const on_scroll = (callback) => {
    document.addEventListener('scroll', (event) => handle_scroll(event, callback))
}
