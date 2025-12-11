import incrmeanstdev from '@stdlib/stats-incr-meanstdev';
import incrminmax from '@stdlib/stats-incr-minmax';
import { TopK } from 'bloom-filters';

const MODE_TRACKER_K = 10;
const MODE_ERROR_RATE = 0.001;
const MODE_ACCURACY = 0.99;

let state = createInitialState();

function createInitialState() {
  return {
    lastCalcTime: 0,
    lastId: null,
    lostPackets: 0,
    meanStdAcc: incrmeanstdev(),
    minMaxAcc: incrminmax(),
    n: 0,
    topK: new TopK(MODE_TRACKER_K, MODE_ERROR_RATE, MODE_ACCURACY)
  };
}

function updateMode(price) {
  const normalizedPrice = String(Math.round(price * 100) / 100);
  state.topK.add(normalizedPrice);
}

function getMode() {
  const values = state.topK.values();
  if (values.length === 0) return { frequency: 0, mode: null };
  const top = values[0];
  return {
    frequency: top.frequency,
    mode: parseFloat(top.value)
  };
}

function checkPacketLoss(id) {
  if (state.lastId !== null) {
    const expectedId = state.lastId + 1;
    if (id > expectedId) {
      state.lostPackets += id - expectedId;
    }
  }
  state.lastId = id;
}

function processData(id, value) {
  const startTime = performance.now();
  checkPacketLoss(id);
  state.n++;
  state.meanStdAcc(value);
  state.minMaxAcc(value);
  updateMode(value);
  state.lastCalcTime = performance.now() - startTime;
}

function getStats() {
  const startTime = performance.now();
  const modeInfo = getMode();
  const [mean, stdDev] = state.meanStdAcc() || [null, null];
  const [min, max] = state.minMaxAcc() || [null, null];

  const stats = {
    count: state.n,
    lastCalcTime: state.lastCalcTime,
    lastId: state.lastId,
    lostPackets: state.lostPackets,
    max: state.n > 0 ? max : null,
    mean: state.n > 0 ? mean : null,
    min: state.n > 0 ? min : null,
    mode: modeInfo.mode,
    modeFrequency: modeInfo.frequency,
    modeIsApproximate: true,
    statsGenerationTime: performance.now() - startTime,
    stdDev: state.n > 1 ? stdDev : null
  };
  return stats;
}

self.onmessage = function (event) {
  const { payload, type } = event.data;
  switch (type) {
    case 'DATA':
      if (
        payload &&
        typeof payload.id === 'number' &&
        typeof payload.value === 'number'
      ) {
        processData(payload.id, payload.value);
      }
      break;
    case 'BATCH_DATA':
      if (Array.isArray(payload)) {
        for (let i = 0; i < payload.length; i++) {
          const item = payload[i];
          if (typeof item.id === 'number' && typeof item.value === 'number') {
            processData(item.id, item.value);
          }
        }
      }
      break;
    case 'GET_STATS':
      self.postMessage({
        payload: getStats(),
        type: 'STATS'
      });
      break;
    case 'RESET':
      state = createInitialState();
      self.postMessage({
        type: 'RESET_COMPLETE'
      });
      break;
    default:
      console.warn(`[mathWorker] Unknown message type: ${type}`);
  }
};

self.postMessage({ type: 'READY' });
