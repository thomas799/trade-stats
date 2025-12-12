import { useEffect, useRef, useState } from 'react';

export function useWorker({ onReady, onResetComplete, onStats, workerUrl }) {
  const workerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState(null);

  const onStatsRef = useRef(onStats);
  const onReadyRef = useRef(onReady);
  const onResetCompleteRef = useRef(onResetComplete);

  useEffect(() => {
    onStatsRef.current = onStats;
    onReadyRef.current = onReady;
    onResetCompleteRef.current = onResetComplete;
  }, [onStats, onReady, onResetComplete]);

  useEffect(() => {
    workerRef.current = new Worker(workerUrl, { type: 'module' });

    workerRef.current.onmessage = async (e) => {
      const { payload, type } = e.data;

      if (type === 'READY') {
        setIsReady(true);
        if (onReadyRef.current) onReadyRef.current();
        return;
      }

      if (type === 'STATS') {
        setLiveMetrics(payload);
        if (onStatsRef.current) await onStatsRef.current(payload);
      }

      if (type === 'RESET_COMPLETE') {
        setLiveMetrics(null);
        if (onResetCompleteRef.current) onResetCompleteRef.current();
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [workerUrl]);

  const postMessage = (type, payload) => {
    if (workerRef.current) {
      workerRef.current.postMessage({ payload, type });
    }
  };

  return { isReady, liveMetrics, postMessage };
}
