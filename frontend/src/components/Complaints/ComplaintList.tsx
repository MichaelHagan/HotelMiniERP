import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  MenuItem,
  Chip,
  Button,
  Tabs,
  Tab,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  AssignmentInd as WorkOrderIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintService } from '../../services/complaintService';
import {
  WorkerComplaint,
  CustomerComplaint,
  ComplaintStatus,
  Priority,
  UserRole
} from '../../types';
import { ComplaintDialog } from './ComplaintDialog';
import { ComplaintDetailDialog } from './ComplaintDetailDialog';
import WorkOrderDialog from '../WorkOrders/WorkOrderDialog';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/dateUtils';

type ComplaintType = 'worker' | 'customer';

export const ComplaintList: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [complaintType, setComplaintType] = useState<ComplaintType>('worker');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [workOrderDialogOpen, setWorkOrderDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<WorkerComplaint | CustomerComplaint | null>(null);
  const [workOrderComplaint, setWorkOrderComplaint] = useState<WorkerComplaint | CustomerComplaint | null>(null);
  const [workOrderComplaintId, setWorkOrderComplaintId] = useState<{ worker?: string; customer?: string }>({});

  // Fetch worker complaints
  const { data: workerData, isLoading: workerLoading } = useQuery({
    queryKey: ['workerComplaints', page, pageSize, statusFilter, priorityFilter, categoryFilter],
    queryFn: () => complaintService.getWorkerComplaints({
      page: page + 1,
      pageSize,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      category: categoryFilter || undefined
    }),
    enabled: complaintType === 'worker'
  });

  // Fetch customer complaints
  const { data: customerData, isLoading: customerLoading } = useQuery({
    queryKey: ['customerComplaints', page, pageSize, statusFilter, priorityFilter, categoryFilter],
    queryFn: () => complaintService.getCustomerComplaints({
      page: page + 1,
      pageSize,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      category: categoryFilter || undefined
    }),
    enabled: complaintType === 'customer'
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      const numId = parseInt(id, 10);
      return complaintType === 'worker' 
        ? complaintService.deleteWorkerComplaint(numId)
        : complaintService.deleteCustomerComplaint(numId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [complaintType === 'worker' ? 'workerComplaints' : 'customerComplaints'] });
    }
  });

  const handleComplaintTypeChange = (_event: React.SyntheticEvent, newValue: ComplaintType) => {
    setComplaintType(newValue);
    setPage(0);
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreate = () => {
    setSelectedComplaint(null);
    setDialogOpen(true);
  };

  const handleEdit = (complaint: WorkerComplaint | CustomerComplaint) => {
    setSelectedComplaint(complaint);
    setDialogOpen(true);
  };

  const handleView = (complaint: WorkerComplaint | CustomerComplaint) => {
    setSelectedComplaint(complaint);
    setDetailDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedComplaint(null);
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedComplaint(null);
  };

  const handleCreateWorkOrder = (complaint: WorkerComplaint | CustomerComplaint) => {
    console.log('Creating work order for complaint:', complaint.id, complaint.title);
    setWorkOrderComplaint(complaint);
    if (isWorkerComplaint(complaint)) {
      setWorkOrderComplaintId({ worker: complaint.id, customer: undefined });
    } else {
      setWorkOrderComplaintId({ worker: undefined, customer: complaint.id });
    }
    setWorkOrderDialogOpen(true);
  };

  const handleWorkOrderDialogClose = () => {
    setWorkOrderDialogOpen(false);
    setWorkOrderComplaint(null);
    setWorkOrderComplaintId({});
  };

  const getStatusColor = (status: ComplaintStatus): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
    switch (status) {
      case ComplaintStatus.Open:
        return 'error';
      case ComplaintStatus.InProgress:
        return 'warning';
      case ComplaintStatus.Resolved:
        return 'success';
      case ComplaintStatus.Closed:
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: Priority): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
    switch (priority) {
      case Priority.Urgent:
        return 'error';
      case Priority.High:
        return 'warning';
      case Priority.Medium:
        return 'primary';
      case Priority.Low:
        return 'success';
      default:
        return 'default';
    }
  };

  const isWorkerComplaint = (complaint: WorkerComplaint | CustomerComplaint): complaint is WorkerComplaint => {
    return 'submittedByUserId' in complaint;
  };

  const currentData = complaintType === 'worker' ? workerData : customerData;
  const isLoading = complaintType === 'worker' ? workerLoading : customerLoading;

  // Client-side filtering by search term
  const filteredComplaints = React.useMemo(() => {
    if (!currentData?.data) return [];
    
    const complaints = currentData.data as (WorkerComplaint | CustomerComplaint)[];
    
    return complaints.filter(complaint => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = complaint.title.toLowerCase().includes(searchLower);
      const descMatch = complaint.description.toLowerCase().includes(searchLower);
      
      if (complaintType === 'customer' && !isWorkerComplaint(complaint)) {
        const customerMatch = (complaint.customerName?.toLowerCase().includes(searchLower) || false) ||
                             complaint.customerEmail?.toLowerCase().includes(searchLower) ||
                             complaint.roomNumber?.toLowerCase().includes(searchLower);
        return titleMatch || descMatch || customerMatch;
      }
      
      return titleMatch || descMatch;
    });
  }, [currentData, searchTerm, complaintType]);

  const canCreate = user?.role === UserRole.Admin || user?.role === UserRole.Manager || user?.role === UserRole.Supervisor || user?.role === UserRole.Worker;
  const canEdit = user?.role === UserRole.Admin || user?.role === UserRole.Manager;
  const canDelete = user?.role === UserRole.Admin;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Complaints Management</Typography>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            New Complaint
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={complaintType}
          onChange={handleComplaintTypeChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Worker Complaints" value="worker" />
          <Tab label="Customer Complaints" value="customer" />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={complaintType === 'worker' ? "Title, description..." : "Title, customer, room..."}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          
          <TextField
            select
            label="Status"
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | '')}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value={ComplaintStatus.Open}>Open</MenuItem>
            <MenuItem value={ComplaintStatus.InProgress}>In Progress</MenuItem>
            <MenuItem value={ComplaintStatus.Resolved}>Resolved</MenuItem>
            <MenuItem value={ComplaintStatus.Closed}>Closed</MenuItem>
          </TextField>

          <TextField
            select
            label="Priority"
            size="small"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value={Priority.Urgent}>Urgent</MenuItem>
            <MenuItem value={Priority.High}>High</MenuItem>
            <MenuItem value={Priority.Medium}>Medium</MenuItem>
            <MenuItem value={Priority.Low}>Low</MenuItem>
          </TextField>

          <TextField
            select
            label="Category"
            size="small"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Service">Service</MenuItem>
            <MenuItem value="Maintenance">Maintenance</MenuItem>
            <MenuItem value="Cleanliness">Cleanliness</MenuItem>
            <MenuItem value="Noise">Noise</MenuItem>
            <MenuItem value="Safety">Safety</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              {complaintType === 'customer' && <TableCell>Customer</TableCell>}
              {complaintType === 'customer' && <TableCell>Room</TableCell>}
              <TableCell>Assigned To</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={complaintType === 'customer' ? 9 : 7} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={complaintType === 'customer' ? 9 : 7} align="center">
                  No complaints found
                </TableCell>
              </TableRow>
            ) : (
              filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id} hover>
                  <TableCell>{complaint.title}</TableCell>
                  <TableCell>
                    <Chip label={complaint.category} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={complaint.priority}
                      size="small"
                      color={getPriorityColor(complaint.priority)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={complaint.status}
                      size="small"
                      color={getStatusColor(complaint.status)}
                    />
                  </TableCell>
                  {complaintType === 'customer' && !isWorkerComplaint(complaint) && (
                    <>
                      <TableCell>{complaint.customerName}</TableCell>
                      <TableCell>{complaint.roomNumber || '-'}</TableCell>
                    </>
                  )}
                  <TableCell>
                    {complaint.assignedToUserName || 'Unassigned'}
                  </TableCell>
                  <TableCell>{formatDateTime(complaint.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleView(complaint)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {canEdit && (
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(complaint)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {canEdit && (
                      <Tooltip title={complaint.hasWorkOrder ? "Work Order Already Exists" : "Create Work Order"}>
                        <span>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCreateWorkOrder(complaint)} 
                            color="primary"
                            disabled={complaint.hasWorkOrder}
                          >
                            <WorkOrderIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                    {canDelete && (
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(complaint.id)}>
                          <DeleteIcon />
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={currentData?.totalCount || 0}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <ComplaintDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        complaint={selectedComplaint}
        complaintType={complaintType}
      />

      <ComplaintDetailDialog
        open={detailDialogOpen}
        onClose={handleDetailDialogClose}
        complaint={selectedComplaint}
        complaintType={complaintType}
      />

      <WorkOrderDialog
        open={workOrderDialogOpen}
        onClose={handleWorkOrderDialogClose}
        workOrder={null}
        workerComplaintId={workOrderComplaintId.worker}
        customerComplaintId={workOrderComplaintId.customer}
        complaintTitle={workOrderComplaint?.title}
        complaintDescription={workOrderComplaint?.description}
      />
    </Box>
  );
};
