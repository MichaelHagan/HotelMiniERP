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
  Autocomplete,
} from '@mui/material';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { inventoryService } from '../../services/inventoryService';
import { vendorService } from '../../services/vendorService';
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

  // Fetch vendors for dropdown
  const { data: vendorsData } = useQuery({
    queryKey: ['vendors', { isActive: true }],
    queryFn: () => vendorService.getVendors(true),
  });

  const [formData, setFormData] = useState<CreateInventoryDto | UpdateInventoryDto>({
    name: '',
    description: '',
    model: '',
    location: '',
    category: '',
    quantity: 0,
    minimumStock: 0,
    unitCost: 0,
    vendorId: undefined,
    lastRestockedDate: '',
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
        quantity: inventory.quantity,
        minimumStock: inventory.minimumStock,
        unitCost: inventory.unitCost,
        vendorId: inventory.vendorId,
        lastRestockedDate: inventory.lastRestockedDate
          ? new Date(inventory.lastRestockedDate).toISOString().slice(0, 10)
          : undefined,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        model: '',
        location: '',
        category: '',
        quantity: 0,
        minimumStock: 0,
        unitCost: 0,
        vendorId: undefined,
        lastRestockedDate: '',
      });
    }
  }, [inventory, open]);

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      model: '',
      location: '',
      category: '',
      quantity: 0,
      minimumStock: 0,
      unitCost: 0,
      vendorId: undefined,
      lastRestockedDate: '',
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert lastRestockedDate to ISO 8601 format if provided
    const preparedData = {
      ...formData,
      lastRestockedDate: formData.lastRestockedDate 
        ? new Date(formData.lastRestockedDate).toISOString() 
        : undefined
    };
    
    if (isEditMode && inventory) {
      updateMutation.mutate({ id: inventory.id, data: preparedData as UpdateInventoryDto });
    } else {
      createMutation.mutate(preparedData as CreateInventoryDto);
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

              <TextField
                required
                fullWidth
                label="Model"
                value={(formData as CreateInventoryDto).model || (formData as UpdateInventoryDto).name || ''}
                onChange={(e) => handleChange('model', e.target.value)}
                disabled={isEditMode}
              />

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

              <Autocomplete
                fullWidth
                options={vendorsData || []}
                getOptionLabel={(option) => option.name}
                value={vendorsData?.find((v) => v.id === formData.vendorId) || null}
                onChange={(_, newValue) => {
                  handleChange('vendorId', newValue?.id);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Vendor"
                    placeholder="Select a vendor"
                  />
                )}
              />

              <TextField
                required
                fullWidth
                type="number"
                label="Quantity"
                value={formData.quantity || ''}
                onChange={(e) => handleChange('quantity', e.target.value ? Number(e.target.value) : 0)}
                inputProps={{ min: 0 }}
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

              {isEditMode && (
                <TextField
                  fullWidth
                  type="date"
                  label="Last Restocked Date"
                  value={(formData as UpdateInventoryDto).lastRestockedDate || ''}
                  onChange={(e) => handleChange('lastRestockedDate', e.target.value)}
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

export default InventoryDialog;
