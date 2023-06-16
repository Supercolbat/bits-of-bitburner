const verbose = false;
// omega-net

/** @param {NS} ns */
export async function main(ns) {
  function getServers(servers, all) {
    var newServers = all;
    for (const server of servers) {
      newServers.push(server);

      var results = ns.scan(server).filter(
        serv => !newServers.includes(serv) && serv != "home"
      );

      for (const serv of getServers(results, newServers)) {
        if (!newServers.includes(serv))
          newServers.push(serv);
      }
    }
    return newServers;
  }

  const servers = getServers(ns.scan(), []);

  const programs = [
    { name: "BruteSSH.exe", func: ns.brutessh },
    { name: "FTPCrack.exe", func: ns.ftpcrack },
    { name: "relaySMTP.exe", func: ns.relaysmtp },
    { name: "HTTPWorm.exe", func: ns.httpworm },
    { name: "SQLInject.exe", func: ns.sqlinject },
  ];

  var availablePrograms = [];
  for (const program of programs) {
    if (ns.fileExists(program.name))
      availablePrograms.push(program);
  }

  for (const serv of servers) {
    if (verbose) ns.tprintf("INFO: Targeting %s (level %d)", serv, ns.getServerRequiredHackingLevel(serv));

    const ports = ns.getServerNumPortsRequired(serv);

    // Hack the server if not already open
    if (ns.hasRootAccess(serv)) {
      if (!verbose) ns.tprintf("INFO: Already have root on %s", serv);
      continue;
    }

    if (ports > availablePrograms.length) {
      if (verbose) ns.tprintf("ERROR: Target requires too many ports to NUKE");
      continue;
    }
    
    if (!verbose) ns.tprintf("INFO: Targeting %s", serv);

    for (let i = 0; i < ports; i++) {
      const program = availablePrograms[i];
      ns.tprintf("  %s : run %s", serv, program.name);
      program.func(serv);
    }
    ns.tprintf("  %s : run NUKE.exe", serv);
    ns.nuke(serv);
  }
}