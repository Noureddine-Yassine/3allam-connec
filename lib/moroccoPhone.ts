/**
 * Normalise un numéro mobile marocain saisi par l'utilisateur vers +212XXXXXXXXX
 * (9 chiffres nationaux : 6, 7 ou 5 en tête).
 * Accepte notamment : 0680676364, 680676364, +212680676364, 212680676364
 */
export function toE212Phone(raw: string): string {
  let p = raw.replace(/\s/g, "");
  if (!p) return "";
  if (p.startsWith("+212")) return p;
  if (p.startsWith("00212")) return "+" + p.slice(2);
  if (p.startsWith("212")) return "+" + p;
  if (p.startsWith("0")) return "+212" + p.slice(1);
  return "+212" + p;
}

/** Vérifie le format final international (+212 + 9 chiffres, mobile 6/7/5). */
export function isValidE212Mobile(phone: string): boolean {
  return /^\+212[657]\d{8}$/.test(phone);
}
