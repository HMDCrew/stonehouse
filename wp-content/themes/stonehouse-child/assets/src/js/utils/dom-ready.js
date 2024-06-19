/**
 * The "ready" function checks if the document is ready and then executes a callback function.
 * @param callbackFunc - The `callbackFunc` parameter is a function that will be executed when the
 * document is ready. It is a callback function that you can define and pass as an argument to the
 * `ready` function.
 */
export const ready = (callbackFunc) => {
    if (document.readyState !== 'loading') {
        callbackFunc();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callbackFunc);
    } else {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState === 'complete') {
                callbackFunc();
            }
        });
    }
}