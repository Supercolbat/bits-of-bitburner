/** @param {NS} ns */
export async function main(ns) {
  async function getServers(servers, all) {
    var newServers = all;
    for (const server of servers) {
      newServers.push(server);

      var results = ns.scan(server).filter(
        serv => !newServers.includes(serv) && serv != "home"
      );

      for (const serv of await getServers(results, newServers)) {
        if (!newServers.includes(serv))
          newServers.push(serv);
      }
    }
    return newServers;
  }

  const servers = await getServers(ns.scan(), []);

  for (const server of servers)
    for (const file of ns.ls(server))
      if (file.endsWith(".cct"))
        ns.tprintf("INFO: '%s' at %s",
          ns.codingcontract.getContractType(file, server),
          server
        )
}