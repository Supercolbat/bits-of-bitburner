/** @param {number[][]} triangle */
export function minimum_path_sum_in_a_triangle(triangle) {
  function recurse(cumSum, level, idx) {
    let lowestSum = Infinity;

    for (let i = idx; i <= idx + 1; i++) {
      const sel = triangle[level][i];

      const sum = level == triangle.length - 1 ?
        cumSum + sel :
        sel + recurse(cumSum, level + 1, i);

      if (lowestSum > sum)
        lowestSum = sum;
    }

    return lowestSum;
  }

  return recurse(0, 0, 0);
}
