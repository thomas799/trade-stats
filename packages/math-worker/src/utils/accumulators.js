import incrmeanstdev from '@stdlib/stats-incr-meanstdev';
import incrminmax from '@stdlib/stats-incr-minmax';

export function createAccumulators() {
  return {
    meanStdAcc: incrmeanstdev(),
    minMaxAcc: incrminmax()
  };
}

export function getMeanStdDev(acc) {
  const [mean, stdDev] = acc.meanStdAcc() || [null, null];
  return { mean, stdDev };
}

export function getMinMax(acc) {
  const [min, max] = acc.minMaxAcc() || [null, null];
  return { max, min };
}

export function updateAccumulators(acc, value) {
  acc.meanStdAcc(value);
  acc.minMaxAcc(value);
}
