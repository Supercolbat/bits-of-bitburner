/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0];
  //const target = 'omega-net';
  while (true) {
    const weakenedBy = await ns.weaken(target);
    ns.printf('SUCCESS: Weakened %s by %d', target, weakenedBy);
    const grownBy = await ns.grow(target);
    ns.printf('SUCCESS: Grown %s by %d', target, grownBy);
    await ns.sleep(1000);
  }
}

export function autocomplete(data, args) {
  return data.servers;
}