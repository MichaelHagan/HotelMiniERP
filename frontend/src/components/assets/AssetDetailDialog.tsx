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
import { Asset } from '../../types';
import { formatDate, formatCurrency, getStatusColor, getStatusText, formatTimeAgo } from '../../utils';

interface AssetDetailDialogProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export const AssetDetailDialog: React.FC<AssetDetailDialogProps> = ({
  open,
  onClose,
  asset,
}) => {
  if (!asset) return null;

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
          <Typography variant="h6">{asset.name}</Typography>
          <Chip
            label={getStatusText(asset.status)}
            color={getStatusColor(asset.status)}
            size="small"
          />
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
              
              <DetailRow label="Asset Tag" value={asset.assetTag} />
              <DetailRow label="Category" value={asset.category} />
              <DetailRow label="Location" value={asset.location} />
              <DetailRow label="Status" value={
                <Chip
                  label={getStatusText(asset.status)}
                  color={getStatusColor(asset.status)}
                  size="small"
                />
              } />
              <DetailRow 
                label="Assigned To" 
                value={asset.assignedUser ? 
                  `${asset.assignedUser.firstName} ${asset.assignedUser.lastName}` : 
                  'Unassigned'
                } 
              />

              {asset.description && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {asset.description}
                  </Typography>
                </>
              )}
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Financial Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <DetailRow label="Purchase Price" value={formatCurrency(asset.purchasePrice)} />
              <DetailRow label="Current Value" value={formatCurrency(asset.currentValue)} />
              <DetailRow label="Depreciation Rate" value={`${asset.depreciationRate}%`} />
              <DetailRow label="Vendor" value={asset.vendor} />

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Dates & Maintenance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <DetailRow label="Purchase Date" value={formatDate(asset.purchaseDate)} />
              {asset.warrantyExpiryDate && (
                <DetailRow label="Warranty Expires" value={formatDate(asset.warrantyExpiryDate)} />
              )}
              {asset.lastMaintenanceDate && (
                <DetailRow label="Last Maintenance" value={formatTimeAgo(asset.lastMaintenanceDate)} />
              )}
              {asset.nextMaintenanceDate && (
                <DetailRow label="Next Maintenance" value={formatDate(asset.nextMaintenanceDate)} />
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                System Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <DetailRow label="Created" value={formatTimeAgo(asset.createdAt)} />
              <DetailRow label="Last Modified" value={formatTimeAgo(asset.updatedAt)} />
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