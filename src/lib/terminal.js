import { win, doc } from '/lib/globals.js';
import { getProps } from '/lib/react.js';

function getSave() {
  return JSON.parse(atob(win.appSaveFns.getSaveData().save)).data;
}

/**
 * Execute an arbitrary console command via DOM manipualation.
 * @param {string} command
 */
export function execCommand(command) {
  const terminalInput = doc.getElementById('terminal-input');
  terminalInput.value = command;
  
  const terminalProps = getProps(terminalInput);
  terminalProps.onChange({ target: terminalInput });
  terminalProps.onKeyDown({ key: 'Enter', preventDefault: () => null });
}

/**
 * Returns an array containing the last 50 commands entered.
 * @returns {string[]}
 */
export function getTerminalCommandHistory() {
  return JSON.parse(getSave().PlayerSave).data.terminalCommandHistory;
}

/**
 * Returns an array containing all the aliases created
 * @returns {Map<string, string>}
 */
export function getTerminalAliases() {
  return JSON.parse(getSave().AliasesSave);
}