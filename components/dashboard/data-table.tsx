"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showAllRows, setShowAllRows] = useState<boolean>(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: showAllRows ? undefined : getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    manualPagination: showAllRows,
  });

  return (
    <div className="rounded-md border">
      <Card>
        <CardHeader>
          <CardTitle>Product Catalogue</CardTitle>
          <CardDescription>Edit or delete products here</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div>
              <Input
                placeholder="Filter Products"
                value={
                  (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) => {
                  table.getColumn("title")?.setFilterValue(event.target.value);
                }}
              />
            </div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
            <div
              className={cn(
                "flex gap-4 pt-4",
                showAllRows ? "justify-center" : "justify-between"
              )}
            >
              <Button
                variant={"outline"}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={cn(showAllRows ? "hidden" : "")}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">
                  Go to previous page
                </span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowAllRows(!showAllRows)}
                disabled={
                  !table.getCanNextPage() && !table.getCanPreviousPage()
                }
                className="text-xs"
              >
                {showAllRows ? "Show paginated" : "Show all rows"}
              </Button>
              <Button
                variant={"outline"}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={cn(showAllRows ? "hidden" : "")}
              >
                <span className="text-xs hidden sm:inline">
                  Go to next page
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
