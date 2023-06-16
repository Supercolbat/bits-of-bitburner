/** @param {number} number */
export function find_largest_prime_factor(number) {
  function isPrime(n) {
    // Pulled from wikipedia
    if (n <= 3)
        return n > 1;

    if (n % 2 == 0 || n % 3 == 0)
        return false;

    const limit = Math.floor(Math.sqrt(n));
    for (let i = 5; i <= limit; i += 6)
      if (n % i == 0 || n % (i+2) == 0)
        return false;

    return true;
  } 

  for (let n = number; n > 0; n--)
    if (number % n == 0 && isPrime(n))
        return n;

  throw 'No prime factor found';
}