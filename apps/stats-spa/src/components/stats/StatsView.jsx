import { Alert, Button, Loader, Stack, Title } from '@mantine/core';

import { useStatsData } from '../../hooks/useStatsData';
import StatsTable from './StatsTable';

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
      <StatsTable stats={stats} />
    </Stack>
  );
}

export default StatsView;
