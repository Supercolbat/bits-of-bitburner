/** @param {number[]} data */
export function subarray_with_maximum_sum(data) {
  const length = data.length;

  let maxSum = 0;
  for (let i = 0; i < length; i++) {
    let sum = data[i];

    if (sum > maxSum)
      maxSum = sum;

    for (let j = i + 1; j <= length; j++) {
      sum += data[j]

      if (sum > maxSum)
        maxSum = sum;
    }
  }

  return maxSum;
}