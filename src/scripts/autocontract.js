import {
  find_largest_prime_factor,
  subarray_with_maximum_sum,
  total_ways_to_sum_ii,
  spiralize_matrix,
  generate_ip_addresses,
  algorithmic_stock_trader_i,
  minimum_path_sum_in_a_triangle,
  unique_paths_in_a_grid_i,
  compression_i_rle_compression,
  compression_ii_lz_decompression,
  encryption_i_caesar_cipher,
  encryption_ii_vigenere_cipher,
} from '/lib/contracts.js';

const contractToFunction = {
  "Find Largest Prime Factor": find_largest_prime_factor,
  "Subarray with Maximum Sum": subarray_with_maximum_sum,
  // "Total Ways to Sum": ,
  "Total Ways to Sum II": total_ways_to_sum_ii,
  "Spiralize Matrix": spiralize_matrix,
  // "Array Jumping Game": ,
  // "Array Jumping Game II": ,
  // "Merge Overlapping Intervals": ,
  "Generate IP Addresses": generate_ip_addresses,
  "Algorithmic Stock Trader I": algorithmic_stock_trader_i,
  // "Algorithmic Stock Trader II": ,
  // "Algorithmic Stock Trader III": ,
  // "Algorithmic Stock Trader IV": ,
  "Minimum Path Sum in a Triangle": minimum_path_sum_in_a_triangle,
  // "Unique Paths in a Grid I": unique_paths_in_a_grid_i,
  // "Unique Paths in a Grid II": ,
  // "Shortest Path in a Grid": ,
  // "Sanitize Parentheses in Expression": ,
  // "Find All Valid Math Expressions": ,
  // "HammingCodes: Integer to Encoded Binary": ,
  // "HammingCodes: Encoded Binary to Integer": ,
  // "Proper 2-Coloring of a Graph": ,
  "Compression I: RLE Compression": compression_i_rle_compression,
  "Compression II: LZ Decompression": compression_ii_lz_decompression,
  // "Compression III: LZ Compression": ,
  "Encryption I: Caesar Cipher": encryption_i_caesar_cipher,
  "Encryption II: Vigenère Cipher": encryption_ii_vigenere_cipher,
};

/** @param {NS} ns */
export async function main(ns) {

  /**
   * @param {string[]} servers
   * @param {string[]} all
   */
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

  const servers = getServers(ns.scan(), []).concat("home");

  /** @type {{
   *   type: string,
   *   data: string,
   *   file: string,
   *   host: string
   * }[]} */
  const contracts = [];
  for (const server of servers) {
    const files = ns.ls(server).filter(f => f.endsWith(".cct"));
    if (files.length == 0)
      continue;

    for (const file of files)
      contracts.push({
        type: ns.codingcontract.getContractType(file, server),
        data: ns.codingcontract.getData(file, server),
        file: file,
        host: server,
      });
  }

  for (const contract of contracts) {
    ns.tprintf("INFO: Attempting to solve '%s' at %s", contract.type, contract.host);

    const fn = contractToFunction[contract.type];
    if (fn === undefined) {
      ns.tprint("ERROR: No solver defined for this contract");
      continue;
    }
    
    try {
      const solution = fn(contract.data);
      if (solution === undefined)
        throw "Solver encountered a problem";

      const reward = ns.codingcontract.attempt(solution, contract.file, contract.host);
      
      ns.tprint(reward ?
        `SUCCESS: Contract solved successfully! Reward: ${reward}` :
        "ERROR: Failed to solve contract."
      );
    } catch (err) {
      ns.tprint(`ERROR: ${err}`);
    }
  }
}