// Normalizes a Singapore phone number (8-digit local, or already with a
// country code) into the digits-only format wa.me expects, and builds the link.
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 8) return `65${digits}`;
  return digits;
}

export function whatsAppLink(phone: string, message?: string): string {
  const number = normalizePhone(phone);
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
}
