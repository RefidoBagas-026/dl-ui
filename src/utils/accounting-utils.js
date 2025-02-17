export function formatAccountingNumber(value) {
  if (value === 0) {
    return "-"; // Show zero as "-"
  }

  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(Math.abs(value));

  return value < 0 ? `(${formattedNumber})` : formattedNumber;
}
