/** @param {string} data */
export function compression_i_rle_compression(data) {
  let compressed = "";
  let count = 0, char = "";
  for (const c of data) {
    if (count == 0) {
      char = c;
      count++;
      continue;
    }

    if (c == char) {
      if (count == 9) {
        compressed += `${count}${char}`;
        count = 0;
      }
      count++;
      continue;
    }

    compressed += `${count}${char}`;
    count = 1, char = c;
  }

  if (count) {
    compressed += `${count}${char}`;
  }

  return compressed;
}