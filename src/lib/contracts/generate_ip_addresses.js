/** @param {number} data */
export function generate_ip_addresses(data) {
  const numbers = data.toString();

  function validate(numberStr) {
    if (numberStr[0] == 0 && numberStr.length > 1)
      return false;
    
    if (0 > parseInt(numberStr) || parseInt(numberStr) > 255)
      return false;
    
    return true;
  }

  const solutions = [];

  // I- I can explain...
  for (let a = 1; a <= 3; a++)
    for (let b = 1; b <= 3; b++)
      for (let c = 1; c <= 3; c++)
        for (let d = 1; d <= 3; d++) {
          if (a + b + c + d != numbers.length)
            continue;
          
          const A = numbers.slice(    0,       a);
          const B = numbers.slice(    a,     a+b);
          const C = numbers.slice(  a+b,   a+b+c);
          const D = numbers.slice(a+b+c, a+b+c+d);

          if (!(validate(A) && validate(B) && validate(C) && validate(D)))
            continue;
          
          solutions.push(`${A}.${B}.${C}.${D}`);
        }
  
  return solutions;
}