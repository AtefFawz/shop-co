const RevenueChart = (stats: any) => {
  const weeklySalesData = stats?.stats?.weeklySales || [
    { day: "Mon", revenue: 0 },
    { day: "Tue", revenue: 0 },
    { day: "Wed", revenue: 0 },
    { day: "Thu", revenue: 0 },
    { day: "Fri", revenue: 0 },
    { day: "Sat", revenue: 0 },
    { day: "Sun", revenue: 0 },
  ];
  // 2. calculate the peak day
  const maxRevenue = Math.max(...weeklySalesData.map((d: any) => d.revenue), 1);
  const totalWeeklyRevenue = weeklySalesData.reduce(
    (acc: number, curr: any) => acc + curr.revenue,
    0,
  );
  const avgDailyRevenue = Math.round(
    totalWeeklyRevenue / weeklySalesData.length,
  );

  const peakDay = weeklySalesData.reduce(
    (max: any, curr: any) => (curr.revenue > max.revenue ? curr : max),
    weeklySalesData[0] || { day: "—", revenue: 0 },
  );
  return (
    <div className="xl:col-span-8 bg-white rounded-2xl border border-gray-200/70 p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400">
            Revenue Trajectory
          </p>
          <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-gray-900 mt-0.5">
            Weekly Sales Analytics
          </h3>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Peak: {peakDay.day} (${peakDay.revenue.toLocaleString()})
        </span>
      </div>

      <div className="space-y-3">
        {/* Bar Chart Container */}
        <div className="h-44 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-1 border-b border-gray-100">
          {weeklySalesData.map((bar: any) => {
            // 1. calculate the percentage of the bar height based on the maximum revenue
            const percentage = Math.round((bar.revenue / maxRevenue) * 100);
            const barHeight =
              bar.revenue === 0 ? "8%" : `${Math.max(percentage, 12)}%`;
            const isPeak = bar.revenue > 0 && bar.revenue === peakDay.revenue;

            return (
              <div
                key={bar.day}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Tooltip  */}
                <div className="text-[9px] font-bold text-gray-500 mb-1.5  group-hover:opacity-100 transition-opacity">
                  ${bar.revenue.toLocaleString()}
                </div>

                {/* Bar Chart Column */}
                <div
                  className={`w-full max-w-[34px] rounded-xl transition-all duration-500 relative overflow-hidden ${
                    isPeak ? "bg-black" : "bg-gray-400 group-hover:bg-gray-800"
                  }`}
                  style={{ height: barHeight }}
                >
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Name Day */}
                <span
                  className={`text-[10px] mt-2 transition-colors ${
                    isPeak
                      ? "font-black text-black"
                      : "font-bold text-gray-400 group-hover:text-black"
                  }`}
                >
                  {bar.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer    */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 px-1 font-medium">
          <span>Avg Daily: ${avgDailyRevenue.toLocaleString()}</span>
          <span>
            Top Performer: {peakDay.day} ($
            {peakDay.revenue.toLocaleString()})
          </span>
        </div>
      </div>
    </div>
  );
};
export { RevenueChart };
