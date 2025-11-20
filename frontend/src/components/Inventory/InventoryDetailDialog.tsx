import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { Inventory } from '../../types';
import { formatDate, formatCurrency } from '../../utils';

interface InventoryDetailDialogProps {
  open: boolean;
  onClose: () => void;
  inventory: Inventory | null;
}

const InventoryDetailDialog: React.FC<InventoryDetailDialogProps> = ({
  open,
  onClose,
  inventory,
}) => {
  if (!inventory) return null;

  const isLowStock = inventory.minimumStock && inventory.quantity <= inventory.minimumStock;

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
      <Typography variant="body2" color="textSecondary" sx={{ minWidth: 120 }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{inventory.name}</Typography>
          {isLowStock && (
            <Chip label="Low Stock" color="error" size="small" />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <DetailRow label="Code" value={inventory.code} />
              <DetailRow label="Category" value={inventory.category} />
              <DetailRow label="Location" value={inventory.location} />
              <DetailRow label="Vendor" value={inventory.vendorName || 'Not specified'} />
              <DetailRow label="Brand" value={inventory.brand || 'Not specified'} />

              {inventory.description && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {inventory.description}
                  </Typography>
                </>
              )}
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Stock Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <DetailRow 
                label="Quantity" 
                value={
                  <Typography 
                    variant="body2" 
                    color={isLowStock ? 'error' : 'inherit'}
                    fontWeight={isLowStock ? 'bold' : 'normal'}
                  >
                    {inventory.quantity}
                  </Typography>
                } 
              />
              <DetailRow label="Minimum Stock" value={inventory.minimumStock || 'Not set'} />
              <DetailRow label="Unit Cost" value={inventory.unitCost ? formatCurrency(inventory.unitCost) : 'Not specified'} />
              <DetailRow label="Last Restocked" value={inventory.lastRestockedDate ? formatDate(inventory.lastRestockedDate) : 'Not recorded'} />

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                System Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <DetailRow label="Created" value={formatDate(inventory.createdAt)} />
              <DetailRow label="Last Modified" value={formatDate(inventory.updatedAt)} />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryDetailDialog;
