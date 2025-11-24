import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Phone, Email, Person } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorService } from '../../services/vendorService';
import { Vendor, CreateVendorDto, UpdateVendorDto } from '../../types';
import { VendorDialog } from './VendorDialog';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmDialogContext';

export const VendorList: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors', statusFilter],
    queryFn: () => vendorService.getVendors(statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined),
  });

  const createMutation = useMutation({
    mutationFn: (vendor: CreateVendorDto) => vendorService.createVendor(vendor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      setDialogOpen(false);
      showSuccess('Vendor created successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create vendor';
      showError(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVendorDto }) =>
      vendorService.updateVendor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      setDialogOpen(false);
      setSelectedVendor(undefined);
      showSuccess('Vendor updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update vendor';
      showError(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vendorService.deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      showSuccess('Vendor deactivated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to deactivate vendor';
      showError(errorMessage);
    },
  });

  const handleCreate = () => {
    setSelectedVendor(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm(
      'Are you sure you want to deactivate this vendor? They will no longer appear in active listings.',
      'Deactivate Vendor'
    );
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (vendor: CreateVendorDto | UpdateVendorDto) => {
    if (selectedVendor) {
      updateMutation.mutate({ id: selectedVendor.id, data: vendor as UpdateVendorDto });
    } else {
      createMutation.mutate(vendor as CreateVendorDto);
    }
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.phoneNumber.includes(searchTerm) ||
    (vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <Typography>Loading vendors...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Vendor Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Add Vendor
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, phone, or email"
          sx={{ flex: { xs: 1, md: 2 } }}
        />
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No vendors found
                </TableCell>
              </TableRow>
            ) : (
              filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {vendor.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Phone fontSize="small" color="action" />
                      {vendor.phoneNumber}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {vendor.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Email fontSize="small" color="action" />
                        {vendor.email}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {vendor.contactPerson && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Person fontSize="small" color="action" />
                        {vendor.contactPerson}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {vendor.services && (
                      <Typography variant="body2" color="text.secondary">
                        {vendor.services}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vendor.isActive ? 'Active' : 'Inactive'}
                      color={vendor.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(vendor)} size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    {vendor.isActive && (
                      <Tooltip title="Deactivate">
                        <IconButton
                          onClick={() => handleDelete(vendor.id)}
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <VendorDialog
        open={dialogOpen}
        vendor={selectedVendor}
        onClose={() => {
          setDialogOpen(false);
          setSelectedVendor(undefined);
        }}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};
