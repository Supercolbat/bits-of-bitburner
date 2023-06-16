/** @param {NS} ns */
export async function main(ns) {
  if (ns.args.length < 2)
    return ns.tprint("ERROR: Two arguments required");
  
  /** @type {string} from, {string} to */
  const [from, to] = ns.args;

  ns.tprint(ns.ls('home', fromDir));
}

/**
 * @param {AutocompleteData} data
 * @param {(string | number | boolean)[]} args
 * */
export function autocomplete(data, args) {
  return data.scripts;
}