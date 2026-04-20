export function isValidBangladeshiPhone(phone: string) {
  return /^01[3-9]\d{8}$/.test(phone.trim());
}

