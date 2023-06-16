// This code is mostly not mine. 
// Relevant links:
//   - https://pastebin.com/raw/7DuFYDpJ
//   - https://www.reddit.com/r/Bitburner/comments/btea4k/comment/i9ljape

const doc = eval('document');

/**
 * Wrap all event listeners with a custom function that injects
 * the 'isTrusted' flag.
 *
 * Is this cheating? Or is it real hacking? Don't care, as long
 * as it's working :)
 */
export function wrapEventListeners() {
  if (!doc._addEventListener) {
    doc._addEventListener = doc.addEventListener;

    doc.addEventListener = function (type, callback, options = false) {
      let handler;

      // For this script, we only want to modify 'keydown' events.
      if (type === 'keydown') {
        handler = function (...args) {
          const arg = args[0];

          if (!arg.isTrusted) {
            // Clone the event and make it trusted
            //   Look, I get that this might not the be most beautiful 46 lines in the world,
            //   but the performance benefits are worth it.
            const hackedEvent = {
                isTrusted: true,
                      key: arg.key,
                     code: arg.code,
                 location: arg.location,
                  ctrlKey: arg.ctrlKey,
                 shiftKey: arg.shiftKey,
                   altKey: arg.altKey,
                  metaKey: arg.metaKey,
                   repeat: arg.repeat,
              isComposing: arg.isComposing,
                 charCode: arg.charCode,
                  keyCode: arg.keyCode,
DOM_KEY_LOCATION_STANDARD: arg.DOM_KEY_LOCATION_STANDARD,
    DOM_KEY_LOCATION_LEFT: arg.DOM_KEY_LOCATION_LEFT,
   DOM_KEY_LOCATION_RIGHT: arg.DOM_KEY_LOCATION_RIGHT,
  DOM_KEY_LOCATION_NUMPAD: arg.DOM_KEY_LOCATION_NUMPAD,
         getModifierState: arg.getModifierState.bind(arg),
        initKeyboardEvent: arg.initKeyboardEvent.bind(arg),
                     view: arg.view,
                   detail: arg.detail,
       sourceCapabilities: arg.sourceCapabilities,
                    which: arg.which,
              initUIEvent: arg.initUIEvent.bind(arg),
                     type: arg.type,
                   target: arg.target,
            currentTarget: arg.currentTarget,
               eventPhase: arg.eventPhase,
                  bubbles: arg.bubbles,
               cancelable: arg.cancelable,
         defaultPrevented: arg.defaultPrevented,
                 composed: arg.composed,
                timeStamp: arg.timeStamp,
               srcElement: arg.srcElement,
              returnValue: arg.returnValue,
             cancelBubble: arg.cancelBubble,
                     NONE: arg.NONE,
          CAPTURING_PHASE: arg.CAPTURING_PHASE,
                AT_TARGET: arg.AT_TARGET,
           BUBBLING_PHASE: arg.BUBBLING_PHASE,
             composedPath: arg.composedPath.bind(arg),
                initEvent: arg.initEvent.bind(arg),
           preventDefault: arg.preventDefault.bind(arg),
 stopImmediatePropagation: arg.stopImmediatePropagation.bind(arg),
          stopPropagation: arg.stopPropagation.bind(arg),
                     path: arg.path,
            };

            // Replace the original with this modified one
            args[0] = hackedEvent;
          }

          return callback.apply(callback, args);
        };

        for (const key in callback) {
          const prop = callback[key];
          handler[key] = typeof prop === 'function'
            ? prop.bind(callback)
            : prop;
        }
      }

      if (!this.eventListeners) {
        this.eventListeners = {};
      }
      if (!this.eventListeners[type]) {
        this.eventListeners[type] = [];
      }
      this.eventListeners[type].push({
        listener: callback,
        useCapture: options,
        wrapped: handler,
      });

      return this._addEventListener(
        type,
        handler ?? callback,
        options,
      );
    };
  }

  if (!doc._removeEventListener) {
    doc._removeEventListener = doc.removeEventListener;

    doc.removeEventListener = function (type, callback, options = false) {
      if (!this.eventListeners) {
        this.eventListeners = {};
      }
      if (!this.eventListeners[type]) {
        this.eventListeners[type] = [];
      }

      const targetEv = this.eventListeners[type];

      for (let i = 0, len = targetEv.length; i < len; i++) {
        const event = targetEv[i];

        if (
          event.listener === callback &&
          event.useCapture === options
        ) {
          if (event.wrapped)
            callback = event.wrapped;

          targetEv.splice(i, 1);
          break;
        }
      }

      if (targetEv.length == 0)
        delete this.eventListeners[type];

      return this._removeEventListener(type, callback, options);
    };
  }
}

/**
 * Revert the 'wrapEventListeners' changes.
 */
export function unwrapEventListeners() {
  if (doc._addEventListener) {
    doc.addEventListener = doc._addEventListener;
    delete doc._addEventListener;
  }
  if (doc._removeEventListener) {
    doc.removeEventListener = doc._removeEventListener;
    delete doc._removeEventListener;
  }
  delete doc.eventListeners;
}

/*
const hackedEvent = {
                  isTrusted: true,
                        key: arg.key,
                       code: arg.code,
                   location: arg.location,
                    ctrlKey: arg.ctrlKey,
                   shiftKey: arg.shiftKey,
                     altKey: arg.altKey,
                    metaKey: arg.metaKey,
                     repeat: arg.repeat,
                isComposing: arg.isComposing,
                   charCode: arg.charCode,
                    keyCode: arg.keyCode,
  DOM_KEY_LOCATION_STANDARD: arg.DOM_KEY_LOCATION_STANDARD,
      DOM_KEY_LOCATION_LEFT: arg.DOM_KEY_LOCATION_LEFT,
     DOM_KEY_LOCATION_RIGHT: arg.DOM_KEY_LOCATION_RIGHT,
    DOM_KEY_LOCATION_NUMPAD: arg.DOM_KEY_LOCATION_NUMPAD,
           getModifierState: arg.getModifierState.bind(arg),
          initKeyboardEvent: arg.initKeyboardEvent.bind(arg),
                       view: arg.view,
                     detail: arg.detail,
         sourceCapabilities: arg.sourceCapabilities,
                      which: arg.which,
                initUIEvent: arg.initUIEvent.bind(arg),
                       type: arg.type,
                     target: arg.target,
              currentTarget: arg.currentTarget,
                 eventPhase: arg.eventPhase,
                    bubbles: arg.bubbles,
                 cancelable: arg.cancelable,
           defaultPrevented: arg.defaultPrevented,
                   composed: arg.composed,
                  timeStamp: arg.timeStamp,
                 srcElement: arg.srcElement,
                returnValue: arg.returnValue,
               cancelBubble: arg.cancelBubble,
                       NONE: arg.NONE,
            CAPTURING_PHASE: arg.CAPTURING_PHASE,
                  AT_TARGET: arg.AT_TARGET,
             BUBBLING_PHASE: arg.BUBBLING_PHASE,
               composedPath: arg.composedPath.bind(arg),
                  initEvent: arg.initEvent.bind(arg),
             preventDefault: arg.preventDefault.bind(arg),
   stopImmediatePropagation: arg.stopImmediatePropagation.bind(arg),
            stopPropagation: arg.stopPropagation.bind(arg),
                       path: arg.path,
};
*/