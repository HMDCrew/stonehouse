/**
 * The function observes mutations in a given element and triggers a callback function when changes
 * occur.
 * @param element - The DOM element that you want to observe for mutations.
 * @param callback - The function that will be called when a mutation is observed on the specified
 * element. This function will receive a list of MutationRecord objects as its argument, which describe
 * the changes that occurred on the observed element.
 * @param [args] - The `args` parameter is an optional object that specifies the types of mutations to
 * observe. It has three properties:
 */
export const observeMutation = (element, callback, args = { attributes: false, childList: true, subtree: true }) => {
    new MutationObserver(callback).observe(element, args);
}