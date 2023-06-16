/** @param {[number, number[]]} data */
export function total_ways_to_sum_ii(data) {
  const [ mustSum, numbers ] = data;

  let solutions = 0;

  function recurse(sum, index) {
    const current = numbers[index];
    if (index < numbers.length - 1) {
      for (let n = 0; n <= mustSum; n += current) {
        const newSum = sum + n;
        if (newSum >= mustSum) {
          if (newSum == mustSum) solutions++;
          return;
        }
        recurse(sum + n, index + 1);
      }
      return;
    }
      
    for (let n = 0; n <= mustSum; n += current) {
      const newSum = sum + n;
      if (newSum >= mustSum) {
        if (newSum == mustSum) solutions++;
        return;
      }
    }
  }

  recurse(0, 0);

  return solutions;
}