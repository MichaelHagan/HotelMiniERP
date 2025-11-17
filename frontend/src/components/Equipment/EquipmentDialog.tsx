import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService } from '../../services/equipmentService';
import {
  Equipment,
  CreateEquipmentDto,
  UpdateEquipmentDto,
  EquipmentStatus,
} from '../../types';

interface EquipmentDialogProps {
  open: boolean;
  onClose: () => void;
  equipment: Equipment | null;
}

const EquipmentDialog: React.FC<EquipmentDialogProps> = ({ open, onClose, equipment }) => {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(equipment);

  const [formData, setFormData] = useState<CreateEquipmentDto | UpdateEquipmentDto>({
    name: '',
    description: '',
    model: '',
    manufacturer: '',
    serialNumber: '',
    location: '',
    category: '',
    purchaseDate: '',
    warrantyExpiryDate: '',
    specifications: {},
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateEquipmentDto) => equipmentService.createEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEquipmentDto }) =>
      equipmentService.updateEquipment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      handleClose();
    },
  });

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        description: equipment.description,
        model: equipment.model,
        manufacturer: equipment.manufacturer,
        serialNumber: equipment.serialNumber,
        location: equipment.location,
        category: equipment.category,
        status: equipment.status,
        operatingHours: equipment.operatingHours,
        lastMaintenanceDate: equipment.lastMaintenanceDate
          ? new Date(equipment.lastMaintenanceDate).toISOString().slice(0, 10)
          : undefined,
        nextMaintenanceDate: equipment.nextMaintenanceDate
          ? new Date(equipment.nextMaintenanceDate).toISOString().slice(0, 10)
          : undefined,
        specifications: equipment.specifications,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        model: '',
        manufacturer: '',
        serialNumber: '',
        location: '',
        category: '',
        purchaseDate: '',
        warrantyExpiryDate: '',
        specifications: {},
      });
    }
  }, [equipment, open]);

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      model: '',
      manufacturer: '',
      serialNumber: '',
      location: '',
      category: '',
      purchaseDate: '',
      warrantyExpiryDate: '',
      specifications: {},
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && equipment) {
      updateMutation.mutate({ id: equipment.id, data: formData as UpdateEquipmentDto });
    } else {
      createMutation.mutate(formData as CreateEquipmentDto);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditMode ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  required
                  fullWidth
                  label="Equipment Name"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </Box>

              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </Box>

              <TextField
                required
                fullWidth
                label="Model"
                value={(formData as CreateEquipmentDto).model || (formData as UpdateEquipmentDto).name || ''}
                onChange={(e) => handleChange('model', e.target.value)}
                disabled={isEditMode}
              />

              <TextField
                required
                fullWidth
                label="Manufacturer"
                value={(formData as CreateEquipmentDto).manufacturer || ''}
                onChange={(e) => handleChange('manufacturer', e.target.value)}
                disabled={isEditMode}
              />

              <TextField
                required
                fullWidth
                label="Serial Number"
                value={(formData as CreateEquipmentDto).serialNumber || ''}
                onChange={(e) => handleChange('serialNumber', e.target.value)}
                disabled={isEditMode}
              />

              <TextField
                required
                fullWidth
                label="Category"
                value={formData.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="e.g., HVAC, Kitchen, Cleaning"
              />

              <TextField
                required
                fullWidth
                label="Location"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Basement, Kitchen, Lobby"
              />

              {isEditMode && (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={(formData as UpdateEquipmentDto).status || EquipmentStatus.Operational}
                    label="Status"
                    onChange={(e) => handleChange('status', e.target.value as EquipmentStatus)}
                  >
                    <MenuItem value={EquipmentStatus.Operational}>Operational</MenuItem>
                    <MenuItem value={EquipmentStatus.Maintenance}>Maintenance</MenuItem>
                    <MenuItem value={EquipmentStatus.OutOfService}>Out of Service</MenuItem>
                    <MenuItem value={EquipmentStatus.Retired}>Retired</MenuItem>
                  </Select>
                </FormControl>
              )}

              {!isEditMode && (
                <TextField
                  fullWidth
                  type="date"
                  label="Purchase Date"
                  value={(formData as CreateEquipmentDto).purchaseDate || ''}
                  onChange={(e) => handleChange('purchaseDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              )}

              {!isEditMode && (
                <TextField
                  fullWidth
                  type="date"
                  label="Warranty Expiry Date"
                  value={(formData as CreateEquipmentDto).warrantyExpiryDate || ''}
                  onChange={(e) => handleChange('warrantyExpiryDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              )}

              {isEditMode && (
                <TextField
                  fullWidth
                  type="number"
                  label="Operating Hours"
                  value={(formData as UpdateEquipmentDto).operatingHours || ''}
                  onChange={(e) =>
                    handleChange('operatingHours', e.target.value ? Number(e.target.value) : undefined)
                  }
                  inputProps={{ min: 0 }}
                />
              )}

              {isEditMode && (
                <TextField
                  fullWidth
                  type="date"
                  label="Last Maintenance Date"
                  value={(formData as UpdateEquipmentDto).lastMaintenanceDate || ''}
                  onChange={(e) => handleChange('lastMaintenanceDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              )}

              {isEditMode && (
                <TextField
                  fullWidth
                  type="date"
                  label="Next Maintenance Date"
                  value={(formData as UpdateEquipmentDto).nextMaintenanceDate || ''}
                  onChange={(e) => handleChange('nextMaintenanceDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <CircularProgress size={24} />
            ) : isEditMode ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EquipmentDialog;
