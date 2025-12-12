import { useState } from 'react';

import {
  Container,
  MantineProvider,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core';
import '@mantine/core/styles.css';
import MathWorkerUrl from '@trade-stats/math-worker?worker&url';

import ControlPanel from './components/ControlPanel';
import LiveMetrics from './components/LiveMetrics';
import StatsView from './components/StatsView';
import { useBatchProcessor } from './hooks/useBatchProcessor';
import { useWebSocket } from './hooks/useWebSocket';
import { useWorker } from './hooks/useWorker';
import {
  API_ENDPOINT,
  DEFAULT_BATCH_SIZE,
  WEBSOCKET_URL
} from './utils/config';
import { transformStatsForAPI } from './utils/transformers';

function App() {
  const [batchSize, setBatchSize] = useState(DEFAULT_BATCH_SIZE);
  const [showStats, setShowStats] = useState(false);
  const [status, setStatus] = useState('');

  const { liveMetrics, postMessage: postToWorker } = useWorker({
    onReady: () => setStatus('Worker is ready to work'),
    onResetComplete: () => setStatus('Statistics reset to Worker'),
    onStats: async (stats) => {
      setStatus('Sending statistics to server...');

      try {
        const response = await fetch(API_ENDPOINT, {
          body: JSON.stringify(transformStatsForAPI(stats)),
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
    },
    workerUrl: MathWorkerUrl
  });

  const { processMessage, resetBatch } = useBatchProcessor({
    batchSize,
    onBatchComplete: () => postToWorker('GET_STATS'),
    onQuote: (quote) => postToWorker('DATA', quote)
  });

  const { connect, disconnect, isConnected, messageCount } = useWebSocket({
    onMessage: processMessage,
    onStatusChange: setStatus,
    url: WEBSOCKET_URL
  });

  const handleStart = () => {
    isConnected ? disconnect() : connect();
  };

  const handleReset = () => {
    postToWorker('RESET');
    resetBatch();
    setStatus('Resetting statistics...');
  };

  const toggleShowStats = () => {
    setShowStats(!showStats);
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
            onShowStats={toggleShowStats}
            onStart={handleStart}
          />

          {liveMetrics ? (
            <LiveMetrics metrics={liveMetrics} />
          ) : (
            <Paper withBorder p="md" shadow="sm">
              <Text c="dimmed" size="sm">
                Waiting for data...
              </Text>
            </Paper>
          )}

          {showStats && <StatsView />}
        </Stack>
      </Container>
    </MantineProvider>
  );
}

export default App;
