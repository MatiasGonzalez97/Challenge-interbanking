export function getLastMonthUtcDate(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, now.getUTCDate()),
  );
}
