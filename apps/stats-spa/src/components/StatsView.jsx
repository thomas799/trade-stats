import { Alert, Button, Loader, Stack, Table, Title } from '@mantine/core';

import { useStatsData } from '../hooks/useStatsData';
import { formatDate, formatNumber } from '../utils/formatters';

function StatsView() {
  const { error, loading, refresh, stats } = useStatsData();

  if (loading) {
    return (
      <Stack align="center" mt="xl">
        <Loader size="lg" />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack mt="md">
        <Alert color="red" title="Error">
          {error}
        </Alert>
        <Button onClick={refresh}>Retry</Button>
      </Stack>
    );
  }

  const rows = stats.map((stat) => (
    <Table.Tr key={stat.id}>
      <Table.Td>{stat.id}</Table.Td>
      <Table.Td>{formatDate(stat.created_at)}</Table.Td>
      <Table.Td>{formatNumber(stat.mean, 6)}</Table.Td>
      <Table.Td>{formatNumber(stat.std_dev, 6)}</Table.Td>
      <Table.Td>{formatNumber(stat.mode, 6)}</Table.Td>
      <Table.Td>{formatNumber(stat.min_value, 6)}</Table.Td>
      <Table.Td>{formatNumber(stat.max_value, 6)}</Table.Td>
      <Table.Td>{stat.lost_quotes}</Table.Td>
      <Table.Td>{formatNumber(stat.calc_time, 3)} ms</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack mt="md">
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Title order={2}>Statistics History</Title>
        <Button onClick={refresh}>Refresh</Button>
      </div>

      {stats.length === 0 ? (
        <Alert color="blue">No data to display</Alert>
      ) : (
        <Table highlightOnHover striped withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Mean</Table.Th>
              <Table.Th>Std. Dev.</Table.Th>
              <Table.Th>Mode</Table.Th>
              <Table.Th>Min</Table.Th>
              <Table.Th>Max</Table.Th>
              <Table.Th>Lost</Table.Th>
              <Table.Th>Calc Time</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </Stack>
  );
}

export default StatsView;
