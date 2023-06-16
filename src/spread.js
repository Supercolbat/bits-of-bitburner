const verbose = false;

/** @param {NS} ns */
export async function main(ns) {
  /* START Config */
  const target = ns.args[0] ?? 'phantasy';
  const targetProgram = 'hack.js';
  /* END Config */

  if (!ns.fileExists(targetProgram)) {
    ns.tprintf("ERROR: Program '%s' does not exist", targetProgram);
    return;
  }

  const requiredRam = ns.getScriptRam(targetProgram);

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

  const programs = {
    "BruteSSH.exe": ns.brutessh,
    "FTPCrack.exe": ns.ftpcrack,
    "relaySMTP.exe": ns.relaysmtp,
    "HTTPWorm.exe": ns.httpworm,
    "SQLInject.exe": ns.sqlinject,
  };

  var availablePrograms = [];
  for (const program of Object.entries(programs)) {
    if (ns.fileExists(program[0]))
      availablePrograms.push(program[1]);
  }

  // Run le scripts!
  var countedThreads = 0;
  const maxMoney = ns.getServerMaxMoney(target);
  const minSecurity = ns.getServerMinSecurityLevel(target);
  for (const serv of servers) {
    if (!ns.scriptRunning(targetProgram, serv)) {
      await ns.sleep(50);
      
      if (verbose) ns.tprintf("INFO: Targeting %s (level %d)", serv, ns.getServerRequiredHackingLevel(serv));
  
      const ports = ns.getServerNumPortsRequired(serv);
      const threads = Math.floor(ns.getServerMaxRam(serv) / requiredRam);

      if (threads == 0) {
        if (verbose) ns.tprintf("INFO: --Target has no RAM");
        continue;
      }

      // Hack the server if not already open
      if (!ns.hasRootAccess(serv)) {
        if (ports > availablePrograms.length) {
          if (verbose) ns.tprintf("ERROR: Target requires too many ports to NUKE");
          continue;
        }
        
        if (!verbose) ns.tprintf("INFO: Targeting %s", serv);
  
        for (let i = 0; i < ports; i++) {
          availablePrograms[i](serv);
        }
        ns.tprintf("  %s : run NUKE.exe", serv);
        ns.nuke(serv);
      } else {
        if (!verbose) ns.tprintf("INFO: Targeting %s", serv);
      }

      // Upload script onto server
      ns.tprintf("  %1$s : scp hack.js %1$s", serv);
      if (!ns.scp(targetProgram, serv)) {
        ns.tprintf("ERROR: Failed to upload %s", targetProgram);
        continue;
      }

      // Execute hack.js
      ns.tprintf(
        "  %s : run %s -t %d %s %s %d",
        serv,
        targetProgram, threads,
        target, ns.formatNumber(maxMoney), minSecurity,
      );
      if (ns.exec(targetProgram, serv, threads, target, maxMoney, minSecurity) == 0) {
        ns.tprintf("  ERROR: Failed to run %s", targetProgram);
        continue;
      }
      
      countedThreads += threads;
    }
  }

  ns.tprintf("INFO: Running on %d more threads!", countedThreads);
}

export function autocomplete(data, args) {
  return data.servers;
}