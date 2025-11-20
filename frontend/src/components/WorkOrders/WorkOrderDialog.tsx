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
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { workOrderService } from '../../services/workOrderService';
import { assetService } from '../../services/assetService';
import { userService } from '../../services/userService';
import { complaintService } from '../../services/complaintService';
import {
  WorkOrder,
  CreateWorkOrderDto,
  UpdateWorkOrderDto,
  Priority,
  WorkOrderStatus
} from '../../types';

interface WorkOrderDialogProps {
  open: boolean;
  onClose: () => void;
  workOrder: WorkOrder | null;
  assetId?: string;
  assetName?: string;
  workType?: string;
  workerComplaintId?: string;
  customerComplaintId?: string;
  complaintTitle?: string;
  complaintDescription?: string;
}

const WorkOrderDialog: React.FC<WorkOrderDialogProps> = ({ 
  open, 
  onClose, 
  workOrder,
  assetId,
  assetName,
  workType,
  workerComplaintId,
  customerComplaintId,
  complaintTitle,
  complaintDescription
}) => {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(workOrder);

  const [formData, setFormData] = useState<CreateWorkOrderDto | UpdateWorkOrderDto>({
    title: '',
    description: '',
    priority: Priority.Medium,
    assetId: undefined,
    assignedToUserId: undefined,
    estimatedCost: undefined,
    scheduledDate: undefined,
  });

  const { data: assetsData, isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => assetService.getAssets({ page: 1, pageSize: 100 }),
    enabled: open,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers({ page: 1, pageSize: 100 }),
    enabled: open,
  });

  const { data: workerComplaintsData, isLoading: workerComplaintsLoading } = useQuery({
    queryKey: ['workerComplaints'],
    queryFn: () => complaintService.getWorkerComplaints({ page: 1, pageSize: 100 }),
    enabled: open && !isEditMode,
  });

  const { data: customerComplaintsData, isLoading: customerComplaintsLoading } = useQuery({
    queryKey: ['customerComplaints'],
    queryFn: () => complaintService.getCustomerComplaints({ page: 1, pageSize: 100 }),
    enabled: open && !isEditMode,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateWorkOrderDto) => workOrderService.createWorkOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkOrderDto }) =>
      workOrderService.updateWorkOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      handleClose();
    },
  });

  useEffect(() => {
    if (workOrder) {
      setFormData({
        title: workOrder.title,
        description: workOrder.description,
        priority: workOrder.priority,
        status: workOrder.status,
        assetId: workOrder.assetId,
        assignedToUserId: workOrder.assignedToUserId,
        estimatedCost: workOrder.estimatedCost,
        actualCost: workOrder.actualCost,
        scheduledDate: workOrder.scheduledDate
          ? new Date(workOrder.scheduledDate).toISOString().slice(0, 16)
          : undefined,
        notes: workOrder.notes,
      });
    } else {
      const isMaintenanceWorkOrder = workType === 'Maintenance' && assetName;
      const hasComplaintData = (workerComplaintId || customerComplaintId) && (complaintTitle || complaintDescription);
      
      let title = '';
      let description = '';
      
      if (isMaintenanceWorkOrder) {
        title = `Maintenance for ${assetName}`;
        description = `Scheduled maintenance work for ${assetName}. Please inspect, service, and perform necessary maintenance tasks to ensure optimal performance and longevity.`;
      } else if (hasComplaintData) {
        title = complaintTitle ? `Work Order: ${complaintTitle}` : '';
        description = complaintDescription || '';
      }
      
      setFormData({
        title,
        description,
        priority: Priority.Medium,
        assetId: assetId,
        workType: workType,
        assignedToUserId: undefined,
        workerComplaintId: workerComplaintId,
        customerComplaintId: customerComplaintId,
        estimatedCost: undefined,
        scheduledDate: undefined,
      });
    }
  }, [workOrder, open, assetId, assetName, workType, workerComplaintId, customerComplaintId, complaintTitle, complaintDescription]);

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: Priority.Medium,
      assetId: undefined,
      assignedToUserId: undefined,
      workerComplaintId: undefined,
      customerComplaintId: undefined,
      estimatedCost: undefined,
      scheduledDate: undefined,
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && workOrder) {
      updateMutation.mutate({ id: workOrder.id, data: formData as UpdateWorkOrderDto });
    } else {
      createMutation.mutate(formData as CreateWorkOrderDto);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const assets = assetsData?.data || [];
  const users = usersData?.data || [];
  const workerComplaints = workerComplaintsData?.data || [];
  const customerComplaints = customerComplaintsData?.data || [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditMode ? 'Edit Work Order' : 'Create Work Order'}</DialogTitle>
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
                  rows={4}
                  label="Description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </Box>

              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority || Priority.Medium}
                  label="Priority"
                  onChange={(e) => handleChange('priority', e.target.value as Priority)}
                >
                  <MenuItem value={Priority.Low}>Low</MenuItem>
                  <MenuItem value={Priority.Medium}>Medium</MenuItem>
                  <MenuItem value={Priority.High}>High</MenuItem>
                  <MenuItem value={Priority.Critical}>Critical</MenuItem>
                </Select>
              </FormControl>

              {isEditMode && (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={(formData as UpdateWorkOrderDto).status || WorkOrderStatus.Open}
                    label="Status"
                    onChange={(e) =>
                      handleChange('status', e.target.value as WorkOrderStatus)
                    }
                  >
                    <MenuItem value={WorkOrderStatus.Open}>Open</MenuItem>
                    <MenuItem value={WorkOrderStatus.InProgress}>In Progress</MenuItem>
                    <MenuItem value={WorkOrderStatus.Completed}>Completed</MenuItem>
                    <MenuItem value={WorkOrderStatus.Cancelled}>Cancelled</MenuItem>
                  </Select>
                </FormControl>
              )}

              <Box sx={{ gridColumn: isEditMode ? { xs: '1', sm: '1 / -1' } : 'auto' }}>
                <Autocomplete
                  options={assets}
                  getOptionLabel={(option) => option.assetName}
                  value={assets.find((a) => a.id === (formData as any).assetId) || null}
                  onChange={(_e, value) => handleChange('assetId', value?.id)}
                  loading={assetsLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Related Asset"
                      helperText={(formData as any).workerComplaintId || (formData as any).customerComplaintId ? "Select the asset related to this complaint (if applicable)" : ""}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {assetsLoading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Box>

              {!isEditMode && (
                <>
                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Autocomplete
                      options={workerComplaints}
                      getOptionLabel={(option) => `${option.title} (${option.category})`}
                      value={workerComplaints.find((c) => c.id === (formData as any).workerComplaintId) || null}
                      onChange={(_e, value) => {
                        handleChange('workerComplaintId', value?.id);
                        if (value?.id) handleChange('customerComplaintId', undefined);
                      }}
                      loading={workerComplaintsLoading}
                      disabled={!!(formData as any).customerComplaintId}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Related Worker Complaint (Optional)"
                          helperText={(formData as any).customerComplaintId ? "Cannot link both complaint types" : ""}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {workerComplaintsLoading ? <CircularProgress size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Autocomplete
                      options={customerComplaints}
                      getOptionLabel={(option) => `${option.title} - ${option.customerName} (${option.category})`}
                      value={customerComplaints.find((c) => c.id === (formData as any).customerComplaintId) || null}
                      onChange={(_e, value) => {
                        handleChange('customerComplaintId', value?.id);
                        if (value?.id) handleChange('workerComplaintId', undefined);
                      }}
                      loading={customerComplaintsLoading}
                      disabled={!!(formData as any).workerComplaintId}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Related Customer Complaint (Optional)"
                          helperText={(formData as any).workerComplaintId ? "Cannot link both complaint types" : ""}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {customerComplaintsLoading ? <CircularProgress size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Box>
                </>
              )}

              <Autocomplete
                options={users}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.department})`}
                value={users.find((u) => u.id === formData.assignedToUserId) || null}
                onChange={(_e, value) => handleChange('assignedToUserId', value?.id)}
                loading={usersLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign To"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {usersLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <TextField
                fullWidth
                type="number"
                label="Estimated Cost"
                value={formData.estimatedCost || ''}
                onChange={(e) =>
                  handleChange('estimatedCost', e.target.value ? Number(e.target.value) : undefined)
                }
                inputProps={{ min: 0, step: 0.5 }}
              />

              {isEditMode && (
                <TextField
                  fullWidth
                  type="number"
                  label="Actual Cost"
                  value={(formData as UpdateWorkOrderDto).actualCost || ''}
                  onChange={(e) =>
                    handleChange('actualCost', e.target.value ? Number(e.target.value) : undefined)
                  }
                  inputProps={{ min: 0, step: 0.5 }}
                />
              )}

              <Box sx={{ gridColumn: isEditMode ? 'auto' : { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Scheduled Date"
                  value={formData.scheduledDate || ''}
                  onChange={(e) => handleChange('scheduledDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {isEditMode && (
                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Notes"
                    value={(formData as UpdateWorkOrderDto).notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                  />
                </Box>
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

export default WorkOrderDialog;
