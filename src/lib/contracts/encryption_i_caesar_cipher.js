/** @param {[string, number]} data */
export function encryption_i_caesar_cipher(data) {
  const [plain, key] = data;

  return plain.split("").map(c => {
    var code = c.charCodeAt(0);
    if (!(65 <= code && code <= 90))
      return c;

    code -= 65;
    code += 26 - key;
    code %= 26;
    code += 65;

    return String.fromCharCode(code);
  }).join("");
}