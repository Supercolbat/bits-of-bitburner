const Config = {
  targetCompany: 'ECorp',
};

const doc = eval('document');

/**
 * The speed to run normal events at
 * @type {number}
 */
const Delay = 22;

/** @param {NS} ns */
export async function main(ns) {
  // Automatically go to the city tab (assumes you are in the right city)
  const cityButton = doc.querySelector('.MuiDrawer-root > div > ul > div:nth-child(8) > div > div > div[role=button]');
  cityButton.click();

  while (true) {
    doc.querySelector(`span[aria-label=${Config.targetCompany}]`).click();
    await sleep(Delay);
    
    getProps(
      // findElement('.MuiBox-root > .MuiBox-root > div > button:nth-child(3)')
      findElement('button', e => e.innerText.startsWith('Infiltrate Company'))
    ).onClick({isTrusted: true})

    await sleep(100);

    try {
      // console.log('Go to an infiltration screen');

      // Wait until an infiltration screen is open
      await waitForElement('#root > .MuiBox-root', (e) => {
        const props = getProps(e);
        return props.children.props && props.children.props.location;
      });

      // Ensure that keyboard inputs are registered
      wrapEventListeners();

      // Automatically start the game
      // TODO: make it more straightforward
      const props = getProps(doc.querySelector('#root > .MuiBox-root > div'));
      props.children.props.start();

      ns.toast('go kill yourself', 'success');

      // Play game
      while (true) {
        // Wait some time before checking what screen we're on
        await sleep(50);

        const game = doc.querySelector('.MuiContainer-root > div:last-child');
        if (!game) break;

        for (const child of getProps(game).children) {
          if (!child.props) continue;
          if (!child.props.onFailure) continue;
          child.props.onFailure();
        }
      }

      // Game ended :(

      unwrapEventListeners();

      ns.toast('you did it', 'success');
    } catch (e) {
      console.log('bruh', e)

      ns.toast('error', 'error');
    }
  }
}


function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function findElement(selector, predicate) {
  const queriedElements = [...doc.querySelectorAll(selector)];
  const element = predicate ? queriedElements.filter(predicate)[0] : queriedElements[0];

  if (!element)
    return;

  return element;
}

function cacheFn(fn) {
  const cache = {};
  return (...args) => {
    const key = args.join('');

    if (key in cache) {
      return cache[key];
    }

    const result = fn(...args);
    cache[key] = result;
    return result;
  }
}

function getProps(element) {
  const key = Object.keys(element).find(k => k.startsWith('__reactProps$'));

  if (key)
    return element[key];
}


function wrapEventListeners() {
  if (!doc._addEventListener) {
    doc._addEventListener = doc.addEventListener;

    doc.addEventListener = function (type, callback, options = false) {
      let handler;

      // For this script, we only want to modify 'keydown' events.
      if (type === 'keydown') {
        handler = function (...args) {
          const arg = args[0];

          if (!arg.isTrusted) {
            const hackedEvent = {};

            // Clone the event
            for (const key in arg)
              hackedEvent[key] = typeof arg[key] === 'function'
                ? arg[key].bind(arg)
                : arg[key];

            // Make the event trusted
            hackedEvent.isTrusted = true;

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

function unwrapEventListeners() {
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

function waitForElement(selector, predicate) {
  return new Promise(resolve => {
    const queriedElement = findElement(selector, predicate);
    if (queriedElement) {
      return resolve(queriedElement);
    }

    const observer = new MutationObserver(mutations => {
      const queriedElement = findElement(selector, predicate);
      if (queriedElement) {
        resolve(queriedElement);
        observer.disconnect();
      }
    });

    observer.observe(doc.body, {
      childList: true,
      subtree: true
    });
  });
}
