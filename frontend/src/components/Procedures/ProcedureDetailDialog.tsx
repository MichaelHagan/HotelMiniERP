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
  Paper,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  CheckCircle as ApprovalIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Procedure } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface ProcedureDetailDialogProps {
  open: boolean;
  onClose: () => void;
  procedure: Procedure | null;
}

export const ProcedureDetailDialog: React.FC<ProcedureDetailDialogProps> = ({
  open,
  onClose,
  procedure,
}) => {
  if (!procedure) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{procedure.title}</Typography>
          <Chip
            label={procedure.isActive ? 'Active' : 'Inactive'}
            color={procedure.isActive ? 'success' : 'default'}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Category
          </Typography>
          <Chip label={procedure.category} variant="outlined" />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1">{procedure.description}</Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon fontSize="small" />
            Procedure Content
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {procedure.content}
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Version
            </Typography>
            <Typography variant="body1">{procedure.version}</Typography>
          </Box>

          {procedure.reviewDate && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon fontSize="small" />
                Review Date
              </Typography>
              <Typography variant="body1">{formatDate(procedure.reviewDate)}</Typography>
            </Box>
          )}

          {procedure.approvedBy && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ApprovalIcon fontSize="small" />
                Approved By
              </Typography>
              <Typography variant="body1">{procedure.approvedBy}</Typography>
            </Box>
          )}

          {procedure.approvalDate && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Approval Date
              </Typography>
              <Typography variant="body1">{formatDate(procedure.approvalDate)}</Typography>
            </Box>
          )}

          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Created
            </Typography>
            <Typography variant="body1">{formatDate(procedure.createdAt)}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Last Updated
            </Typography>
            <Typography variant="body1">{formatDate(procedure.updatedAt)}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcedureDetailDialog;
