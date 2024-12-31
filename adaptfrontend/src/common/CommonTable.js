import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

function CommonTable({ fetchData, columns }) {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState({}); // Column filters state

  const columnHelper = createColumnHelper();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      filters,
    },
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(totalRows / pagination.pageSize),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onFiltersChange: setFilters,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const queryParams = {
          sort: sorting
            .map((el) => `${el.id}:${el.desc ? "desc" : "asc"}`)
            .join(","),
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          filters: JSON.stringify(filters), // Pass filters as query params
        };
        const response = await fetchData(queryParams);
        console.log(response, "harshit");
        setData(response.data || []);
        setTotalRows(response.totalCount || 0);
      } catch (error) {
        console.error("Error fetching table data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTableData();
  }, [sorting, pagination, filters, fetchData]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="server-side table">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <>
                    <TableCell
                      key={header.id}
                      sx={{
                        cursor: header.column.columnDef.enableSorting
                          ? "pointer"
                          : "default",
                        "&:hover": header.column.columnDef.enableSorting
                          ? { bgcolor: (theme) => theme.palette.grey[100] }
                          : {},
                      }}
                    >
                      <Stack spacing={1}>
                        <span
                          onClick={
                            header.column.columnDef.enableSorting
                              ? () => header.column.toggleSorting(null, true)
                              : undefined
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {{
                            asc: " \uD83D\uDD3C",
                            desc: " \uD83D\uDD3D",
                          }[header.column.getIsSorted()] ?? null}
                        </span>

                        {/* Filtering UI (search box) */}
                        {header.column.columnDef.enableFiltering && (
                          <DebouncedInput
                            value={header.column.getFilterValue()}
                            // onChange={(value) =>
                            //   header.column.setFilterValue(value)
                            // }
                            onChange={(value) =>
                              setFilters((prev) => ({
                                ...prev,
                                [header.id]: value,
                              }))
                            }
                            size="small"
                            placeholder={`Search By ${flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}....`}
                          />
                        )}
                      </Stack>
                    </TableCell>
                  </>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
            )}
          </TableBody>
        </Table>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{
            p: 3,
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Pagination
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "14px",
                fontWeight: "bold",
                color: "#555",
              },
              "& .Mui-selected": {
                backgroundColor: "#1976d2 !important",
                color: "white !important",
              },
            }}
            page={table.getState().pagination.pageIndex + 1}
            onChange={(e, val) => table.setPageIndex(val - 1)}
            count={table.getPageCount()}
            showFirstButton
            showLastButton
          />
          <FormControl
            sx={{
              minWidth: 120,
              marginLeft: "auto",
              "& .MuiInputBase-root": {
                fontSize: "14px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "14px",
              },
            }}
          >
            <InputLabel id="page-limit-label">Page Limit</InputLabel>
            <Select
              labelId="page-limit-label"
              id="page-limit"
              value={table.getState().pagination.pageSize}
              label="Show items per page"
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 40, 50, 100, 200, 500].map((el) => (
                <MenuItem key={el} value={el}>
                  {el}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </TableContainer>
    </div>
  );
}

export default CommonTable;
