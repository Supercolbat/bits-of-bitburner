import { win, doc } from '/lib/globals.js';

/**
 * Wait a determined amount of time
 * @param {number} ms - Duration in milliseconds
 * @returns {Promise<any>}
 */
export function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Sends a message to the terminal
 * @param {string} message
 * @param {'success' | 'warning' | 'error' | 'info'} type
 */
export function print(message, type) {
  return win.appNotifier.terminal(message, type)
}

/**
 * Sends a message as a toast
 * @param {string} message
 * @param {'success' | 'warning' | 'error' | 'info'} type
 */
export function toast(message, type) {
  return win.appNotifier.toast(message, type)
}

/**
 * Get files on **home**
 * @returns {{
 *   filename: string,
 *   code: string,
 *   ramUsage: number,
 * }}
 */
export function ls() {
  return doc.getFiles();
}

/**
 * Write to a file on **home**
 * @param {string} filename
 * @param {string?} data
 * @returns {bool}
 */
export function write(filename, data) {
  // TODO:  @param {'w' | 'a'} mode
  const result = doc.saveFile(filename, btoa(data));
  return result.res;
}

/**
 * Delete a file on **home**
 * @param {string} filename
 * @returns {bool}
 */
export function rm(filename, data) {
  const result = doc.deleteFile(filename);
  return result.res;
}
