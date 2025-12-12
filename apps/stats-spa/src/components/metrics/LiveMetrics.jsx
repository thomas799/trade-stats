import { Divider, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';

import { formatNumber } from '../../utils/formatters';
import MetricItem from './MetricItem';

function LiveMetrics({ metrics }) {
  return (
    <Stack gap="sm" h="100%">
      <Title order={4}>Live Performance Metrics</Title>
      {metrics ? (
        <Stack flex={1} gap="sm">
          <Group gap="xl">
            <MetricItem
              label="Processed"
              value={metrics.count?.toLocaleString()}
            />
            <MetricItem label="Lost packets" value={metrics.lostPackets} />
            <MetricItem
              label="Calc time"
              unit=" ms"
              value={formatNumber(metrics.statsGenerationTime, 3)}
            />
          </Group>

          <Divider />

          <Text c="dimmed" size="xs">
            Last batch statistics
          </Text>

          <SimpleGrid cols={5}>
            <MetricItem label="Mean" value={formatNumber(metrics.mean)} />
            <MetricItem label="Std Dev" value={formatNumber(metrics.stdDev)} />
            <MetricItem label="Min" value={formatNumber(metrics.min, 0)} />
            <MetricItem label="Max" value={formatNumber(metrics.max, 0)} />
            <MetricItem label="Mode" value={formatNumber(metrics.mode, 0)} />
          </SimpleGrid>
        </Stack>
      ) : (
        <Text c="dimmed" size="sm">
          Waiting for data...
        </Text>
      )}
    </Stack>
  );
}

export default LiveMetrics;
