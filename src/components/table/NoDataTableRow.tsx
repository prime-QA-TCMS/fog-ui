import { TableCell, TableRow } from "@mui/material";
import { NoDataTableRowProps } from "./types";

export function NoDataTableRow<T>({
  columns,
  message = "No records found.",
  hasNested = false,
  hasActions = false,
}: Readonly<NoDataTableRowProps<T> & { hasNested?: boolean; hasActions?: boolean }>) {
  let colspan = columns.length;
  if (hasNested) colspan += 1;
  if (hasActions) colspan += 1;

  return (
    <TableRow data-testid="data-table-no-data">
      <TableCell
        colSpan={colspan}
        align="center"
        data-testid="data-table-no-data-cell"
        role="status"
        aria-live="polite"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
