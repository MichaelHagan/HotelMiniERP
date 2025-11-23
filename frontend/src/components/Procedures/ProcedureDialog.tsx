import React, { useState, useEffect } from 'react';
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
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { procedureService } from '../../services/procedureService';
import {
  Procedure,
  CreateProcedureDto,
  UpdateProcedureDto,
} from '../../types';

const PROCEDURE_CATEGORIES = [
  'Front Desk',
  'Housekeeping',
  'Maintenance',
  'Food & Beverage',
  'Safety & Security',
  'Guest Services',
  'Administrative',
  'Other'
];

interface ProcedureDialogProps {
  open: boolean;
  onClose: () => void;
  procedure: Procedure | null;
}

export const ProcedureDialog: React.FC<ProcedureDialogProps> = ({ open, onClose, procedure }) => {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(procedure);

  const [formData, setFormData] = useState<CreateProcedureDto | UpdateProcedureDto>({
    title: '',
    description: '',
    category: '',
    content: '',
    version: '1.0',
    reviewDate: undefined,
    approvedBy: undefined,
    approvalDate: undefined,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProcedureDto) => procedureService.createProcedure(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedures'] });
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProcedureDto }) =>
      procedureService.updateProcedure(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedures'] });
      handleClose();
    },
  });

  useEffect(() => {
    if (procedure) {
      setFormData({
        title: procedure.title,
        description: procedure.description,
        category: procedure.category,
        content: procedure.content,
        isActive: procedure.isActive,
        version: procedure.version,
        reviewDate: procedure.reviewDate 
          ? new Date(procedure.reviewDate).toISOString().slice(0, 10)
          : undefined,
        approvedBy: procedure.approvedBy,
        approvalDate: procedure.approvalDate
          ? new Date(procedure.approvalDate).toISOString().slice(0, 10)
          : undefined,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        content: '',
        version: '1.0',
        reviewDate: undefined,
        approvedBy: undefined,
        approvalDate: undefined,
      });
    }
  }, [procedure, open]);

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      content: '',
      version: '1.0',
      reviewDate: undefined,
      approvedBy: undefined,
      approvalDate: undefined,
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert dates to ISO 8601 format if provided
    const preparedData = {
      ...formData,
      reviewDate: formData.reviewDate 
        ? new Date(formData.reviewDate).toISOString() 
        : undefined,
      approvalDate: formData.approvalDate 
        ? new Date(formData.approvalDate).toISOString() 
        : undefined
    };
    
    if (isEditMode && procedure) {
      const updateData = {
        ...preparedData,
        id: parseInt(procedure.id)
      } as UpdateProcedureDto;
      updateMutation.mutate({ id: procedure.id, data: updateData });
    } else {
      createMutation.mutate(preparedData as CreateProcedureDto);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditMode ? 'Edit Procedure' : 'Create Procedure'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  required
                  fullWidth
                  label="Title"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </Box>

              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </Box>

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category || ''}
                  label="Category"
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  {PROCEDURE_CATEGORIES.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Version"
                value={formData.version || '1.0'}
                onChange={(e) => handleChange('version', e.target.value)}
                placeholder="e.g., 1.0, 2.1"
              />

              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={10}
                  label="Procedure Content"
                  value={formData.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Enter detailed step-by-step instructions..."
                  helperText="Provide comprehensive instructions for this procedure"
                />
              </Box>

              <TextField
                fullWidth
                type="date"
                label="Review Date"
                value={formData.reviewDate || ''}
                onChange={(e) => handleChange('reviewDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                label="Approved By"
                value={formData.approvedBy || ''}
                onChange={(e) => handleChange('approvedBy', e.target.value)}
                placeholder="Name of approver"
              />

              <TextField
                fullWidth
                type="date"
                label="Approval Date"
                value={formData.approvalDate || ''}
                onChange={(e) => handleChange('approvalDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              {isEditMode && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={(formData as UpdateProcedureDto).isActive !== false}
                      onChange={(e) => handleChange('isActive', e.target.checked)}
                    />
                  }
                  label="Active"
                />
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <CircularProgress size={24} />
            ) : isEditMode ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProcedureDialog;
