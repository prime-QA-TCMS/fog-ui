import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { DataLoading } from "./DataLoading";
import { NoDataTableRow } from "./NoDataTableRow";
import { NestedTableProps } from "./types";
import { TableHeader } from "./TableHeader";

export function NestedTable<T>({
  columns,
  nestedConfig,
  item,
  emptyMessage = "No records found.",
}: Readonly<NestedTableProps<T>>) {
  if (!nestedConfig) return null;
  const nestedData = nestedConfig.getNestedData(item);

  if (nestedConfig.loading) {
    return <DataLoading columns={columns} />;
  } else if (!nestedData || nestedData.length === 0) {
    return <NoDataTableRow columns={columns} message={emptyMessage} />;
  }

  return (
    <Table
      size="small"
      data-testid="nested-table"
      aria-label="Nested data table"
    >
      <TableHeader
        columns={nestedConfig.nestedColumns}
        hasNested={false}
        hasActions={false}
      />
      <TableBody data-testid="nested-table-body">
        {nestedData.map((nItem, idx) => (
          <TableRow
            key={nItem._id || idx}
            data-testid={`nested-table-row-${nItem._id || idx}`}
            role="row"
          >
            {nestedConfig.nestedColumns.map((nCol, nIdx) => (
              <TableCell
                key={`nested-${nItem._id || idx}-${nIdx}-${String(nCol.key)}`}
                data-testid={`nested-table-cell-${nItem._id || idx}-${String(nCol.key)}`}
                role="cell"
              >
                {nCol.render ? nCol.render(nItem) : nItem[nCol.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
