/**
 * Simulate a click event.
 * @param {Element} elem  the element to simulate a click on
 * @param [options] - The `options` parameter is an object that allows you to customize the behavior of
 * the click event. It has the following properties:
 */
export const simulate_click = (elem, options = { bubbles: false, cancelable: true, view: window }) => {

    const evt = new MouseEvent('click', options)

    // If cancelled, don't dispatch our event
    const canceled = !elem.dispatchEvent(evt)
}


/**
 * The function `createElementFromHTML` creates a DOM element from an HTML string.
 * @param htmlString - The `htmlString` parameter is a string that represents an HTML element or a set
 * of HTML elements.
 * @returns the first child element of the div element created from the provided HTML string.
 */
export const createElementFromHTML = (htmlString) => {

    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()

    return div.firstChild
}


/**
 * The function `reder_el` creates a new HTML element with the specified content, class name, and tag,
 * and returns the element.
 * @param [content] - The content parameter is a string that represents the inner HTML content of the
 * element. It is optional and defaults to an empty string if not provided.
 * @param [class_name] - The class_name parameter is used to specify the CSS class name that you want
 * to add to the created element.
 * @param [tag=div] - The `tag` parameter is used to specify the HTML tag of the element that will be
 * created. By default, it is set to `'div'`, which means that if no value is provided for the `tag`
 * parameter when calling the `reder_el` function, a `<div>` element
 * @returns a newly created HTML element with the specified content, class name, and tag.
 */


export const reder_el = (tag = 'div', classes = [], content = '') => {
    const el = document.createElement(tag)

    if( classes.length ) {
        classes.forEach(class_item => {
            el.classList.add(class_item)
        });
    }

    el.innerHTML = content
    return el
}


/**
 * The function checks if an element is scrollable by comparing its scroll height with its client
 * height and checking its overflowY property.
 * @param e - The parameter "e" represents the element that you want to check if it is scrollable.
 * @returns a boolean value indicating whether the element passed as an argument is scrollable or not.
 */
export const isScrollable = (e) => {
    if (e.scrollTopMax !== undefined)
        return e.scrollTopMax > 0; //All Hail Firefox and it's superior technology!

    if (e == document.scrollingElement) //If what you're checking is BODY (or HTML depending on your css styles)
        return e.scrollHeight > e.clientHeight; //This is a special case.

    return e.scrollHeight > e.clientHeight && ["scroll", "auto"].indexOf(getComputedStyle(e).overflowY) >= 0
}


/**
 * The `collision` function checks if two elements have a collision in the browser window.
 * @param el1 - el1 is the first element that you want to check for collision. It can be any HTML
 * element on the page.
 * @param el2 - The `el2` parameter represents the second element that you want to check for collision
 * with the first element (`el1`).
 * @returns a boolean value. It returns true if there is a collision between the two elements (el1 and
 * el2), and false otherwise.
 */
export const collision = (el1, el2) => {

    const a = el1.getBoundingClientRect();
    const b = el2.getBoundingClientRect();

    return (a.x < (b.x + b.width)) && ((a.x + a.width) > b.x) && (a.y < (b.y + b.height)) && ((a.y + a.height) > b.y);
}


/**
 * The function creates an alert message with a specified type and list of messages, which is displayed
 * for 5 seconds before being removed.
 */
export const wpr_alert = (messages = [], type = 'error') => {

    const last_messages = document.querySelector('.wpr_alert')
    last_messages && last_messages.remove()

    let list = document.createElement('div')
    list.classList.add('wpr_alert')
    list.classList.add(`${type}_list`)
    list.classList.add(type)

    messages.forEach(el => {

        let message = document.createElement('div')
        message.classList.add(type)
        message.classList.add('alert_info')
        message.innerHTML = el

        list.appendChild(message)
    })

    document.querySelector('body').appendChild(list)

    setTimeout(() => list.classList.add('reverse'), 5000)
    setTimeout(() => list.remove(), 6000)
}
