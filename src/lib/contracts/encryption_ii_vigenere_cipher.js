/** @param {[string, string]} data */
export function encryption_ii_vigenere_cipher(data) {
  const plain = data[0];
  const key = data[1].repeat(Math.ceil(plain.length / data[1].length));

  return plain.split('').map(
    (chr, idx) => String.fromCharCode(
      (chr.charCodeAt(0) - 65 + key.charCodeAt(idx) - 65) % 26 + 65
    )
  ).join('');
}