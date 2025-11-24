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
  Chip,
  Button,
  Tooltip,
  InputAdornment,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { procedureService } from '../../services/procedureService';
import { Procedure, UserRole } from '../../types';
import { ProcedureDialog } from './ProcedureDialog';
import { ProcedureDetailDialog } from './ProcedureDetailDialog';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmDialogContext';
import { formatDateTime } from '../../utils/dateUtils';

const PROCEDURE_CATEGORIES = [
  'Front Desk',
  'Housekeeping',
  'Maintenance',
  'Food & Beverage',
  'Safety & Security',
  'Guest Services',
  'Administrative',
  'Other'
];

export const ProcedureList: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();
  
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | ''>('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);

  // Fetch procedures
  const { data, isLoading } = useQuery({
    queryKey: ['procedures', page, pageSize, categoryFilter],
    queryFn: () => procedureService.getProcedures({
      page: page + 1,
      pageSize,
      category: categoryFilter || undefined
    })
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => procedureService.deleteProcedure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedures'] });
      showSuccess('Procedure deleted successfully');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || error?.message || 'Failed to delete procedure');
    },
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreate = () => {
    setSelectedProcedure(null);
    setDialogOpen(true);
  };

  const handleEdit = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    setDialogOpen(true);
  };

  const handleView = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    setDetailDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm(
      'Are you sure you want to delete this procedure?',
      'Confirm Deletion'
    );
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedProcedure(null);
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedProcedure(null);
  };

  // Client-side filtering by search term and status
  const filteredProcedures = React.useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.filter(procedure => {
      const matchesSearch = !searchTerm || 
        procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        procedure.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        procedure.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || 
        (statusFilter === 'active' && procedure.isActive) ||
        (statusFilter === 'inactive' && !procedure.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const canCreate = user?.role === UserRole.Admin || user?.role === UserRole.Manager;
  const canEdit = user?.role === UserRole.Admin || user?.role === UserRole.Manager;
  const canDelete = user?.role === UserRole.Admin;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Standard Operating Procedures</Typography>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            New Procedure
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, description, or category..."
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
            label="Category"
            size="small"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {PROCEDURE_CATEGORIES.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'active' | 'inactive' | '')}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredProcedures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No procedures found
                </TableCell>
              </TableRow>
            ) : (
              filteredProcedures.map((procedure) => (
                <TableRow key={procedure.id} hover>
                  <TableCell>{procedure.title}</TableCell>
                  <TableCell>
                    <Chip label={procedure.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{procedure.version}</TableCell>
                  <TableCell>
                    <Chip
                      label={procedure.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={procedure.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{formatDateTime(procedure.updatedAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleView(procedure)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {canEdit && (
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(procedure)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {canDelete && (
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(procedure.id)}>
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
          count={data?.totalCount || 0}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <ProcedureDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        procedure={selectedProcedure}
      />

      <ProcedureDetailDialog
        open={detailDialogOpen}
        onClose={handleDetailDialogClose}
        procedure={selectedProcedure}
      />
    </Box>
  );
};
