import {
  createAccumulators,
  getMeanStdDev,
  getMinMax,
  updateAccumulators
} from './src/utils/accumulators.js';
import { createModeTracker, getMode, updateMode } from './src/utils/mode.js';
import { checkPacketLoss } from './src/utils/packetLoss.js';

let state = createInitialState();

function createInitialState() {
  return {
    accumulators: createAccumulators(),
    lastCalcTime: 0,
    lastId: null,
    lostPackets: 0,
    modeTracker: createModeTracker(),
    n: 0
  };
}

function processData(id, value) {
  const startTime = performance.now();
  const packetLoss = checkPacketLoss(state.lastId, id);
  state.lostPackets += packetLoss;
  state.lastId = id;
  state.n++;
  updateAccumulators(state.accumulators, value);
  updateMode(state.modeTracker, value);
  state.lastCalcTime = performance.now() - startTime;
}

function getStats() {
  const startTime = performance.now();
  const { mean, stdDev } = getMeanStdDev(state.accumulators);
  const { max, min } = getMinMax(state.accumulators);
  const modeInfo = getMode(state.modeTracker);

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
