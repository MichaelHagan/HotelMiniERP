import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
  Divider,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  AssignmentInd as AssignmentIndIcon,
  Business as AssetIcon,
  Store as VendorIcon,
  Timer as TimerIcon,
  Flag as PriorityIcon,
  Info as StatusIcon,
  PlayArrow as StartIcon,
  CheckCircle as CompleteIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkOrder, WorkOrderStatus, Priority } from '../../types';
import { formatDateTime } from '../../utils/dateUtils';
import { workOrderService } from '../../services/workOrderService';

interface WorkOrderDetailDialogProps {
  open: boolean;
  onClose: () => void;
  workOrder: WorkOrder | null;
}

const WorkOrderDetailDialog: React.FC<WorkOrderDetailDialogProps> = ({
  open,
  onClose,
  workOrder,
}) => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<WorkOrderStatus | null>(null);

  const updateStatusMutation = useMutation({
    mutationFn: (status: WorkOrderStatus) => 
      workOrderService.updateWorkOrderStatus(workOrder!.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      onClose();
    },
  });

  if (!workOrder) return null;

  const handleStatusChange = (newStatus: WorkOrderStatus) => {
    updateStatusMutation.mutate(newStatus);
  };

  const getStatusLabel = (status: WorkOrderStatus): string => {
    switch (status) {
      case WorkOrderStatus.Created:
        return 'Created';
      case WorkOrderStatus.InProgress:
        return 'In Progress';
      case WorkOrderStatus.Completed:
        return 'Completed';
      case WorkOrderStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: WorkOrderStatus) => {
    switch (status) {
      case WorkOrderStatus.Created:
        return 'info';
      case WorkOrderStatus.InProgress:
        return 'warning';
      case WorkOrderStatus.Completed:
        return 'success';
      case WorkOrderStatus.Cancelled:
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.Urgent:
        return 'error';
      case Priority.High:
        return 'warning';
      case Priority.Medium:
        return 'info';
      case Priority.Low:
        return 'success';
      default:
        return 'default';
    }
  };

  const DetailRow: React.FC<{ label: string; value: React.ReactNode; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
      {icon && <Box sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }}>{icon}</Box>}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{workOrder.title}</Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={workOrder.priority}
              color={getPriorityColor(workOrder.priority)}
              size="small"
              icon={<PriorityIcon />}
            />
            <Chip
              label={getStatusLabel(workOrder.status)}
              color={getStatusColor(workOrder.status)}
              size="small"
              icon={<StatusIcon />}
            />
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">{workOrder.description}</Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Two Column Layout */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {/* Left Column */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Assignment Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <DetailRow
                icon={<PersonIcon fontSize="small" />}
                label="Requester"
                value={workOrder.requestedByUserName || 'Unknown'}
              />

              <DetailRow
                icon={<AssignmentIndIcon fontSize="small" />}
                label="Assigned To"
                value={workOrder.assignedToUserName || 'Unassigned'}
              />

              {workOrder.vendorName && (
                <DetailRow
                  icon={<VendorIcon fontSize="small" />}
                  label="Vendor"
                  value={workOrder.vendorName}
                />
              )}

              {workOrder.assetName && (
                <DetailRow
                  icon={<AssetIcon fontSize="small" />}
                  label="Related Asset"
                  value={workOrder.assetName}
                />
              )}
            </Box>

            {/* Right Column */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Schedule & Time
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Scheduled Date"
                value={workOrder.scheduledDate ? formatDateTime(workOrder.scheduledDate) : 'Not scheduled'}
              />

              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Completed Date"
                value={workOrder.completedDate ? formatDateTime(workOrder.completedDate) : 'Not completed'}
              />

              <DetailRow
                icon={<TimerIcon fontSize="small" />}
                label="Estimated Cost"
                value={workOrder.estimatedCost ? `$${workOrder.estimatedCost}` : 'Not estimated'}
              />

              <DetailRow
                icon={<TimerIcon fontSize="small" />}
                label="Actual Cost"
                value={workOrder.actualCost ? `$${workOrder.actualCost}` : 'Not recorded'}
              />

              {workOrder.vendorCost && (
                <DetailRow
                  icon={<TimerIcon fontSize="small" />}
                  label="Vendor Cost"
                  value={`$${workOrder.vendorCost}`}
                />
              )}
            </Box>
          </Box>

          {/* Notes Section */}
          {workOrder.notes && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {workOrder.notes}
                </Typography>
              </Box>
            </>
          )}

          {/* Metadata */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Created Date
              </Typography>
              <Typography variant="body2">{formatDateTime(workOrder.createdAt)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Last Modified
              </Typography>
              <Typography variant="body2">{formatDateTime(workOrder.updatedAt)}</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {workOrder.status === WorkOrderStatus.Created && (
            <Button
              variant="contained"
              color="warning"
              startIcon={<StartIcon />}
              onClick={() => handleStatusChange(WorkOrderStatus.InProgress)}
              disabled={updateStatusMutation.isPending}
            >
              Start Work
            </Button>
          )}
          {workOrder.status === WorkOrderStatus.InProgress && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CompleteIcon />}
              onClick={() => handleStatusChange(WorkOrderStatus.Completed)}
              disabled={updateStatusMutation.isPending}
            >
              Mark Complete
            </Button>
          )}
          {(workOrder.status === WorkOrderStatus.Created || workOrder.status === WorkOrderStatus.InProgress) && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleStatusChange(WorkOrderStatus.Cancelled)}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
          )}
        </Box>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkOrderDetailDialog;
