import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Asset, CreateAssetDto, UpdateAssetDto, User } from '../../types';
import { assetService, userService } from '../../services';
import { validateRequired, validateNumber } from '../../utils';

interface AssetDialogProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export const AssetDialog: React.FC<AssetDialogProps> = ({
  open,
  onClose,
  asset,
  mode,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    assetName: '',
    description: '',
    assetCode: '',
    category: '',
    location: '',
    purchaseDate: new Date(),
    purchasePrice: '',
    currentValue: '',
    depreciationRate: '',
    supplier: '',
    warrantyExpiry: null as Date | null,
    serialNumber: '',
    model: '',
    brand: '',
    notes: '',
    status: 'Active' as 'Active' | 'InMaintenance' | 'Retired' | 'Disposed',
  });

  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (asset && mode === 'edit') {
      setFormData({
        assetName: asset.assetName,
        description: asset.description || '',
        assetCode: asset.assetCode,
        category: asset.category,
        location: asset.location,
        purchaseDate: new Date(asset.purchaseDate),
        purchasePrice: asset.purchasePrice.toString(),
        currentValue: (asset.currentValue || 0).toString(),
        depreciationRate: (asset.depreciationRate || 0).toString(),
        supplier: asset.supplier,
        warrantyExpiry: asset.warrantyExpiry ? new Date(asset.warrantyExpiry) : null,
        serialNumber: asset.serialNumber || '',
        model: asset.model || '',
        brand: asset.brand || '',
        notes: asset.notes || '',
        status: asset.status,
      });
    } else {
      // Reset form for create mode
      setFormData({
        assetName: '',
        description: '',
        assetCode: '',
        category: '',
        location: '',
        purchaseDate: new Date(),
        purchasePrice: '',
        currentValue: '',
        depreciationRate: '0',
        supplier: '',
        warrantyExpiry: null,
        serialNumber: '',
        model: '',
        brand: '',
        notes: '',
        status: 'Active',
      });
    }
    setErrors({});
  }, [asset, mode, open]);

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      const usersData = await userService.getActiveUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    const requiredError = validateRequired(formData.assetName, 'Asset Name');
    if (requiredError) newErrors.assetName = requiredError;

    const assetCodeError = validateRequired(formData.assetCode, 'Asset Code');
    if (assetCodeError) newErrors.assetCode = assetCodeError;

    const categoryError = validateRequired(formData.category, 'Category');
    if (categoryError) newErrors.category = categoryError;

    const locationError = validateRequired(formData.location, 'Location');
    if (locationError) newErrors.location = locationError;

    const supplierError = validateRequired(formData.supplier, 'Supplier');
    if (supplierError) newErrors.supplier = supplierError;

    // Number validation
    const purchasePriceError = validateNumber(formData.purchasePrice, 'Purchase Price', 0);
    if (purchasePriceError) newErrors.purchasePrice = purchasePriceError;

    const currentValueError = validateNumber(formData.currentValue, 'Current Value', 0);
    if (currentValueError) newErrors.currentValue = currentValueError;

    const depreciationRateError = validateNumber(formData.depreciationRate, 'Depreciation Rate', 0, 100);
    if (depreciationRateError) newErrors.depreciationRate = depreciationRateError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'create') {
        const createDto: CreateAssetDto = {
          assetName: formData.assetName,
          assetCode: formData.assetCode,
          description: formData.description || undefined,
          category: formData.category,
          location: formData.location,
          purchaseDate: formData.purchaseDate.toISOString(),
          purchasePrice: parseFloat(formData.purchasePrice),
          supplier: formData.supplier,
          status: formData.status as any,
          warrantyExpiry: formData.warrantyExpiry?.toISOString(),
          serialNumber: formData.serialNumber || undefined,
          model: formData.model || undefined,
          brand: formData.brand || undefined,
          depreciationRate: formData.depreciationRate ? parseFloat(formData.depreciationRate) : undefined,
          notes: formData.notes || undefined,
        };
        await assetService.createAsset(createDto);
      } else if (asset) {
        const updateDto: UpdateAssetDto = {
          id: parseInt(asset.id),
          assetName: formData.assetName,
          assetCode: formData.assetCode,
          description: formData.description || undefined,
          category: formData.category,
          location: formData.location,
          purchaseDate: formData.purchaseDate.toISOString(),
          purchasePrice: parseFloat(formData.purchasePrice),
          supplier: formData.supplier,
          status: formData.status as any,
          warrantyExpiry: formData.warrantyExpiry?.toISOString(),
          serialNumber: formData.serialNumber || undefined,
          model: formData.model || undefined,
          brand: formData.brand || undefined,
          depreciationRate: formData.depreciationRate ? parseFloat(formData.depreciationRate) : undefined,
          currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
          notes: formData.notes || undefined,
        };
        await assetService.updateAsset(asset.id, updateDto);
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save asset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {mode === 'create' ? 'Create New Asset' : 'Edit Asset'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
              gap: 3 
            }}>
              <TextField
                fullWidth
                label="Asset Name"
                value={formData.assetName}
                onChange={(e) => handleInputChange('assetName', e.target.value)}
                error={!!errors.assetName}
                helperText={errors.assetName}
                required
              />
              
              <TextField
                fullWidth
                label="Asset Code"
                value={formData.assetCode}
                onChange={(e) => handleInputChange('assetCode', e.target.value)}
                error={!!errors.assetCode}
                helperText={errors.assetCode}
                required
              />

              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Box>

              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                error={!!errors.category}
                helperText={errors.category}
                required
              />

              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
                required
              />

              <DatePicker
                label="Purchase Date"
                value={formData.purchaseDate}
                onChange={(date) => handleInputChange('purchaseDate', date || new Date())}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                error={!!errors.supplier}
                helperText={errors.supplier}
                required
              />

              <Box sx={{ 
                gridColumn: { xs: '1', sm: '1 / -1' },
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, 
                gap: 3 
              }}>
                <TextField
                  fullWidth
                  label="Purchase Price"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  error={!!errors.purchasePrice}
                  helperText={errors.purchasePrice}
                  required
                />

                <TextField
                  fullWidth
                  label="Current Value"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  value={formData.currentValue}
                  onChange={(e) => handleInputChange('currentValue', e.target.value)}
                  error={!!errors.currentValue}
                  helperText={errors.currentValue}
                  required
                />

                <TextField
                  fullWidth
                  label="Depreciation Rate (%)"
                  type="number"
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                  value={formData.depreciationRate}
                  onChange={(e) => handleInputChange('depreciationRate', e.target.value)}
                  error={!!errors.depreciationRate}
                  helperText={errors.depreciationRate}
                />
              </Box>

              <DatePicker
                label="Warranty Expiry Date"
                value={formData.warrantyExpiry}
                onChange={(date) => handleInputChange('warrantyExpiry', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="InMaintenance">In Maintenance</MenuItem>
                  <MenuItem value="Retired">Retired</MenuItem>
                  <MenuItem value="Disposed">Disposed</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Serial Number"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
              />

              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              />

              <TextField
                fullWidth
                label="Brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
              />

              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create Asset' : 'Update Asset'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};