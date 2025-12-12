import { useEffect, useRef, useState } from 'react';

import { Container, MantineProvider, Stack, Title } from '@mantine/core';
import '@mantine/core/styles.css';
import MathWorkerUrl from '@trade-stats/math-worker?worker&url';

import ControlPanel from './components/ControlPanel';
import LiveMetrics from './components/LiveMetrics';
import StatsView from './components/StatsView';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [batchSize, setBatchSize] = useState(100);
  const [showStats, setShowStats] = useState(false);
  const [status, setStatus] = useState('');
  const [liveMetrics, setLiveMetrics] = useState(null);

  const wsRef = useRef(null);
  const workerRef = useRef(null);
  const localCountRef = useRef(0);

  useEffect(() => {
    workerRef.current = new Worker(MathWorkerUrl, { type: 'module' });

    workerRef.current.onmessage = async (e) => {
      const { payload, type } = e.data;

      if (type === 'READY') {
        setStatus('Worker is ready to work');
        return;
      }

      if (type === 'STATS') {
        setLiveMetrics(payload);

        try {
          setStatus('Sending statistics to server...');

          const apiPayload = {
            calc_time: payload.statsGenerationTime,
            lost_quotes: payload.lostPackets,
            max_value: payload.max,
            mean: payload.mean,
            min_value: payload.min,
            mode: payload.mode,
            std_dev: payload.stdDev
          };

          const response = await fetch('/api', {
            body: JSON.stringify(apiPayload),
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST'
          });

          await response.json().catch(() => null);

          if (response.ok) {
            setStatus(`Batch of ${batchSize} quotes processed and sent`);
          } else {
            setStatus('Error sending to server');
          }
        } catch (error) {
          setStatus('Error: ' + error.message);
        }
      }

      if (type === 'RESET_COMPLETE') {
        setStatus('Statistics reset to Worker');
        setLiveMetrics(null);
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [batchSize]);

  const handleStart = () => {
    if (isConnected) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      setStatus('Connection closed');
      return;
    }

    try {
      const ws = new WebSocket('wss://trade.termplat.com:8800/?password=1234');

      ws.onopen = () => {
        setIsConnected(true);
        setStatus('Connected to WebSocket');
        localCountRef.current = 0;
        setMessageCount(0);
      };

      ws.onmessage = (event) => {
        try {
          const quote = JSON.parse(event.data);

          workerRef.current.postMessage({
            payload: {
              id: quote.id,
              value: parseFloat(quote.value)
            },
            type: 'DATA'
          });

          localCountRef.current += 1;
          setMessageCount((prev) => prev + 1);

          if (localCountRef.current >= batchSize) {
            localCountRef.current = 0;
            workerRef.current.postMessage({ type: 'GET_STATS' });
          }
        } catch {
          // Skip malformed messages
        }
      };

      ws.onerror = () => {
        setStatus('WebSocket Error');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setStatus('Connection closed');
      };

      wsRef.current = ws;
    } catch (error) {
      setStatus('Connection error: ' + error.message);
    }
  };

  const handleShowStats = () => {
    setShowStats(!showStats);
  };

  const handleReset = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'RESET' });
      localCountRef.current = 0;
      setMessageCount(0);
      setStatus('Resetting statistics...');
    }
  };

  return (
    <MantineProvider>
      <Container py="md" size="xl">
        <Stack gap="lg">
          <Title order={1}>Trade Statistics Monitor</Title>

          <ControlPanel
            batchSize={batchSize}
            isConnected={isConnected}
            messageCount={messageCount}
            setBatchSize={setBatchSize}
            showStats={showStats}
            status={status}
            onReset={handleReset}
            onShowStats={handleShowStats}
            onStart={handleStart}
          />

          <LiveMetrics metrics={liveMetrics} />

          {showStats && <StatsView />}
        </Stack>
      </Container>
    </MantineProvider>
  );
}

export default App;
