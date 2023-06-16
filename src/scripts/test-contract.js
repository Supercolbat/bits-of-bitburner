/** @param {NS} ns */
export async function main(ns) {
  const contractTypes = ns.codingcontract.getContractTypes();

  if (ns.args.length == 0)
    return contractTypes.forEach((cct) => {
      return ns.tprintf("INFO: %s", cct);
    });
  
  const type = ns.args.join(" ").replaceAll("_", " ");

  if (!contractTypes.includes(type))
    return ns.tprintf("ERROR: Invalid contract type");

  ns.codingcontract.createDummyContract(type);
  ns.tprintf("SUCCESS: Created dummy contract")
}

export function autocomplete(data, args) {
  return [
    "Find Largest Prime Factor",
    "Subarray with Maximum Sum",
    "Total Ways to Sum",
    "Total Ways to Sum II",
    "Spiralize Matrix",
    "Array Jumping Game",
    "Array Jumping Game II",
    "Merge Overlapping Intervals",
    "Generate IP Addresses",
    "Algorithmic Stock Trader I",
    "Algorithmic Stock Trader II",
    "Algorithmic Stock Trader III",
    "Algorithmic Stock Trader IV",
    "Minimum Path Sum in a Triangle",
    "Unique Paths in a Grid I",
    "Unique Paths in a Grid II",
    "Shortest Path in a Grid",
    "Sanitize Parentheses in Expression",
    "Find All Valid Math Expressions",
    "HammingCodes: Integer to Encoded Binary",
    "HammingCodes: Encoded Binary to Integer",
    "Proper 2-Coloring of a Graph",
    "Compression I: RLE Compression",
    "Compression II: LZ Decompression",
    "Compression III: LZ Compression",
    "Encryption I: Caesar Cipher",
    "Encryption II: Vigenère Cipher",
  ].map(n => n.replaceAll(" ", "_"))
}