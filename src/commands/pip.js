/** @param {NS} ns */
export async function main(ns) {
  if (ns.args[0] == "install") {
    ns.tprintf("INFO: Installing '%s'...", ns.args[1]);
    await ns.sleep(3124);
    ns.tprintf("SUCCESS: '%s' successfully installed", ns.args[1]);
  }
}