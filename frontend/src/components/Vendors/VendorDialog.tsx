import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';
import { Vendor, CreateVendorDto, UpdateVendorDto } from '../../types';

interface VendorDialogProps {
  open: boolean;
  vendor?: Vendor;
  onClose: () => void;
  onSubmit: (vendor: CreateVendorDto | UpdateVendorDto) => void;
}

export const VendorDialog: React.FC<VendorDialogProps> = ({
  open,
  vendor,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateVendorDto & { isActive?: boolean }>({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    contactPerson: '',
    services: '',
    notes: '',
    isActive: true,
  });

  const isEditMode = !!vendor;

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        phoneNumber: vendor.phoneNumber,
        email: vendor.email || '',
        address: vendor.address || '',
        contactPerson: vendor.contactPerson || '',
        services: vendor.services || '',
        notes: vendor.notes || '',
        isActive: vendor.isActive,
      });
    } else {
      setFormData({
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        contactPerson: '',
        services: '',
        notes: '',
        isActive: true,
      });
    }
  }, [vendor, open]);

  const handleClose = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      email: '',
      address: '',
      contactPerson: '',
      services: '',
      notes: '',
      isActive: true,
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as any);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditMode ? 'Edit Vendor' : 'Create New Vendor'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Vendor Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                required
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <TextField
                fullWidth
                label="Contact Person"
                value={formData.contactPerson}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
              />
            </Box>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Services / Specialization"
              value={formData.services}
              onChange={(e) => handleChange('services', e.target.value)}
              placeholder="e.g., HVAC Services, Electrical Repairs, Plumbing"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              multiline
              rows={3}
            />
            {isEditMode && (
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                  />
                }
                label="Active"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
