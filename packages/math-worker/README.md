# @trade-stats/math-worker

Web Worker for stream processing and calculating quote statistics.

## Overview

The package processes a stream of quote data and calculates basic statistical parameters (mean, standard deviation, min/max, mode) in real time.

## Architecture

```
index.js — main worker entry point
src/utils/
├── accumulators.js — mean, stdDev, min/max calculations
├── mode.js — mode tracking
└── packetLoss.js — lost packet detector
```

## Usage

```javascript
// Initialization
const worker = new Worker(mathWorkerUrl, { type: 'module' });

// Add data
worker.postMessage({
type: 'DATA',
payload: { id: 1, value: 100.50 }
});

// Get statistics
worker.postMessage({ type: 'GET_STATS' });

worker.onmessage = (e) => {
if (e.data.type === 'STATS') {
console.log(e.data.payload);
}
};

// Reset
worker.postMessage({ type: 'RESET' });
```

## Libraries

- `@stdlib/stats-incr-meanstdev` — calculating the mean and standard deviation
- `@stdlib/stats-incr-minmax` — tracking min/max values
- `bloom-filters` — approximate mode calculation

Selected as proven and ready-to-use solutions for stream computing.

## Returned Fields

```javascript
{
count, // number of processed quotes
mean, // mean value
stdDev, // standard deviation
min, max, // minimum and maximum
mode, // most frequent value
modeFrequency, // mode frequency
modeIsApproximate, // mode approximation flag
lostPackets, // packets lost
lastCalcTime, // time of last processing
lastId // ID of the last quote
}
```