let state = createInitialState();

function createInitialState() {
  return {
    frequencyMap: new Map(),
    lastCalcTime: 0,
    lastId: null,
    lostPackets: 0,
    M2: 0,
    max: -Infinity,
    mean: 0,
    min: Infinity,
    mode: null,
    modeFrequency: 0,
    n: 0
  };
}

function updateWelford(x) {
  state.n++;
  const delta = x - state.mean;
  state.mean += delta / state.n;
  const delta2 = x - state.mean;
  state.M2 += delta * delta2;
}

function getVariance() {
  if (state.n < 2) return 0;
  return state.M2 / (state.n - 1);
}

function getStdDev() {
  return Math.sqrt(getVariance());
}

function updateMode(price) {
  const normalizedPrice = Math.round(price * 100) / 100;
  const currentFreq = (state.frequencyMap.get(normalizedPrice) || 0) + 1;
  state.frequencyMap.set(normalizedPrice, currentFreq);
  if (currentFreq > state.modeFrequency) {
    state.mode = normalizedPrice;
    state.modeFrequency = currentFreq;
  }
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

function updateMinMax(value) {
  if (value < state.min) state.min = value;
  if (value > state.max) state.max = value;
}

function processData(id, value) {
  const startTime = performance.now();
  checkPacketLoss(id);
  updateWelford(value);
  updateMinMax(value);
  updateMode(value);
  state.lastCalcTime = performance.now() - startTime;
}

function getStats() {
  const startTime = performance.now();
  const stats = {
    count: state.n,
    lastCalcTime: state.lastCalcTime,
    lastId: state.lastId,
    lostPackets: state.lostPackets,
    max: state.n > 0 ? state.max : null,
    mean: state.n > 0 ? state.mean : null,
    min: state.n > 0 ? state.min : null,
    mode: state.mode,
    modeFrequency: state.modeFrequency,
    statsGenerationTime: performance.now() - startTime,
    stdDev: state.n > 1 ? getStdDev() : null,
    uniquePrices: state.frequencyMap.size,
    variance: state.n > 1 ? getVariance() : null
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
