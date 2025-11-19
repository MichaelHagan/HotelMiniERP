import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  Build as BuildIcon,
  Category as CategoryIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
  Verified as WarrantyIcon,
  Info as InfoIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  LocalShipping as SupplierIcon,
} from '@mui/icons-material';
import { Inventory } from '../../types';
import { formatDateTime } from '../../utils/dateUtils';

interface InventoryDetailDialogProps {
  open: boolean;
  onClose: () => void;
  inventory: Inventory | null;
}

interface DetailRowProps {
  icon: React.ReactElement;
  label: string;
  value: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
    <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>{icon}</Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" color="textSecondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const InventoryDetailDialog: React.FC<InventoryDetailDialogProps> = ({ open, onClose, inventory }) => {
  if (!inventory) return null;

  const isLowStock = inventory.minimumStock && inventory.quantity <= inventory.minimumStock;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{inventory.name}</Typography>
          {isLowStock && (
            <Chip
              label="Low Stock"
              color="error"
              size="small"
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {/* Basic Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <DetailRow
                icon={<InfoIcon fontSize="small" />}
                label="Model"
                value={inventory.model}
              />

              <DetailRow
                icon={<BuildIcon fontSize="small" />}
                label="Manufacturer"
                value={inventory.manufacturer}
              />

              <DetailRow
                icon={<InfoIcon fontSize="small" />}
                label="Serial Number"
                value={
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {inventory.serialNumber}
                  </Typography>
                }
              />

              <DetailRow
                icon={<CategoryIcon fontSize="small" />}
                label="Category"
                value={inventory.category}
              />

              <DetailRow
                icon={<LocationIcon fontSize="small" />}
                label="Location"
                value={inventory.location}
              />

              <DetailRow
                icon={<SupplierIcon fontSize="small" />}
                label="Supplier"
                value={inventory.supplier || 'Not specified'}
              />
            </Box>

            {inventory.description && (
              <Box sx={{ mt: 2 }}>
                <DetailRow
                  icon={<InfoIcon fontSize="small" />}
                  label="Description"
                  value={inventory.description}
                />
              </Box>
            )}
          </Box>

          {/* Stock Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Stock Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <DetailRow
                icon={<InventoryIcon fontSize="small" />}
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

              <DetailRow
                icon={<InventoryIcon fontSize="small" />}
                label="Minimum Stock"
                value={inventory.minimumStock || 'Not set'}
              />

              <DetailRow
                icon={<MoneyIcon fontSize="small" />}
                label="Unit Cost"
                value={inventory.unitCost ? `$${inventory.unitCost.toFixed(2)}` : 'Not specified'}
              />

              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Last Restocked"
                value={inventory.lastRestockedDate ? formatDateTime(inventory.lastRestockedDate) : 'Not recorded'}
              />
            </Box>
          </Box>

          {/* Dates & Warranty */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Dates & Warranty
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Purchase Date"
                value={formatDateTime(inventory.purchaseDate)}
              />

              <DetailRow
                icon={<WarrantyIcon fontSize="small" />}
                label="Warranty Expiry"
                value={inventory.warrantyExpiryDate ? formatDateTime(inventory.warrantyExpiryDate) : 'Not specified'}
              />
            </Box>
          </Box>

          {/* Specifications */}
          {inventory.specifications && Object.keys(inventory.specifications).length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Technical Specifications
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {Object.entries(inventory.specifications).map(([key, value]) => (
                  <DetailRow
                    key={key}
                    icon={<InfoIcon fontSize="small" />}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    value={String(value)}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Metadata */}
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Created"
                value={formatDateTime(inventory.createdDate)}
              />

              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Last Modified"
                value={formatDateTime(inventory.lastModifiedDate)}
              />
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
