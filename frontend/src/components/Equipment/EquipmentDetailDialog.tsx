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
  Timer as TimerIcon,
  Verified as WarrantyIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Equipment, EquipmentStatus } from '../../types';
import { formatDateTime } from '../../utils/dateUtils';

interface EquipmentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  equipment: Equipment | null;
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

const EquipmentDetailDialog: React.FC<EquipmentDetailDialogProps> = ({ open, onClose, equipment }) => {
  if (!equipment) return null;

  const getStatusColor = (status: EquipmentStatus): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case EquipmentStatus.Operational:
        return 'success';
      case EquipmentStatus.Maintenance:
        return 'warning';
      case EquipmentStatus.OutOfService:
        return 'error';
      case EquipmentStatus.Retired:
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{equipment.name}</Typography>
          <Chip
            label={equipment.status}
            color={getStatusColor(equipment.status)}
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
                label="Model"
                value={equipment.model}
              />

              <DetailRow
                icon={<BuildIcon fontSize="small" />}
                label="Manufacturer"
                value={equipment.manufacturer}
              />

              <DetailRow
                icon={<InfoIcon fontSize="small" />}
                label="Serial Number"
                value={
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {equipment.serialNumber}
                  </Typography>
                }
              />

              <DetailRow
                icon={<CategoryIcon fontSize="small" />}
                label="Category"
                value={equipment.category}
              />

              <DetailRow
                icon={<LocationIcon fontSize="small" />}
                label="Location"
                value={equipment.location}
              />

              <DetailRow
                icon={<TimerIcon fontSize="small" />}
                label="Operating Hours"
                value={`${equipment.operatingHours?.toLocaleString()} hours`}
              />
            </Box>

            {equipment.description && (
              <Box sx={{ mt: 2 }}>
                <DetailRow
                  icon={<InfoIcon fontSize="small" />}
                  label="Description"
                  value={equipment.description}
                />
              </Box>
            )}
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
                value={formatDateTime(equipment.purchaseDate)}
              />

              <DetailRow
                icon={<WarrantyIcon fontSize="small" />}
                label="Warranty Expiry"
                value={equipment.warrantyExpiryDate ? formatDateTime(equipment.warrantyExpiryDate) : 'Not specified'}
              />
            </Box>
          </Box>

          {/* Maintenance Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Maintenance Schedule
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Last Maintenance"
                value={equipment.lastMaintenanceDate ? formatDateTime(equipment.lastMaintenanceDate) : 'No maintenance recorded'}
              />

              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Next Maintenance"
                value={equipment.nextMaintenanceDate ? formatDateTime(equipment.nextMaintenanceDate) : 'Not scheduled'}
              />
            </Box>
          </Box>

          {/* Specifications */}
          {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Technical Specifications
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {Object.entries(equipment.specifications).map(([key, value]) => (
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
                value={formatDateTime(equipment.createdDate)}
              />

              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Last Modified"
                value={formatDateTime(equipment.lastModifiedDate)}
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

export default EquipmentDetailDialog;
