import { useEffect, useRef, useState } from 'react';

export function useWorker({ onReady, onResetComplete, onStats, workerUrl }) {
  const workerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState(null);

  useEffect(() => {
    workerRef.current = new Worker(workerUrl, { type: 'module' });

    workerRef.current.onmessage = async (e) => {
      const { payload, type } = e.data;

      if (type === 'READY') {
        setIsReady(true);
        if (onReady) onReady();
        return;
      }

      if (type === 'STATS') {
        setLiveMetrics(payload);
        if (onStats) await onStats(payload);
      }

      if (type === 'RESET_COMPLETE') {
        setLiveMetrics(null);
        if (onResetComplete) onResetComplete();
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [workerUrl, onStats, onReady, onResetComplete]);

  const postMessage = (type, payload) => {
    if (workerRef.current) {
      workerRef.current.postMessage({ payload, type });
    }
  };

  return { isReady, liveMetrics, postMessage };
}
