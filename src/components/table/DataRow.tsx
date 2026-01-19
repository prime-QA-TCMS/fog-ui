import { TableCell, TableRow, IconButton } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { DataRowProps } from "./types";

export function DataRow<T>({ item, columns, id, isOpen, onToggle, rowComponent, nestedConfig }: Readonly<DataRowProps<T>>) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle(id);
    }
  };

  return (
    <TableRow
      hover
      onClick={() => onToggle(id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-testid={`data-table-row-${id}`}
      role="row"
      aria-expanded={nestedConfig ? isOpen : undefined}
      sx={{ cursor: 'pointer' }}
    >
      {nestedConfig && (
        <TableCell
          width="5%"
          data-testid={`data-table-expand-cell-${id}`}
        >
          <IconButton
            size="small"
            data-testid={`data-table-expand-button-${id}`}
            aria-label={isOpen ? "Collapse row" : "Expand row"}
            aria-expanded={isOpen}
          >
            {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
      )}
      {columns.map((col, index) => (
        <TableCell
          key={`row-${id}-${index}-${String(col.key)}`}
          align={col.align || "left"}
          data-testid={`data-table-cell-${id}-${String(col.key)}`}
          role="cell"
        >
          {col.render ? col.render(item) : (item as any)[col.key]}
        </TableCell>
      ))}
      {rowComponent && (
        <TableCell
          align="center"
          data-testid={`data-table-actions-${id}`}
        >
          {rowComponent(item)}
        </TableCell>
      )}
    </TableRow>
  );
}
