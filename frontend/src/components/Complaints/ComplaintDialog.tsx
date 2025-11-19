import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintService } from '../../services/complaintService';
import {
  WorkerComplaint,
  CustomerComplaint,
  CreateWorkerComplaintDto,
  CreateCustomerComplaintDto,
  UpdateComplaintDto,
  ComplaintCategory,
  Priority,
  ComplaintStatus,
  UserRole
} from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ComplaintDialogProps {
  open: boolean;
  onClose: () => void;
  complaint: WorkerComplaint | CustomerComplaint | null;
  complaintType: 'worker' | 'customer';
}

export const ComplaintDialog: React.FC<ComplaintDialogProps> = ({
  open,
  onClose,
  complaint,
  complaintType
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isEditMode = !!complaint;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ComplaintCategory.Service as ComplaintCategory,
    priority: Priority.Medium as Priority,
    status: ComplaintStatus.Open as ComplaintStatus,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    roomNumber: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (complaint) {
      setFormData({
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        priority: complaint.priority,
        status: complaint.status,
        customerName: 'customerName' in complaint ? complaint.customerName : '',
        customerEmail: 'customerEmail' in complaint ? complaint.customerEmail || '' : '',
        customerPhone: 'customerPhone' in complaint ? complaint.customerPhone || '' : '',
        roomNumber: 'roomNumber' in complaint ? complaint.roomNumber || '' : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: ComplaintCategory.Service,
        priority: Priority.Medium,
        status: ComplaintStatus.Open,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        roomNumber: ''
      });
    }
    setErrors({});
  }, [complaint, open]);

  const createMutation = useMutation<
    WorkerComplaint | CustomerComplaint,
    Error,
    CreateWorkerComplaintDto | CreateCustomerComplaintDto
  >({
    mutationFn: (data: CreateWorkerComplaintDto | CreateCustomerComplaintDto) => {
      return complaintType === 'worker'
        ? complaintService.createWorkerComplaint(data as CreateWorkerComplaintDto)
        : complaintService.createCustomerComplaint(data as CreateCustomerComplaintDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [complaintType === 'worker' ? 'workerComplaints' : 'customerComplaints'] 
      });
      onClose();
    },
    onError: (error: any) => {
      setErrors({ submit: error.response?.data?.message || 'Failed to create complaint' });
    }
  });

  const updateMutation = useMutation<
    WorkerComplaint | CustomerComplaint,
    Error,
    UpdateComplaintDto
  >({
    mutationFn: (data: UpdateComplaintDto) => {
      if (!complaint) throw new Error('No complaint to update');
      return complaintType === 'worker'
        ? complaintService.updateWorkerComplaint(complaint.id, data)
        : complaintService.updateCustomerComplaint(complaint.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [complaintType === 'worker' ? 'workerComplaints' : 'customerComplaints'] 
      });
      onClose();
    },
    onError: (error: any) => {
      setErrors({ submit: error.response?.data?.message || 'Failed to update complaint' });
    }
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (complaintType === 'customer') {
      if (!formData.customerName.trim()) {
        newErrors.customerName = 'Customer name is required';
      }

      if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
        newErrors.customerEmail = 'Invalid email format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditMode) {
      const updateData: UpdateComplaintDto = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: formData.status
      };
      updateMutation.mutate(updateData);
    } else {
      if (complaintType === 'worker') {
        const createData: CreateWorkerComplaintDto = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority
        };
        createMutation.mutate(createData);
      } else {
        const createData: CreateCustomerComplaintDto = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail || undefined,
          customerPhone: formData.customerPhone || undefined,
          roomNumber: formData.roomNumber || undefined
        };
        createMutation.mutate(createData);
      }
    }
  };

  const canEditStatus = user?.role === UserRole.Admin || user?.role === UserRole.Manager;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? 'Edit Complaint' : `New ${complaintType === 'worker' ? 'Worker' : 'Customer'} Complaint`}
      </DialogTitle>
      <DialogContent>
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit}
          </Alert>
        )}
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
          />

          <TextField
            label="Description"
            fullWidth
            required
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <TextField
              select
              label="Category"
              required
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <MenuItem value={ComplaintCategory.Service}>Service</MenuItem>
              <MenuItem value={ComplaintCategory.Maintenance}>Maintenance</MenuItem>
              <MenuItem value={ComplaintCategory.Cleanliness}>Cleanliness</MenuItem>
              <MenuItem value={ComplaintCategory.Noise}>Noise</MenuItem>
              <MenuItem value={ComplaintCategory.Safety}>Safety</MenuItem>
              <MenuItem value={ComplaintCategory.Other}>Other</MenuItem>
            </TextField>

            <TextField
              select
              label="Priority"
              required
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              <MenuItem value={Priority.Low}>Low</MenuItem>
              <MenuItem value={Priority.Medium}>Medium</MenuItem>
              <MenuItem value={Priority.High}>High</MenuItem>
              <MenuItem value={Priority.Critical}>Critical</MenuItem>
            </TextField>
          </Box>

          {isEditMode && canEditStatus && (
            <TextField
              select
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value={ComplaintStatus.Open}>Open</MenuItem>
              <MenuItem value={ComplaintStatus.InProgress}>In Progress</MenuItem>
              <MenuItem value={ComplaintStatus.Resolved}>Resolved</MenuItem>
              <MenuItem value={ComplaintStatus.Closed}>Closed</MenuItem>
            </TextField>
          )}

          {complaintType === 'customer' && (
            <>
              <TextField
                label="Customer Name"
                fullWidth
                required
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                error={!!errors.customerName}
                helperText={errors.customerName}
                disabled={isEditMode}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField
                  label="Customer Email"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleChange('customerEmail', e.target.value)}
                  error={!!errors.customerEmail}
                  helperText={errors.customerEmail}
                  disabled={isEditMode}
                />

                <TextField
                  label="Customer Phone"
                  value={formData.customerPhone}
                  onChange={(e) => handleChange('customerPhone', e.target.value)}
                  disabled={isEditMode}
                />
              </Box>

              <TextField
                label="Room Number"
                value={formData.roomNumber}
                onChange={(e) => handleChange('roomNumber', e.target.value)}
                disabled={isEditMode}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {isEditMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
