/** @param {number[]} numbers */
export function algorithmic_stock_trader_i(numbers) {
  let mostProfit = 0;
  for (let i = 0; i < numbers.length - 1; i++) {
    const today = numbers[i];
    const maxFuture = Math.max(...numbers.slice(i + 1));
    const potentialProfit = maxFuture - today;
    if (mostProfit < potentialProfit)
      mostProfit = potentialProfit;
  }

  return mostProfit;
}