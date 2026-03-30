import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import {
  TICKETS_TAB_TITLE,
  TICKETS_TAB_DESCRIPTION,
  TICKETS_EMPTY_MESSAGE,
  SEVERITY_COLORS,
  TEAM_LABELS,
} from "../constants";
import {
  getAllTickets,
  deleteTicketById,
  deleteAllTickets,
} from "../services/api";

const SEVERITY_OPTIONS = ["", "HIGHEST", "HIGH", "MEDIUM", "LOW", "TBD"];
const TEAM_OPTIONS = ["", "BACKEND", "FRONTEND", "QA", "PBI", "TBD"];

const COLUMNS = [
  { id: "reporterName", label: "Reporter", sortable: true, filterable: "text" },
  {
    id: "severity",
    label: "Severity",
    sortable: true,
    filterable: "select",
    options: SEVERITY_OPTIONS,
  },
  {
    id: "assignedBlame",
    label: "Blame",
    sortable: true,
    filterable: "select",
    options: TEAM_OPTIONS,
  },
  {
    id: "bugDescription",
    label: "Description",
    sortable: true,
    filterable: "text",
  },
  { id: "createdAt", label: "Created", sortable: true, filterable: false },
  { id: "actions", label: "", sortable: false, filterable: false, width: 50 },
];

function descendingComparator(a, b, orderBy) {
  const aVal = a[orderBy] ?? "";
  const bVal = b[orderBy] ?? "";
  if (bVal < aVal) return -1;
  if (bVal > aVal) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function formatTimestamp(instant) {
  if (!instant) return "—";
  try {
    return new Date(instant).toLocaleString();
  } catch {
    return String(instant);
  }
}

export default function TicketsTab() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const [filters, setFilters] = useState({
    reporterName: "",
    severity: "",
    assignedBlame: "",
    bugDescription: "",
  });

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllTickets();
      const sorted = (data || []).sort((a, b) => {
        const aTime = a.createdAt || "";
        const bTime = b.createdAt || "";
        return bTime > aTime ? 1 : bTime < aTime ? -1 : 0;
      });
      setTickets(sorted);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch tickets.";
      setError(String(message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      reporterName: "",
      severity: "",
      assignedBlame: "",
      bugDescription: "",
    });
    setPage(0);
  };

  const handleDeleteTicket = async (bugUuid) => {
    try {
      await deleteTicketById(bugUuid);
      setTickets((prev) => prev.filter((t) => t.bugUuid !== bugUuid));
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete ticket.";
      setError(String(message));
    }
  };

  const handleDeleteAll = async () => {
    setConfirmDeleteAll(false);
    try {
      await deleteAllTickets();
      setTickets([]);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete tickets.";
      setError(String(message));
    }
  };

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (
        filters.reporterName &&
        !t.reporterName
          ?.toLowerCase()
          .includes(filters.reporterName.toLowerCase())
      )
        return false;
      if (filters.severity && t.severity !== filters.severity) return false;
      if (filters.assignedBlame && t.assignedBlame !== filters.assignedBlame)
        return false;
      if (
        filters.bugDescription &&
        !t.bugDescription
          ?.toLowerCase()
          .includes(filters.bugDescription.toLowerCase())
      )
        return false;
      return true;
    });
  }, [tickets, filters]);

  const sorted = useMemo(
    () => [...filtered].sort(getComparator(order, orderBy)),
    [filtered, order, orderBy],
  );
  const paginated = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            {TICKETS_TAB_TITLE}
          </Typography>
          <Typography variant="body2">{TICKETS_TAB_DESCRIPTION}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <IconButton onClick={clearFilters} color="warning">
                <FilterListOffIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Refresh tickets">
            <IconButton
              onClick={fetchTickets}
              color="primary"
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete all tickets">
            <IconButton
              onClick={() => setConfirmDeleteAll(true)}
              color="error"
              disabled={loading || tickets.length === 0}
            >
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {!loading && tickets.length === 0 && !error && (
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", textAlign: "center", py: 6 }}
        >
          {TICKETS_EMPTY_MESSAGE}
        </Typography>
      )}

      {!loading && tickets.length > 0 && (
        <>
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "background.paper", overflowX: "visible" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  {COLUMNS.map((col) => (
                    <TableCell
                      key={col.id}
                      sx={{ fontWeight: 700, width: col.width }}
                    >
                      {col.sortable ? (
                        <TableSortLabel
                          active={orderBy === col.id}
                          direction={orderBy === col.id ? order : "asc"}
                          onClick={() => handleSort(col.id)}
                        >
                          {col.label}
                        </TableSortLabel>
                      ) : (
                        col.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {COLUMNS.map((col) => (
                    <TableCell
                      key={`filter-${col.id}`}
                      sx={{
                        py: 0.5,
                        borderBottom: "2px solid rgba(144, 202, 249, 0.1)",
                      }}
                    >
                      {col.filterable === "text" && (
                        <TextField
                          size="small"
                          variant="standard"
                          placeholder="Filter..."
                          value={filters[col.id] || ""}
                          onChange={(e) =>
                            handleFilterChange(col.id, e.target.value)
                          }
                          sx={{
                            width: "100%",
                            "& input": { fontSize: "0.8rem", py: 0.25 },
                          }}
                        />
                      )}
                      {col.filterable === "select" && (
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ width: "100%" }}
                        >
                          <Select
                            value={filters[col.id] || ""}
                            onChange={(e) =>
                              handleFilterChange(col.id, e.target.value)
                            }
                            displayEmpty
                            sx={{ fontSize: "0.8rem" }}
                          >
                            <MenuItem value="">
                              <em>All</em>
                            </MenuItem>
                            {col.options.filter(Boolean).map((opt) => (
                              <MenuItem key={opt} value={opt}>
                                {opt}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((ticket) => {
                  const severityColor =
                    SEVERITY_COLORS[ticket.severity] || SEVERITY_COLORS.TBD;

                  return (
                    <TableRow key={ticket.bugUuid} hover>
                      <TableCell>{ticket.reporterName}</TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.severity}
                          size="small"
                          sx={{
                            backgroundColor: severityColor,
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            TEAM_LABELS[ticket.assignedBlame] ||
                            ticket.assignedBlame
                          }
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                      >
                        {ticket.bugDescription}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          {formatTimestamp(ticket.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete ticket">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteTicket(ticket.bugUuid)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginated.length === 0 && hasActiveFilters && (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMNS.length}
                      sx={{ textAlign: "center", py: 4 }}
                    >
                      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                        No tickets match the current filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{ pl: 2, color: "text.secondary" }}
            >
              {filtered.length} of {tickets.length} ticket(s)
              {hasActiveFilters ? " (filtered)" : ""}
            </Typography>
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </>
      )}

      <Dialog
        open={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
      >
        <DialogTitle>Delete All Tickets?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete all {tickets.length} ticket(s). This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteAll(false)}>Cancel</Button>
          <Button onClick={handleDeleteAll} color="error" variant="contained">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}