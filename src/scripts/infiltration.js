const locationToLevels = {
  // Sector-12
  "Joe's Guns": 5,
  "Alpha Enterprises": 10,
  "Universal Energy": 12,
  "DeltaOne": 12,
  "Carmichael Security": 15,
  "Icarus Microsystems": 17,
  "Four Sigma": 25,
  "Blade Industries": 25,
  "MegaCorp": 31,

  // Aevum
  "Rho Construction": 5,
  "NetLink Technologies": 6,
  "Aevum Police Headquarters": 6,
  "Watchdog Security": 7,
  "Galactic Cybersystems": 12,
  "AeroCorp": 12,
  "Bachman & Associates": 15,
  "Clarke Incorporated": 18,
  "Fulcrum Technologies": 25,
  "ECorp": 37,

  // Volhaven
  "LexoCorp": 15,
  "CompuTek": 15,
  "SysCore Securities": 18,
  "Helios Labs": 18,
  "Omnia Cybersystems": 22,
  "OmniTek Incorporated": 25,
  "NWO": 50,

  // Chongqing
  "Solaris Space Systems": 18,
  "KuaiGong International": 25,

  // New Tokyo
  "Noodle Bar": 5,
  "DefComm": 17,
  "Global Pharmaceuticals": 20,
  "VitaLife": 25,

  // Ishima
  "Omega Software": 10,
  "Nova Medical": 12,
  "Storm Technologies": 25,
};

export async function main(ns) {
  const cities = {
    "Sector-12": [],
    "Aevum": [],
    "Volhaven": [],
    "Chongqing": [],
    "New Tokyo": [],
    "Ishima": [],
  };

  for (const loc of ns.infiltration.getPossibleLocations()) {
    const inf = ns.infiltration.getInfiltration(loc.name);
    
    const diff = inf.difficulty;
    const levels = locationToLevels[loc.name] ?? "??";

    cities[loc.city].push({
      name: loc.name,
      diff: diff,
      levels: levels,
      tradeRep: inf.reward.tradeRep,
      sellCash: inf.reward.sellCash,
    });
  }

  for (const [city, locations] of Object.entries(cities)) {
    locations.sort(
      (a, b) => a.tradeRep - b.tradeRep
    );
    ns.tprintf(" ");
    ns.tprintf("INFO: %s", city);

    for (const loc of locations) {
      ns.tprintf("INFO:   %s [%.2f] [%s levels]",
        loc.name, loc.diff, loc.levels);
      ns.tprintf("          %s rep (%s/lvl) | $%s (%s/lvl)",
        ns.formatNumber(loc.tradeRep),
        ns.formatNumber(loc.tradeRep / loc.levels),
        ns.formatNumber(loc.sellCash),
        ns.formatNumber(loc.sellCash / loc.levels));
    }
  }
}