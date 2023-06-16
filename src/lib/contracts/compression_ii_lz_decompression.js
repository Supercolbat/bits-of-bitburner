/** @param {string} data */
export function compression_ii_lz_decompression(compressed) {
  let decompressed = '';
  let index = 0;

  function readPlain() {
    let length = parseInt(compressed[index++]);
    while (length-- > 0)
      decompressed += compressed[index++];
  }

  function readReference() {
    const length = parseInt(compressed[index++]);
    if (length == 0) return;
    
    const back = parseInt(compressed[index++]);
    const start = decompressed.length - back;

    let slice = decompressed.slice(start, start + length);

    if (slice.length < length) {
      slice = slice.repeat(Math.ceil(length / slice.length)).slice(0, length);
    }

    decompressed += slice;
  }

  while (index < compressed.length) {
    readPlain();
    readReference();
  }

  return decompressed;
}