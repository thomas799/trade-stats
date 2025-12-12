import TableCell from './TableCell';

function TableHeader({ columns }) {
  return (
    <thead
      style={{
        backgroundColor: 'var(--mantine-color-gray-0)',
        position: 'sticky',
        top: 0,
        zIndex: 1
      }}
    >
      <tr>
        {columns.map((column) => (
          <TableCell key={column} isHeader>
            {column}
          </TableCell>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
