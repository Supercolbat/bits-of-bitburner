/* @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0];
  async function findem(servers) {
    for (const server of servers) {
      if (server == target)
        return [server]

      const trace = await findem(ns.scan(server).slice(1));
      if (trace.length > 0)
        return [server, ...trace];
    }
    return [];
  }

  const trace = await findem(ns.scan());
  ns.tprint("INFO: ", trace.join(' -> '));
}

export function autocomplete(data, args) {
  return data.servers;
}