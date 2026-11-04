import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
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
} from "@mui/material";

export default function DataTable({
  columns = [],
  rows = [],
  rowKey = "id",
  rowsPerPage = 10,
  showSearch = false,
  searchPlaceholder = "Search...",
  title = "",
  subtitle = "",
  minWidth = 760,
  actions,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      columns.some((column) => {
        const value = row[column.field];
        return String(value ?? "").toLowerCase().includes(query);
      })
    );
  }, [columns, rows, search]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="w-full">
      {showSearch && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TextField
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
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
            {visibleRows.map((row, rowIndex) => (
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

        {visibleRows.length === 0 && (
          <Box sx={{ py: 6, px: 2, textAlign: "center", color: "#64748B", fontSize: 14 }}>
            No records found.
          </Box>
        )}
      </TableContainer>

      <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {filteredRows.length === 0
            ? "Showing 0 records"
            : `Showing ${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredRows.length)} of ${filteredRows.length}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-lg border border-border-default p-2 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-20 text-center font-medium text-brand-navy">Page {currentPage} of {pageCount}</span>
          <button
            type="button"
            disabled={currentPage === pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            className="rounded-lg border border-border-default p-2 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
