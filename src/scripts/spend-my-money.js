/** @param {NS} ns */
export async function main(ns) {
  const stock = ns.args[0] ?? "FLCM";
  const maxShares = ns.stock.getMaxShares(stock);
  
  let investing = false;

  let startingValue = 0, numShares = 0;

  while (true) {
    const value = ns.stock.getPrice(stock);
    const forecast = ns.stock.getForecast(stock);

    if (!investing && forecast > 0.5) {
      const currentCash = ns.getPlayer().money;
      numShares = Math.min(maxShares, Math.floor(currentCash / value));
      startingValue = ns.stock.buyStock(
        stock,
        numShares
      );

      investing = startingValue > 0;
    }

    if (investing) {
      ns.printf("INFO: [%s] $%s - %.2f", stock, ns.formatNumber(value), forecast);

      if (forecast <= 0.5) {
        const money = ns.stock.sellStock(stock, 13_200_000);
        ns.tprintf("SUCCESS: Sold %s at $%s/share for $%s profit",
          stock,
          ns.formatNumber(money, 2),
          ns.formatNumber((money - startingValue) / numShares)
        );
        investing = false;
      }
    }

    await ns.sleep(6000);
  }
}

export function autocomplete(data, args) {
  return [
    "ECP",
    "MGCP",
    "BLD",
    "CLRK",
    "OMTK",
    "FSIG",
    "KGI",
    "FLCM",
    "STM",
    "DCOMM",
    "HLS",
    "VITA",
    "ICRS",
    "UNV",
    "AERO",
    "OMN",
    "Systems",
    "GPH",
    "NVMD",
    "WDS",
    "LXO",
    "RHOC",
    "APHE",
    "SYSC",
    "CTK",
    "NTLK",
    "OMGA",
    "FNS",
    "SGC",
    "JGN",
    "CTYS",
    "MDYN",
    "TITN"
  ]
}