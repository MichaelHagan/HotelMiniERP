import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  CheckCircle as CompleteIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workOrderService } from '../../services/workOrderService';
import { WorkOrder, WorkOrderStatus, Priority, UserRole } from '../../types';
import WorkOrderDialog from './WorkOrderDialog';
import WorkOrderDetailDialog from './WorkOrderDetailDialog';
import { formatDateTime } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

const WorkOrderList: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['workOrders', page, rowsPerPage, statusFilter, priorityFilter],
    queryFn: () =>
      workOrderService.getWorkOrders({
        page: page + 1,
        pageSize: rowsPerPage,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        priority: priorityFilter !== 'All' ? priorityFilter : undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => workOrderService.deleteWorkOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => workOrderService.completeWorkOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
    },
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClick = () => {
    setSelectedWorkOrder(null);
    setDialogOpen(true);
  };

  const handleEditClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setDialogOpen(true);
  };

  const handleViewClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this work order?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCompleteClick = async (id: string) => {
    if (window.confirm('Mark this work order as completed?')) {
      completeMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedWorkOrder(null);
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedWorkOrder(null);
  };

  const filteredWorkOrders = data?.data?.filter(
    (workOrder: WorkOrder) =>
      workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: WorkOrderStatus) => {
    switch (status) {
      case WorkOrderStatus.Open:
        return 'info';
      case WorkOrderStatus.InProgress:
        return 'warning';
      case WorkOrderStatus.Completed:
        return 'success';
      case WorkOrderStatus.Cancelled:
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.Critical:
        return 'error';
      case Priority.High:
        return 'warning';
      case Priority.Medium:
        return 'info';
      case Priority.Low:
        return 'success';
      default:
        return 'default';
    }
  };

  const canComplete = (workOrder: WorkOrder) => {
    return (
      workOrder.status === WorkOrderStatus.InProgress &&
      (user?.id === workOrder.assignedToUserId || user?.role === UserRole.Admin || user?.role === UserRole.Manager || user?.role === UserRole.Supervisor)
    );
  };

  const canEdit = (workOrder: WorkOrder) => {
    return user?.role === UserRole.Admin || user?.role === UserRole.Manager || user?.id === workOrder.requestedByUserId;
  };

  const canDelete = (workOrder: WorkOrder) => {
    return user?.role === UserRole.Admin || user?.role === UserRole.Manager;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Work Orders</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          New Work Order
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            placeholder="Search work orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as WorkOrderStatus | 'All')}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value={WorkOrderStatus.Open}>Open</MenuItem>
              <MenuItem value={WorkOrderStatus.InProgress}>In Progress</MenuItem>
              <MenuItem value={WorkOrderStatus.Completed}>Completed</MenuItem>
              <MenuItem value={WorkOrderStatus.Cancelled}>Cancelled</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value={Priority.Critical}>Critical</MenuItem>
              <MenuItem value={Priority.High}>High</MenuItem>
              <MenuItem value={Priority.Medium}>Medium</MenuItem>
              <MenuItem value={Priority.Low}>Low</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Scheduled Date</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredWorkOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No work orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredWorkOrders.map((workOrder) => (
                <TableRow key={workOrder.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {workOrder.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {workOrder.description.substring(0, 50)}
                      {workOrder.description.length > 50 ? '...' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={workOrder.priority}
                      color={getPriorityColor(workOrder.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={workOrder.status.replace(/([A-Z])/g, ' $1').trim()}
                      color={getStatusColor(workOrder.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {workOrder.assignedToUserName ? (
                      <Typography variant="body2">
                        {workOrder.assignedToUserName}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unassigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {workOrder.assetName ? (
                      <Typography variant="body2">{workOrder.assetName}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {workOrder.scheduledDate ? formatDateTime(workOrder.scheduledDate) : 'N/A'}
                  </TableCell>
                  <TableCell>{formatDateTime(workOrder.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewClick(workOrder)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {canEdit(workOrder) && (
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditClick(workOrder)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {canComplete(workOrder) && (
                      <Tooltip title="Mark Complete">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleCompleteClick(workOrder.id)}
                        >
                          <CompleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {canDelete(workOrder) && (
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(workOrder.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={data?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <WorkOrderDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        workOrder={selectedWorkOrder}
      />

      <WorkOrderDetailDialog
        open={detailDialogOpen}
        onClose={handleDetailDialogClose}
        workOrder={selectedWorkOrder}
      />
    </Box>
  );
};

export default WorkOrderList;
