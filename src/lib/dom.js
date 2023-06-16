/** @type {Document} */
const doc = eval("document");

/**
 * Finds an element based on a selector and optionally a selector.
 * @param {string} selector
 * @param {function?} predicate
 * @returns {Element?}
 */
export function findElement(selector, predicate) {
  const queriedElements = [...doc.querySelectorAll(selector)];
  const element = predicate ? queriedElements.filter(predicate)[0] : queriedElements[0];

  if (!element)
    return;

  return element;
}

/**
 * Wait until a selector query returns an element.
 * Additionally wait until a predicate function passes.
 * Modified from https://stackoverflow.com/a/61511955
 * @param {string} selector
 * @param {function?} predicate
 */
export function waitForElement(selector, predicate) {
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