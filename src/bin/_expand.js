import { getTerminalCommandHistory } from '/lib/terminal.js';
import { execCommand } from '/lib/terminal.js';

/** @param {NS} ns */
export async function main(ns) {
  if (ns.args.length == 0)
    return;
  
  // Fetch the history
  const history = getTerminalCommandHistory();

  // Check if the first argument is a number
  // (Run command at history index)
  const historyIndex = parseInt(ns.args[0]);
  if (historyIndex == ns.args[0] &&  // i hate how "10" == 10, but its useful here
    historyIndex > 0 && historyIndex < 50) 
    return execCommand(history[historyIndex]);

  // Use the command thats typed in as a search query
  const query = ns.args.join(' ');
  const command = history.findLast(cmd => cmd.startsWith(query));
  if (command && !command.startsWith('!')) // Low-effort Recursion Prevention (TM)
    execCommand(command);
}

/**
 * @param {AutocompleteData} data
 * @param {(string | number | boolean)[]} args
 * @returns {string[]}
 */
export function autocomplete(data, args) {
  // TODO: support multiple words
  return getTerminalCommandHistory();
}