/*jslint
    unordered, long, this, nomen
*/
/*global
    EventTarget
 */
/**
 * Overriding addEventListener and removeEventListener to have
 * property eventListenerList in an element to which en event is set
 *
 * from https://www.sqlpac.com/en/documents/javascript-listing-active-event-listeners.html
 *
 */
EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function (event, listener, options) {
    if (options === undefined) {
        options = false;
    }
    this._addEventListener(event, listener, options);
    if (!this.eventListenerList) {
        this.eventListenerList = {};
    }
    if (!this.eventListenerList[event]) {
        this.eventListenerList[event] = [];
    }
    this.eventListenerList[event].push({"listener": listener, "options": options});
};

EventTarget.prototype._removeEventListener = EventTarget.prototype.removeEventListener;

EventTarget.prototype.removeEventListener = function (event, listener, options) {
    if (options === undefined) {
        options = false;
    }
    this._removeEventListener(event, listener, options);
    if (!this.eventListenerList) {
        this.eventListenerList = {};
    }
    if (!this.eventListenerList[event]) {
        this.eventListenerList[event] = [];
    }
    this.eventListenerList[event] = this.eventListenerList[event].filter(function (element) {
        if (!element.listener === listener && !element.options === options) {
            return true;
        }
    });
    if (this.eventListenerList[event].length === 0) {
        delete this.eventListenerList[event];
    }
};