export default function(hex) {
  const chunk = 2,
    radix = 16,
    rgb = [];

  let i = 1;
  while (hex && i < hex.length) {
    rgb.push(parseInt(hex.substring(i, i + chunk), radix));
    i += chunk;
  }

  return rgb.toString();
}
