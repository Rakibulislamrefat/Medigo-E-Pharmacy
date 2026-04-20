export function formatBdt(amount: number) {
  const safe = Number.isFinite(amount) ? amount : 0;
  const rounded = Math.round(safe);
  return new Intl.NumberFormat("bn-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(rounded);
}

