const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Whole dollars. Cents are noise in a dense table. */
export function formatCurrency(amount: number): string {
  return CURRENCY.format(amount);
}

/** A share of a whole as "42%". Zero of zero is 0%, not NaN. */
export function formatPercent(part: number, whole: number): string {
  if (whole === 0) return "0%";
  return `${Math.round((part / whole) * 100)}%`;
}

/** "Priya Raman" to "PR". At most two letters, so the avatar never overflows. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
