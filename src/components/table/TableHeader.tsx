import { TableCell, TableHead, TableRow } from "@mui/material";
import { TableHeaderProps } from "./types";

export function TableHeader<T>({
  columns,
  hasNested = false,
  hasActions = false,
}: Readonly<TableHeaderProps<T>>) {
  return (
    <TableHead data-testid="data-table-header">
      <TableRow role="row">
        {hasNested && (
          <TableCell
            width="5%"
            data-testid="data-table-header-expand"
            aria-label="Expand column"
          />
        )}
        {columns.map((col, index) => (
          <TableCell
            key={`header-${index}-${String(col.key)}`}
            align={col.align || "left"}
            data-testid={`data-table-header-${String(col.key)}`}
            role="columnheader"
            scope="col"
          >
            {col.label}
          </TableCell>
        ))}
        {hasActions && (
          <TableCell
            align="center"
            data-testid="data-table-header-actions"
            role="columnheader"
            scope="col"
          >
            Actions
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}
