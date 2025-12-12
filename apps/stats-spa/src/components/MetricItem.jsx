import { Stack, Text } from '@mantine/core';

function MetricItem({ label, unit = '', value }) {
  return (
    <Stack gap={2}>
      <Text c="dimmed" size="xs">
        {label}
      </Text>
      <Text fw={600} size="sm">
        {value !== null && value !== undefined ? `${value}${unit}` : '—'}
      </Text>
    </Stack>
  );
}

export default MetricItem;
