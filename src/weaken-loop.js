/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0];
  //const target = 'omega-net';
  //const target = 'silver-helix';
  while (true) {
    const weakenedBy = await ns.weaken(target);
    ns.printf('SUCCESS: Weakened %s by %d', target, weakenedBy);
    await ns.sleep(1000);
  }
}

export function autocomplete(data, args) {
  return data.servers;
}