import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";

export default function DataTable({
  columns = [],
  rows = [],
  rowKey = "id",
  rowsPerPage = 10,
  search = false,
  searchPlaceholder = "Search...",
  initialSearchValue = "",
  searchValue,
  onSearch,
  onSearchChange,
  searchDebounce = 400,
  title = "",
  subtitle = "",
  minWidth = 760,
  actions,
  loading = false,
  totalItems,
  currentPage,
  onPageChange,
  pagination,
}) {
  const [internalSearch, setInternalSearch] = useState(initialSearchValue);
  const [page, setPage] = useState(1);
  const searchText = searchValue ?? internalSearch;
  const isServerSearch = typeof onSearch === "function";
  const onSearchRef = useRef(onSearch);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    return () => window.clearTimeout(searchTimeoutRef.current);
  }, []);

  const filteredRows = useMemo(() => {
    const query = isServerSearch ? "" : searchText.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      columns.some((column) => {
        const value = row[column.field];
        return String(value ?? "").toLowerCase().includes(query);
      })
    );
  }, [columns, isServerSearch, rows, searchText]);

  const paginationPage = pagination?.page ?? pagination?.currentPage ?? currentPage;
  const paginationPerPage = pagination?.perPage ?? pagination?.per_page ?? rowsPerPage;
  const paginationTotal = pagination?.total ?? pagination?.totalItems ?? totalItems;
  const paginationPageChange = pagination?.onPageChange ?? onPageChange;
  const isServerPagination =
    typeof paginationTotal === "number" &&
    typeof paginationPage === "number" &&
    typeof paginationPageChange === "function";
  const recordCount = isServerPagination ? paginationTotal : filteredRows.length;
  const activeRowsPerPage = isServerPagination ? paginationPerPage : rowsPerPage;
  const pageCount = Math.max(1, Math.ceil(recordCount / activeRowsPerPage));
  const activePage = isServerPagination ? paginationPage : Math.min(page, pageCount);
  const startIndex = (activePage - 1) * activeRowsPerPage;
  const visibleRows = filteredRows.slice(startIndex, startIndex + activeRowsPerPage);
  const displayedRows = isServerPagination ? rows : visibleRows;

  const handleSearchChange = (value) => {
    if (searchValue === undefined) setInternalSearch(value);
    onSearchChange?.(value);
    setPage(1);
    if (isServerSearch) {
      window.clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = window.setTimeout(() => {
        onSearchRef.current?.(value);
      }, searchDebounce);
    }
  };

  const handlePageChange = (nextPage) => {
    if (isServerPagination) {
      paginationPageChange(nextPage);
      return;
    }
    setPage(nextPage);
  };

  return (
    <div className="w-full">
      {search && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TextField
            value={searchText}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            size="small"
            sx={{
              maxWidth: 420,
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                fontSize: 14,
                "& fieldset": { borderColor: "#E2E8F0" },
                "&:hover fieldset": { borderColor: "#94A3B8" },
                "&.Mui-focused fieldset": { borderColor: "#0D9999", borderWidth: "1px" },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={17} className="text-neutral-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
          {actions}
        </div>
      )}

      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-base font-semibold text-brand-navy">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>
      )}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #E2E8F0",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(32, 61, 97, 0.07)",
          overflowX: "auto",
          maxHeight: 720,
          fontFamily: "Inter, sans-serif",
          scrollbarWidth: "thin",
          scrollbarColor: "#91A6BD #EDF2F7",
          "&::-webkit-scrollbar": {
            height: 10,
            width: 10,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#EDF2F7",
            borderRadius: "999px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#91A6BD",
            border: "2px solid #EDF2F7",
            borderRadius: "999px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#0D9999",
          },
          "&::-webkit-scrollbar-corner": {
            backgroundColor: "#EDF2F7",
          },
        }}
      >
        <Table stickyHeader sx={{ minWidth, fontFamily: "Inter, sans-serif" }}>
          <TableHead>
            <TableRow sx={{ "& th": { backgroundColor: "#203D61", borderBottom: 0 } }}>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || "left"}
                  sx={{
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    px: 2,
                    py: 2,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    lineHeight: 1.5,
                    ...column.headerSx,
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={Boolean(column.sortActive)}
                      direction={column.sortDirection || "asc"}
                      onClick={column.onSort}
                      sx={{
                        color: "#FFFFFF !important",
                        "& .MuiTableSortLabel-icon": { color: "#FFFFFF !important", opacity: 0.8 },
                      }}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ borderBottom: 0, py: 8 }}>
                  <Box className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                    <Loader2 size={20} className="animate-spin text-brand-teal" />
                    Loading records...
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {!loading && displayedRows.map((row, rowIndex) => (
              <TableRow
                key={row[rowKey] ?? rowIndex}
                sx={{
                  backgroundColor: (startIndex + rowIndex) % 2 ? "#FAFCFE" : "#FFFFFF",
                  transition: "background-color 160ms ease",
                  "&:hover": { backgroundColor: "#F0FAFA !important" },
                  "& td": { borderBottom: "1px solid #EEF2F6" },
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                {columns.map((column) => {
                  const value = row[column.field];
                  return (
                    <TableCell
                      key={column.field}
                      align={column.align || "left"}
                      sx={{
                        color: "#334155",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        lineHeight: 1.5,
                        px: 2,
                        py: 2,
                        ...column.cellSx,
                      }}
                    >
                      {column.render ? column.render(value, row, startIndex + rowIndex) : value ?? "—"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {displayedRows.length === 0 && !loading && (
          <Box sx={{ py: 6, px: 2, textAlign: "center", color: "#64748B", fontSize: 14 }}>
            No records found.
          </Box>
        )}
      </TableContainer>

      <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {recordCount === 0
            ? "Showing 0 records"
            : `Showing ${startIndex + 1}-${Math.min(startIndex + activeRowsPerPage, recordCount)} of ${recordCount}`}
        </span>
        <Pagination
          count={pageCount}
          page={activePage}
          onChange={(_, nextPage) => handlePageChange(nextPage)}
          color="primary"
          size="small"
          siblingCount={1}
          boundaryCount={1}
          aria-label="Table pagination"
        />
      </div>
    </div>
  );
}
