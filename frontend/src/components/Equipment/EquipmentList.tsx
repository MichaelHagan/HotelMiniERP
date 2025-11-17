import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Build as MaintenanceIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService } from '../../services/equipmentService';
import { Equipment, EquipmentStatus, EquipmentQueryParams } from '../../types';
import EquipmentDialog from './EquipmentDialog';
import EquipmentDetailDialog from './EquipmentDetailDialog';
import { formatDateTime } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

const EquipmentList: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const queryParams: EquipmentQueryParams = {
    page: page + 1,
    pageSize,
    searchTerm: searchTerm || undefined,
    status: statusFilter || undefined,
    category: categoryFilter || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['equipment', queryParams],
    queryFn: () => equipmentService.getEquipment(queryParams),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => equipmentService.deleteEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });

  const handleCreate = () => {
    setSelectedEquipment(null);
    setDialogOpen(true);
  };

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setDialogOpen(true);
  };

  const handleView = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setDetailDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: EquipmentStatus): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case EquipmentStatus.Operational:
        return 'success';
      case EquipmentStatus.Maintenance:
        return 'warning';
      case EquipmentStatus.OutOfService:
        return 'error';
      case EquipmentStatus.Retired:
        return 'default';
      default:
        return 'default';
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'Manager';
  const canDelete = user?.role === 'Admin';

  const equipment = data?.data || [];
  const totalCount = data?.totalCount || 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Equipment Inventory</Typography>
        {canEdit && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Add Equipment
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Search"
              placeholder="Search by name, model, or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value as EquipmentStatus | '')}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value={EquipmentStatus.Operational}>Operational</MenuItem>
                <MenuItem value={EquipmentStatus.Maintenance}>Maintenance</MenuItem>
                <MenuItem value={EquipmentStatus.OutOfService}>Out of Service</MenuItem>
                <MenuItem value={EquipmentStatus.Retired}>Retired</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Category"
              placeholder="Filter by category..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Operating Hours</TableCell>
              <TableCell>Next Maintenance</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : equipment.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No equipment found
                </TableCell>
              </TableRow>
            ) : (
              equipment.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.model}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {item.serialNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                      size="small"
                      icon={item.status === EquipmentStatus.Maintenance ? <MaintenanceIcon /> : undefined}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.operatingHours?.toLocaleString()} hrs
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.nextMaintenanceDate ? (
                      <Typography variant="body2">
                        {formatDateTime(item.nextMaintenanceDate)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Not scheduled
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleView(item)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {canEdit && (
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(item)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {canDelete && (
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(item.id)}
                          color="error"
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
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      <EquipmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        equipment={selectedEquipment}
      />

      <EquipmentDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        equipment={selectedEquipment}
      />
    </Box>
  );
};

export default EquipmentList;
