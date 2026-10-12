export function calculateTrend(current: number = 0, previous: number = 0) {
  if (previous === 0) {
    return {
      trend: current > 0 ? "+100%" : "0%",
      trendUp: current >= 0,
    };
  }

  const diff = ((current - previous) / previous) * 100;
  const isUp = diff >= 0;

  return {
    trend: `${isUp ? "+" : ""}${diff.toFixed(1)}%`,
    trendUp: isUp,
  };
}
