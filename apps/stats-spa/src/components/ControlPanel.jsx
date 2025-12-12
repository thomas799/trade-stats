import {
  Badge,
  Button,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text
} from '@mantine/core';

import LiveMetrics from './metrics/LiveMetrics';

function ControlPanel({
  batchSize,
  isConnected,
  liveMetrics,
  messageCount,
  onReset,
  onShowStats,
  onStart,
  setBatchSize,
  showStats,
  status
}) {
  return (
    <Paper withBorder p="md" shadow="sm">
      <Group align="stretch" gap="md" wrap="nowrap">
        <Stack gap="md" style={{ flex: '0 0 auto', minWidth: 320 }}>
          <NumberInput
            disabled={isConnected}
            label="Number of quotes in the batch"
            min={1}
            value={batchSize}
            onChange={setBatchSize}
          />

          <Group>
            <Button color={isConnected ? 'red' : 'green'} onClick={onStart}>
              {isConnected ? 'Stop' : 'Start'}
            </Button>

            <Button variant="default" onClick={onShowStats}>
              {showStats ? 'Hide statistics' : 'Statistics'}
            </Button>

            <Button
              color="red"
              disabled={isConnected}
              variant="outline"
              onClick={onReset}
            >
              Reset
            </Button>
          </Group>

          <Stack gap="xs">
            <Group>
              <Text fw={500} size="sm">
                Status:
              </Text>
              <Badge color={isConnected ? 'green' : 'gray'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </Group>

            <Group>
              <Text fw={500} size="sm">
                Messages received:
              </Text>
              <Badge variant="light">{messageCount}</Badge>
            </Group>

            {status && (
              <Text c="dimmed" size="sm">
                {status}
              </Text>
            )}
          </Stack>
        </Stack>

        <Paper
          withBorder
          p="md"
          radius="sm"
          style={{
            backgroundColor: 'var(--mantine-color-gray-0)',
            flex: 1,
            minWidth: 0
          }}
        >
          <LiveMetrics metrics={liveMetrics} />
        </Paper>
      </Group>
    </Paper>
  );
}

export default ControlPanel;
