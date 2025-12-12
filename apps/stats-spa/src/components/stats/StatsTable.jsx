import { useRef } from 'react';

import { Alert } from '@mantine/core';
import { useVirtualizer } from '@tanstack/react-virtual';

import { STATS_COLUMNS } from '../../config';
import { formatDate, formatNumber } from '../../utils/formatters';
import TableCell from '../table/TableCell';
import TableHeader from '../table/TableHeader';

function StatsTable({ stats }) {
  const tableContainerRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: stats.length,
    estimateSize: () => 45,
    getScrollElement: () => tableContainerRef.current,
    overscan: 5
  });

  if (stats.length === 0) {
    return <Alert color="blue">No data to display</Alert>;
  }

  return (
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
        <TableHeader columns={STATS_COLUMNS} />
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
                      <TableCell>{stat.id}</TableCell>
                      <TableCell>{formatDate(stat.created_at)}</TableCell>
                      <TableCell>{formatNumber(stat.mean, 6)}</TableCell>
                      <TableCell>{formatNumber(stat.std_dev, 6)}</TableCell>
                      <TableCell>{formatNumber(stat.mode, 6)}</TableCell>
                      <TableCell>{formatNumber(stat.min_value, 6)}</TableCell>
                      <TableCell>{formatNumber(stat.max_value, 6)}</TableCell>
                      <TableCell>{stat.lost_quotes}</TableCell>
                      <TableCell>
                        {formatNumber(stat.calc_time, 3)} ms
                      </TableCell>
                    </div>
                  </div>
                );
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StatsTable;
