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
  AccountBalanceWallet as MoneyIcon,
  LocalShipping as SupplierIcon,
  TrendingDown as DepreciationIcon,
} from '@mui/icons-material';
import { Asset } from '../../types';
import { formatDate, formatCurrency, getStatusColor, getStatusText } from '../../utils';

interface AssetDetailDialogProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
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

export const AssetDetailDialog: React.FC<AssetDetailDialogProps> = ({
  open,
  onClose,
  asset,
}) => {
  if (!asset) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{asset.assetName}</Typography>
          <Chip
            label={getStatusText(asset.status)}
            color={getStatusColor(asset.status)}
            size="small"
          />
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
                label="Asset Code"
                value={asset.assetCode}
              />

              <DetailRow
                icon={<CategoryIcon fontSize="small" />}
                label="Category"
                value={asset.category}
              />

              <DetailRow
                icon={<LocationIcon fontSize="small" />}
                label="Location"
                value={asset.location}
              />

              <DetailRow
                icon={<BuildIcon fontSize="small" />}
                label="Model"
                value={asset.model || 'Not specified'}
              />

              <DetailRow
                icon={<InfoIcon fontSize="small" />}
                label="Serial Number"
                value={
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {asset.serialNumber || 'Not specified'}
                  </Typography>
                }
              />

              <DetailRow
                icon={<InfoIcon fontSize="small" />}
                label="Brand"
                value={asset.brand || 'Not specified'}
              />

              <DetailRow
                icon={<SupplierIcon fontSize="small" />}
                label="Supplier"
                value={asset.supplier || 'Not specified'}
              />
            </Box>

            {asset.description && (
              <Box sx={{ mt: 2 }}>
                <DetailRow
                  icon={<InfoIcon fontSize="small" />}
                  label="Description"
                  value={asset.description}
                />
              </Box>
            )}

            {asset.notes && (
              <Box sx={{ mt: 2 }}>
                <DetailRow
                  icon={<InfoIcon fontSize="small" />}
                  label="Notes"
                  value={asset.notes}
                />
              </Box>
            )}
          </Box>

          {/* Financial Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Financial Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <DetailRow
                icon={<MoneyIcon fontSize="small" />}
                label="Purchase Price"
                value={formatCurrency(asset.purchasePrice)}
              />

              <DetailRow
                icon={<MoneyIcon fontSize="small" />}
                label="Current Value"
                value={asset.currentValue ? formatCurrency(asset.currentValue) : 'Not calculated'}
              />

              <DetailRow
                icon={<DepreciationIcon fontSize="small" />}
                label="Depreciation Rate"
                value={`${asset.depreciationRate}%`}
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
                value={formatDate(asset.purchaseDate)}
              />

              {asset.warrantyExpiry && (
                <DetailRow
                  icon={<WarrantyIcon fontSize="small" />}
                  label="Warranty Expiry"
                  value={formatDate(asset.warrantyExpiry)}
                />
              )}
            </Box>
          </Box>

          {/* Metadata */}
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Created"
                value={formatDate(asset.createdAt)}
              />

              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Last Modified"
                value={formatDate(asset.updatedAt)}
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