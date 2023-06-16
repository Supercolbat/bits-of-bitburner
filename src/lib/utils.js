import { doc } from '/lib/globals.js';

/**
 * Cache the results of a function call
 * https://stackoverflow.com/a/43854103
 * @param {Function} fn - Function to cache/call
 */
export function cacheFn(fn) {
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

/**
 * Recursively scan all servers with connections to the given server.
 * @param {NS} ns - The NetScript instance
 * @param {string=} startingServer - The first server to scan
 */
export function discoverServers(ns, startingServer = 'home') {
  const foundServers = [startingServer];
  
  for (const host of servers) {
    for (const server of ns.scan(host)) {
      if (!servers.includes(server))
        foundServers.push(server)
    }
  }

  return foundServers;
}

/** @param {string} key */
export function pressKey(key) {
  const keyboardEvent = new KeyboardEvent("keydown", {
    key,
  });

  doc.dispatchEvent(keyboardEvent);
}

/**
 * Throws an error when the condition is false.
 * @param {bool} condition
 */
export function assert(condition) {
  if (!condition) throw "Assertion failed";
}