/** @param {number[][]} data */
export function spiralize_matrix(matrix) {
  let lowX = 0, lowY = 0,
      highX = matrix[0].length - 1, highY = matrix.length - 1; // Inclusive

  const stopLength = matrix.flat().length;

  /** @type number[] */
  const solution = [];

  while (solution.length < stopLength) {
    if (solution.length < stopLength)
      // Top-left -> Top-right
      solution.push(...matrix[lowY].slice(lowX, highX + 1));

    if (solution.length < stopLength)
      // Top-right [exclude] -> Bottom-right
      for (let y = lowY + 1; y <= highY; y++)
        solution.push(matrix[y][highX]);

    if (solution.length < stopLength)
      // Bottom-right [exclude] -> Bottom-left
      solution.push(...matrix[highY].slice(lowX, highX).reverse());

    if (solution.length < stopLength)
      // Bottom-left [exclude] -> Top-left [exclude]
      for (let y = highY - 1; y > lowY; y--)
        solution.push(matrix[y][lowX]);
    
    lowX++; highX--;
    lowY++; highY--;
  }
  
  return solution;
}