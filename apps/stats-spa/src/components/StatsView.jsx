import { useRef } from 'react';

import { Alert, Button, Loader, Stack, Title } from '@mantine/core';
import { useVirtualizer } from '@tanstack/react-virtual';

import { useStatsData } from '../hooks/useStatsData';
import { formatDate, formatNumber } from '../utils/formatters';

function StatsView() {
  const { error, loading, refresh, stats } = useStatsData();
  const tableContainerRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: stats.length,
    estimateSize: () => 45,
    getScrollElement: () => tableContainerRef.current,
    overscan: 5
  });

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

      {stats.length === 0 ? (
        <Alert color="blue">No data to display</Alert>
      ) : (
        <div
          ref={tableContainerRef}
          style={{
            border: '1px solid var(--mantine-color-gray-3)',
            borderRadius: '4px',
            height: 'calc(100vh - 200px)',
            maxHeight: '800px',
            overflow: 'auto'
          }}
        >
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%'
            }}
          >
            <thead
              style={{
                backgroundColor: 'var(--mantine-color-gray-0)',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}
            >
              <tr>
                <th
                  style={{
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    padding: '12px',
                    textAlign: 'left'
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    padding: '12px',
                    textAlign: 'left'
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    padding: '12px',
                    textAlign: 'left'
                  }}
                >
                  Mean
                </th>
                <th
                  style={{
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    padding: '12px',
                    textAlign: 'left'
                  }}
                >
                  Std. Dev.
                </th>
                <th
                  style={{
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    padding: '12px',
                    textAlign: 'left'
                  }}
                >
                  Mode
                </th>
                <th
                  style={{
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    padding: '12px',
                    textAlign: 'left'
                  }}
                >
                  Min
                </th>
                <th
                  style={{
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    padding: '12px',
                    textAlign: 'left'
                  }}
                >
                  Max
                </th>
                <th
                  style={{
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    padding: '12px',
                    textAlign: 'left'
                  }}
                >
                  Lost
                </th>
                <th
                  style={{
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    padding: '12px',
                    textAlign: 'left'
                  }}
                >
                  Calc Time
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                <td colSpan={9} style={{ padding: 0, position: 'relative' }}>
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const stat = stats[virtualRow.index];
                    const isEven = virtualRow.index % 2 === 0;
                    return (
                      <div
                        key={stat.id}
                        style={{
                          backgroundColor: isEven
                            ? 'var(--mantine-color-gray-0)'
                            : 'transparent',
                          display: 'table',
                          height: `${virtualRow.size}px`,
                          left: 0,
                          position: 'absolute',
                          top: 0,
                          transform: `translateY(${virtualRow.start}px)`,
                          width: '100%'
                        }}
                      >
                        <div style={{ display: 'table-row' }}>
                          <div
                            style={{
                              borderBottom:
                                '1px solid var(--mantine-color-gray-2)',
                              display: 'table-cell',
                              padding: '12px'
                            }}
                          >
                            {stat.id}
                          </div>
                          <div
                            style={{
                              borderBottom:
                                '1px solid var(--mantine-color-gray-2)',
                              display: 'table-cell',
                              padding: '12px'
                            }}
                          >
                            {formatDate(stat.created_at)}
                          </div>
                          <div
                            style={{
                              borderBottom:
                                '1px solid var(--mantine-color-gray-2)',
                              display: 'table-cell',
                              padding: '12px'
                            }}
                          >
                            {formatNumber(stat.mean, 6)}
                          </div>
                          <div
                            style={{
                              borderBottom:
                                '1px solid var(--mantine-color-gray-2)',
                              display: 'table-cell',
                              padding: '12px'
                            }}
                          >
                            {formatNumber(stat.std_dev, 6)}
                          </div>
                          <div
                            style={{
                              borderBottom:
                                '1px solid var(--mantine-color-gray-2)',
                              display: 'table-cell',
                              padding: '12px'
                            }}
                          >
                            {formatNumber(stat.mode, 6)}
                          </div>
                          <div
                            style={{
                              borderBottom:
                                '1px solid var(--mantine-color-gray-2)',
                              display: 'table-cell',
                              padding: '12px'
                            }}
                          >
                            {formatNumber(stat.min_value, 6)}
                          </div>
                          <div
                            style={{
                              borderBottom:
                                '1px solid var(--mantine-color-gray-2)',
                              display: 'table-cell',
                              padding: '12px'
                            }}
                          >
                            {formatNumber(stat.max_value, 6)}
                          </div>
                          <div
                            style={{
                              borderBottom:
                                '1px solid var(--mantine-color-gray-2)',
                              display: 'table-cell',
                              padding: '12px'
                            }}
                          >
                            {stat.lost_quotes}
                          </div>
                          <div
                            style={{
                              borderBottom:
                                '1px solid var(--mantine-color-gray-2)',
                              display: 'table-cell',
                              padding: '12px'
                            }}
                          >
                            {formatNumber(stat.calc_time, 3)} ms
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Stack>
  );
}

export default StatsView;
