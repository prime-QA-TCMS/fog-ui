import { TableCell, TableRow, CircularProgress } from "@mui/material";
import { DataLoadingProps } from "./types";

export function DataLoading<T>({
  columns,
  hasNested = false,
  hasActions = false,
}: Readonly<DataLoadingProps<T> & { hasNested?: boolean; hasActions?: boolean }>) {
  let colspan = Math.max(1, columns?.length ?? 1);
  if (hasNested) colspan += 1;
  if (hasActions) colspan += 1;

  return (
    <TableRow data-testid="data-table-loading">
      <TableCell
        colSpan={colspan}
        align="center"
        data-testid="data-table-loading-cell"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <CircularProgress
          size={24}
          data-testid="data-table-loading-spinner"
          aria-label="Loading data"
        />
      </TableCell>
    </TableRow>
  );
}
