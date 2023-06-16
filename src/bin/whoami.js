/** @param {NS} ns */
export async function main(ns) {
  const player = ns.getPlayer();
  ns.tprintf(JSON.stringify(player, null, 2));
}