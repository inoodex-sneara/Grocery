export function formatTaka(amount: number): string {
  return `Tk ${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(amount)}`;
}
