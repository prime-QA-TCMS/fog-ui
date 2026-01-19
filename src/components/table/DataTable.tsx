import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  Box,
  TableRow,
  TableCell,
  Collapse,
} from "@mui/material";
import { DataTableProps } from "./types";
import { TableHeader } from "./TableHeader";
import { DataLoading } from "./DataLoading";
import { NoDataTableRow } from "./NoDataTableRow";
import { DataRow } from "./DataRow";
import { NestedTable } from "./NestedTable";

export function DataTable<T extends { _id?: string | number }>({
  title,
  data,
  columns,
  nestedConfig,
  loading = false,
  emptyMessage = "No records found.",
  rowComponent,
  rowExtraComponent,
  nestedHeaderComponent,
  onRowExpand,
}: Readonly<DataTableProps<T> & { onRowExpand?: (item: T) => void }>) {
  const [openRowId, setOpenRowId] = useState<string | number | null>(null);
  const triggeredRef = useRef<Set<string | number>>(new Set());

  const handleToggle = (id: string | number) => {
    setOpenRowId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (!openRowId || !onRowExpand) return;
    if (triggeredRef.current.has(openRowId)) return; // ✅ already fired

    const expandedItem = data.find((item) => item._id === openRowId);
    if (expandedItem) {
      onRowExpand(expandedItem);
      triggeredRef.current.add(openRowId); // ✅ mark this row as done
    }
  }, [openRowId, data, onRowExpand]);

  const isEmpty = !data || data.length === 0;

  if (loading) {
    return (
      <TableContainer
        component={Paper}
        sx={{ mb: 2 }}
        data-testid="data-table-container"
        role="region"
        aria-label={title || "Data table"}
      >
        {title && (
          <Typography
            variant="h6"
            sx={{ p: 2, pb: 0 }}
            data-testid="data-table-title"
            id="table-title"
          >
            {title}
          </Typography>
        )}
        <Table aria-labelledby={title ? "table-title" : undefined}>
          <TableBody>
            <DataLoading
              columns={columns}
              hasNested={!!nestedConfig}
              hasActions={!!rowComponent}
            />
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (isEmpty) {
    return (
      <TableContainer
        component={Paper}
        sx={{ mb: 2 }}
        data-testid="data-table-container"
        role="region"
        aria-label={title || "Data table"}
      >
        {title && (
          <Typography
            variant="h6"
            sx={{ p: 2, pb: 0 }}
            data-testid="data-table-title"
            id="table-title"
          >
            {title}
          </Typography>
        )}
        <Table aria-labelledby={title ? "table-title" : undefined}>
          <TableBody>
            <NoDataTableRow
              columns={columns}
              message={emptyMessage}
              hasNested={!!nestedConfig}
              hasActions={!!rowComponent}
            />
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ mb: 2 }}
      data-testid="data-table-container"
      role="region"
      aria-label={title || "Data table"}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{ p: 2, pb: 0 }}
          data-testid="data-table-title"
          id="table-title"
        >
          {title}
        </Typography>
      )}

      <Table aria-labelledby={title ? "table-title" : undefined} data-testid="data-table">
        <TableHeader
          columns={columns}
          hasNested={!!nestedConfig}
          hasActions={!!rowComponent}
        />
        <TableBody data-testid="data-table-body">
          {data.map((item) => {
            const id = item._id ?? Math.random().toString();
            const isOpen = openRowId === id;

            return (
              <React.Fragment key={id}>
                <DataRow
                  item={item}
                  id={id}
                  isOpen={isOpen}
                  onToggle={handleToggle}
                  columns={columns}
                  rowComponent={rowComponent}
                  nestedConfig={nestedConfig}
                />

                {rowExtraComponent && (
                  <TableRow>
                    <TableCell colSpan={columns.length + (nestedConfig ? 1 : 0)}>
                      <Box sx={{ p: 1 }}>{rowExtraComponent(item)}</Box>
                    </TableCell>
                  </TableRow>
                )}

                {nestedConfig && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} sx={{ p: 0 }}>
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        {nestedHeaderComponent && (
                          <Box
                            sx={{
                              mb: 2,
                              backgroundColor: "rgba(0,0,0,0.03)",
                              borderRadius: 1,
                              p: 2,
                            }}
                          >
                            {nestedHeaderComponent(item)}
                          </Box>
                        )}
                        <NestedTable
                          columns={columns}
                          nestedConfig={nestedConfig}
                          isOpen={isOpen}
                          item={item}
                          emptyMessage={emptyMessage}
                        />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
