export function transformStatsForAPI(workerStats) {
  return {
    calc_time: workerStats.statsGenerationTime,
    lost_quotes: workerStats.lostPackets,
    max_value: workerStats.max,
    mean: workerStats.mean,
    min_value: workerStats.min,
    mode: workerStats.mode,
    std_dev: workerStats.stdDev
  };
}

export function parseQuoteMessage(rawData) {
  const quote = JSON.parse(rawData);
  return {
    id: quote.id,
    value: parseFloat(quote.value)
  };
}
