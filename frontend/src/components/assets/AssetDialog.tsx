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
    name: '',
    description: '',
    assetTag: '',
    category: '',
    location: '',
    purchaseDate: new Date(),
    purchasePrice: '',
    currentValue: '',
    depreciationRate: '',
    vendor: '',
    warrantyExpiryDate: null as Date | null,
    assignedUserId: '',
  });

  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (asset && mode === 'edit') {
      setFormData({
        name: asset.name,
        description: asset.description || '',
        assetTag: asset.assetTag,
        category: asset.category,
        location: asset.location,
        purchaseDate: new Date(asset.purchaseDate),
        purchasePrice: asset.purchasePrice.toString(),
        currentValue: asset.currentValue.toString(),
        depreciationRate: asset.depreciationRate.toString(),
        vendor: asset.vendor,
        warrantyExpiryDate: asset.warrantyExpiryDate ? new Date(asset.warrantyExpiryDate) : null,
        assignedUserId: asset.assignedUserId || '',
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        assetTag: '',
        category: '',
        location: '',
        purchaseDate: new Date(),
        purchasePrice: '',
        currentValue: '',
        depreciationRate: '0',
        vendor: '',
        warrantyExpiryDate: null,
        assignedUserId: '',
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
    const requiredError = validateRequired(formData.name, 'Name');
    if (requiredError) newErrors.name = requiredError;

    const assetTagError = validateRequired(formData.assetTag, 'Asset Tag');
    if (assetTagError) newErrors.assetTag = assetTagError;

    const categoryError = validateRequired(formData.category, 'Category');
    if (categoryError) newErrors.category = categoryError;

    const locationError = validateRequired(formData.location, 'Location');
    if (locationError) newErrors.location = locationError;

    const vendorError = validateRequired(formData.vendor, 'Vendor');
    if (vendorError) newErrors.vendor = vendorError;

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
          name: formData.name,
          description: formData.description || undefined,
          assetTag: formData.assetTag,
          category: formData.category,
          location: formData.location,
          purchaseDate: formData.purchaseDate.toISOString(),
          purchasePrice: parseFloat(formData.purchasePrice),
          currentValue: parseFloat(formData.currentValue),
          depreciationRate: parseFloat(formData.depreciationRate),
          vendor: formData.vendor,
          warrantyExpiryDate: formData.warrantyExpiryDate?.toISOString(),
          assignedUserId: formData.assignedUserId || undefined,
        };
        await assetService.createAsset(createDto);
      } else if (asset) {
        const updateDto: UpdateAssetDto = {
          name: formData.name,
          description: formData.description || undefined,
          category: formData.category,
          location: formData.location,
          currentValue: parseFloat(formData.currentValue),
          assignedUserId: formData.assignedUserId || undefined,
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
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
              
              <TextField
                fullWidth
                label="Asset Tag"
                value={formData.assetTag}
                onChange={(e) => handleInputChange('assetTag', e.target.value)}
                error={!!errors.assetTag}
                helperText={errors.assetTag}
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
                label="Vendor"
                value={formData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                error={!!errors.vendor}
                helperText={errors.vendor}
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
                value={formData.warrantyExpiryDate}
                onChange={(date) => handleInputChange('warrantyExpiryDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Assigned User</InputLabel>
                <Select
                  value={formData.assignedUserId}
                  label="Assigned User"
                  onChange={(e) => handleInputChange('assignedUserId', e.target.value)}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.department})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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