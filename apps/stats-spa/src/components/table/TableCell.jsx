function TableCell({ children, isHeader = false }) {
  const baseStyle = {
    borderBottom: isHeader
      ? '1px solid var(--mantine-color-gray-3)'
      : '1px solid var(--mantine-color-gray-2)',
    padding: '12px',
    textAlign: 'left'
  };

  if (isHeader) {
    return <th style={baseStyle}>{children}</th>;
  }

  return <div style={{ ...baseStyle, display: 'table-cell' }}>{children}</div>;
}

export default TableCell;
