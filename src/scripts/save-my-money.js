/** @param {NS} ns */
export async function main(ns) {
  const stock = ns.args[0] ?? "FLCM";

  while (true) {
    const value = ns.stock.getPrice(stock);
    const forecast = ns.stock.getForecast(stock);
    
    ns.printf("INFO: [%s] $%s - %.2f", stock, ns.formatNumber(value), forecast);

    if (forecast <= 0.5) {
      const money = ns.stock.sellStock(stock, 13_200_000);
      ns.tprintf("SUCCESS: Sold %s at $%s/share", stock, ns.formatNumber(money, 2));
      return;
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