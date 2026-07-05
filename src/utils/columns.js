export function columnsForWidth(width) {
  if (width >= 900) return 4;
  if (width >= 620) return 3;
  return 2;
}
