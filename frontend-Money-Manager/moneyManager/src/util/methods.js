export function prepareIncomeLineChartData(transactions = []) {
  const map = new Map();

  transactions.forEach((item) => {
    const dateObj = new Date(item.date);

    const dateKey = dateObj.toISOString().split("T")[0];
    // format: 2026-05-16

    const existing = map.get(dateKey) || 0;

    map.set(dateKey, existing + Number(item.amount || 0));
  });

  return Array.from(map, ([label, totalAmount]) => ({
    label,
    totalAmount,
  })).sort((a, b) => new Date(a.label) - new Date(b.label));
}
export function addThousandSeparators(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
