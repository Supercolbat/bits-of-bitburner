/** @param {number[]} data */
export function array_jumping_game_ii(data) {
  console.log(data.join(' '))

  // Path of the jumps
  const stack = [data[0]];
  
  const length = data.length;

  let i = data[0];
  console.log(
    '-'.repeat(i + i-1),
    i,
  )
  while (i < length) {
    if (stack.length == 0)
      break;

    // If the next jump lands on a zero, decrement the Top-Of-Stack (TOS) number
    const nextNumber = data[i + stack.at(-1)];
    if (nextNumber == 0) {
      let tos = stack.pop();
      if (tos == 0)
        stack.pop();

      stack.push(tos - 1);
      --i;
      continue;
    }

    console.log(
      ' '.repeat(Math.max(0, i * 2 - 1-1)) +
      '-'.repeat(nextNumber + Math.max(0, nextNumber - 1)),
      nextNumber,
    )

    stack.push(nextNumber);
    i += nextNumber;
  }

  return stack.length;
}

array_jumping_game_ii([7, 3, 3, 3, 0, 3, 0, 3, 1, 3, 0, 4, 2, 1, 3, 0, 1, 6, 1, 4, 4, 2])
