import { TopK } from 'bloom-filters';

const MODE_TRACKER_K = 10;
const MODE_ERROR_RATE = 0.001;
const MODE_ACCURACY = 0.99;

export function createModeTracker() {
  return new TopK(MODE_TRACKER_K, MODE_ERROR_RATE, MODE_ACCURACY);
}

export function updateMode(tracker, price) {
  const normalizedPrice = String(Math.round(price * 100) / 100);
  tracker.add(normalizedPrice);
}

export function getMode(tracker) {
  const values = tracker.values();
  if (values.length === 0) return { frequency: 0, mode: null };
  const top = values[0];
  return {
    frequency: top.frequency,
    mode: parseFloat(top.value)
  };
}
