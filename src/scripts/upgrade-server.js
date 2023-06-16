/** @param {NS} ns */
export async function main(ns) {
  // How much RAM each purchased server will have.
  const ram = 2**20;

  // Iterator we'll use for our loop
  const i = ns.getPurchasedServers().length;

  // Continuously try to purchase servers until we've reached the maximum
  // amount of servers
  if (i < ns.getPurchasedServerLimit()) {
      ns.tprint("$", ns.formatNumber(ns.getPurchasedServerCost(ram), 3))
    // Check if we have enough money to purchase a server
    if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
      // If we have enough money, then:
      //  1. Purchase the server
      //  2. Copy our hacking script onto the newly-purchased server
      //  3. Run our hacking script on the newly-purchased server with 3 threads
      //  4. Increment our iterator to indicate that we've bought a new server
      const hostname = ns.purchaseServer("ueno", ram);
      i += 1;
    }
  }
}