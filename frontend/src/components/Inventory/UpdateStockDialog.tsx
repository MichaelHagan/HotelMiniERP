import React, { useState } from 'react';
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
  Alert,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { stockTransactionService } from '../../services/stockTransactionService';
import { vendorService } from '../../services/vendorService';
import {
  Inventory,
  CreateStockTransactionDto,
  StockTransactionType,
  StockReductionReason,
} from '../../types';

interface UpdateStockDialogProps {
  open: boolean;
  onClose: () => void;
  inventory: Inventory;
}

const UpdateStockDialog: React.FC<UpdateStockDialogProps> = ({ open, onClose, inventory }) => {
  const queryClient = useQueryClient();

  // Fetch vendors for dropdown
  const { data: vendorsData } = useQuery({
    queryKey: ['vendors', { isActive: true }],
    queryFn: () => vendorService.getVendors(true),
  });

  const [formData, setFormData] = useState<CreateStockTransactionDto>({
    inventoryId: parseInt(inventory.id),
    transactionType: StockTransactionType.Restock,
    quantity: 0,
    vendorId: undefined,
    transactionDate: new Date().toISOString().slice(0, 10),
    reductionReason: undefined,
    notes: '',
    unitCost: undefined,
  });

  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateStockTransactionDto) => stockTransactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      handleClose();
    },
  });

  const handleClose = () => {
    setFormData({
      inventoryId: parseInt(inventory.id),
      transactionType: StockTransactionType.Restock,
      quantity: 0,
      vendorId: undefined,
      transactionDate: new Date().toISOString().slice(0, 10),
      reductionReason: undefined,
      notes: '',
      unitCost: undefined,
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const preparedData = {
      ...formData,
      transactionDate: new Date(formData.transactionDate).toISOString(),
    };
    
    createTransactionMutation.mutate(preparedData);
  };

  const handleChange = (field: keyof CreateStockTransactionDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isRestock = formData.transactionType === StockTransactionType.Restock;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Stock - {inventory.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Current Stock: <strong>{inventory.quantity}</strong> units
              {inventory.minimumStock && inventory.quantity < inventory.minimumStock && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Below minimum stock level ({inventory.minimumStock})
                </Typography>
              )}
            </Alert>

            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend">Transaction Type</FormLabel>
              <RadioGroup
                row
                value={formData.transactionType}
                onChange={(e) => {
                  const type = e.target.value as StockTransactionType;
                  handleChange('transactionType', type);
                  // Reset vendor and reason when switching types
                  if (type === StockTransactionType.Reduction) {
                    handleChange('vendorId', undefined);
                  } else {
                    handleChange('reductionReason', undefined);
                  }
                }}
              >
                <FormControlLabel 
                  value={StockTransactionType.Restock} 
                  control={<Radio />} 
                  label="Restock (Add)" 
                />
                <FormControlLabel 
                  value={StockTransactionType.Reduction} 
                  control={<Radio />} 
                  label="Reduction (Remove)" 
                />
              </RadioGroup>
            </FormControl>

            <TextField
              required
              fullWidth
              type="number"
              label={isRestock ? "Quantity to Add" : "Quantity to Remove"}
              value={formData.quantity || ''}
              onChange={(e) => handleChange('quantity', e.target.value ? parseInt(e.target.value) : 0)}
              inputProps={{ min: 1 }}
              sx={{ mb: 2 }}
            />

            <TextField
              required
              fullWidth
              type="date"
              label="Transaction Date"
              value={formData.transactionDate}
              onChange={(e) => handleChange('transactionDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            {isRestock ? (
              <>
                <Autocomplete
                  fullWidth
                  options={vendorsData || []}
                  getOptionLabel={(option) => option.name}
                  value={vendorsData?.find((v) => parseInt(v.id) === formData.vendorId) || null}
                  onChange={(_, newValue) => {
                    handleChange('vendorId', newValue ? parseInt(newValue.id) : undefined);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vendor"
                      placeholder="Select a vendor"
                      required
                    />
                  )}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Unit Cost"
                  value={formData.unitCost || ''}
                  onChange={(e) => handleChange('unitCost', e.target.value ? parseFloat(e.target.value) : undefined)}
                  inputProps={{ min: 0, step: 0.01 }}
                  placeholder="Cost per unit"
                  sx={{ mb: 2 }}
                />
              </>
            ) : (
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Reduction Reason</InputLabel>
                <Select
                  value={formData.reductionReason || ''}
                  label="Reduction Reason"
                  onChange={(e) => handleChange('reductionReason', e.target.value as StockReductionReason)}
                >
                  <MenuItem value={StockReductionReason.Spoilage}>Spoilage</MenuItem>
                  <MenuItem value={StockReductionReason.Used}>Used</MenuItem>
                  <MenuItem value={StockReductionReason.Damaged}>Damaged</MenuItem>
                  <MenuItem value={StockReductionReason.Lost}>Lost</MenuItem>
                  <MenuItem value={StockReductionReason.Expired}>Expired</MenuItem>
                  <MenuItem value={StockReductionReason.Other}>Other</MenuItem>
                </Select>
              </FormControl>
            )}

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional information about this transaction"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createTransactionMutation.isPending}
            color={isRestock ? "primary" : "warning"}
          >
            {createTransactionMutation.isPending ? (
              <CircularProgress size={24} />
            ) : isRestock ? (
              'Add Stock'
            ) : (
              'Remove Stock'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateStockDialog;
