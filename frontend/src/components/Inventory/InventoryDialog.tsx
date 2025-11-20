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
import { inventoryService } from '../../services/inventoryService';
import {
  Inventory,
  CreateInventoryDto,
  UpdateInventoryDto,
} from '../../types';

const INVENTORY_CATEGORIES = [
  'Cleaning Supplies',
  'Kitchen Inventory',
  'Kitchen Supplies',
  'Food & Beverage',
  'Dry Goods',
  'Fresh Produce',
  'Dairy & Refrigerated',
  'Beverages',
  'Bar Supplies',
  'Linens & Bedding',
  'Toiletries & Amenities',
  'Maintenance Tools',
  'Office Supplies',
  'Safety Inventory',
  'Other'
];

interface InventoryDialogProps {
  open: boolean;
  onClose: () => void;
  inventory?: Inventory | null;
}

const InventoryDialog: React.FC<InventoryDialogProps> = ({ open, onClose, inventory }) => {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(inventory);

  const [formData, setFormData] = useState<CreateInventoryDto | UpdateInventoryDto>({
    name: '',
    description: '',
    location: '',
    category: '',
    minimumStock: 0,
    unitCost: 0,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateInventoryDto) => inventoryService.createInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryDto }) =>
      inventoryService.updateInventory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      handleClose();
    },
  });

  useEffect(() => {
    if (inventory) {
      setFormData({
        name: inventory.name,
        description: inventory.description,
        location: inventory.location,
        category: inventory.category,
        minimumStock: inventory.minimumStock,
        unitCost: inventory.unitCost,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        location: '',
        category: '',
        minimumStock: 0,
        unitCost: 0,
      });
    }
  }, [inventory, open]);

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      category: '',
      minimumStock: 0,
      unitCost: 0,
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && inventory) {
      updateMutation.mutate({ id: inventory.id, data: formData as UpdateInventoryDto });
    } else {
      createMutation.mutate(formData as CreateInventoryDto);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditMode ? 'Edit Inventory Item' : 'Add Inventory Item'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  required
                  fullWidth
                  label="Item Name"
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

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category || ''}
                  label="Category"
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  {INVENTORY_CATEGORIES.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                required
                fullWidth
                label="Location"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Basement, Kitchen, Lobby"
              />

              <TextField
                fullWidth
                type="number"
                label="Minimum Stock"
                value={formData.minimumStock || ''}
                onChange={(e) => handleChange('minimumStock', e.target.value ? Number(e.target.value) : undefined)}
                inputProps={{ min: 0 }}
                placeholder="Reorder threshold"
              />

              <TextField
                fullWidth
                type="number"
                label="Unit Cost"
                value={formData.unitCost || ''}
                onChange={(e) => handleChange('unitCost', e.target.value ? Number(e.target.value) : undefined)}
                inputProps={{ min: 0, step: 0.01 }}
                placeholder="Cost per unit"
              />

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

export default InventoryDialog;
