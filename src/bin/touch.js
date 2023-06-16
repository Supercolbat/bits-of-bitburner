const StarterScript = `\
/** @param {NS} ns */
export async function main(ns) {

}`;

/** @param {NS} ns */
export async function main(ns) {
  if (ns.args.length < 1)
    return ns.tprint('ERROR: At least one argument required');
  
  for (const filename of ns.args.map(arg => String(arg))) {
    if (ns.fileExists(filename))
      continue;

    try {
      ns.write(filename, filename.endsWith('.js') ? StarterScript : '');
    } catch (err) { /* ... */ }
  }
}
