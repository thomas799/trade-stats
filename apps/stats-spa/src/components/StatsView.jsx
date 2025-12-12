import { useEffect, useState } from 'react';

import { Alert, Button, Loader, Stack, Table, Title } from '@mantine/core';

function StatsView() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Error loading data');
      }

      const data = await response.json();
      setStats(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return parseFloat(num).toFixed(6);
  };

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
        <Button onClick={loadStats}>Retry</Button>
      </Stack>
    );
  }

  const rows = stats.map((stat) => (
    <Table.Tr key={stat.id}>
      <Table.Td>{stat.id}</Table.Td>
      <Table.Td>{formatDate(stat.created_at)}</Table.Td>
      <Table.Td>{formatNumber(stat.mean)}</Table.Td>
      <Table.Td>{formatNumber(stat.std_dev)}</Table.Td>
      <Table.Td>{formatNumber(stat.mode)}</Table.Td>
      <Table.Td>{formatNumber(stat.min_value)}</Table.Td>
      <Table.Td>{formatNumber(stat.max_value)}</Table.Td>
      <Table.Td>{stat.lost_quotes}</Table.Td>
      <Table.Td>{stat.calc_time?.toFixed(3)} ms</Table.Td>
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
        <Button onClick={loadStats}>Refresh</Button>
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
