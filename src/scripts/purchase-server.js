/** @param {NS} ns */
export async function main(ns) {
  // How much RAM each purchased server will have.
  const ram = 1024;

  // Iterator we'll use for our loop
  const i = ns.getPurchasedServers().length;

  // Continuously try to purchase servers until we've reached the maximum
  // amount of servers
  while (i < ns.getPurchasedServerLimit()) {
    // Check if we have enough money to purchase a server
    if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
      // If we have enough money, then:
      //  1. Purchase the server
      //  2. Copy our hacking script onto the newly-purchased server
      //  3. Run our hacking script on the newly-purchased server with 3 threads
      //  4. Increment our iterator to indicate that we've bought a new server
      ns.purchaseServer("ueno", ram);
      i += 1;
    }
    //Make the script wait for a second before looping again.
    //Removing this line will cause an infinite loop and crash the game.
    await ns.sleep(ns.args[0] == "fast" ? 50 : 1000);
  }
}