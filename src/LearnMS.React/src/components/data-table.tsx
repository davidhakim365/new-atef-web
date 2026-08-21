import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DataTablePagination,
  DataTableViewOptions,
} from "./data-table-components";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: Readonly<TData[]>;
  sorting?: SortingState;
  setSorting?: OnChangeFn<SortingState>;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: OnChangeFn<ColumnFiltersState>;
  getRowId?: (row: TData) => string;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  rowSelection?: RowSelectionState;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  setPagination?: OnChangeFn<PaginationState>;
  rowCount?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setColumnFilters,
  columnFilters,
  pagination,
  setRowSelection,
  setPagination,
  rowSelection,
  rowCount,
  setSorting,
  getRowId,
  sorting,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data as any,
    getRowId,
    columns,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
    onRowSelectionChange: setRowSelection,
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
    rowCount,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      rowSelection: rowSelection ?? {},
      sorting,
      columnFilters,
    },
  });

  return (
    <div
      className="overflow-x-auto"
      style={{ width: "100%", maxWidth: "100%", minWidth: "10%" }}
    >
      <div className="flex items-center py-4 overflow-x-auto text-foreground">
        <DataTableViewOptions table={table} />
      </div>
      <div className="mb-5 overflow-x-auto border rounded-md">
        <div className="max-h-[calc(100vh-12rem)]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: `${header.getSize()}px`,
                        minWidth: "10px",
                        textAlign: "center",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    style={{ textAlign: "center" }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: `${cell.getContext().column.getSize()}px`,
                          minWidth: "10px",
                          padding: "8px",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {(pagination || rowCount) && <DataTablePagination table={table} />}
    </div>
  );
}
