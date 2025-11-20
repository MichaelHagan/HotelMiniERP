import { AssetStatus, WorkOrderStatus, ComplaintStatus, Priority, UserRole } from '../types';

// Status color mapping for Material-UI
export const getStatusColor = (status: AssetStatus | WorkOrderStatus | ComplaintStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case AssetStatus.Active:
    case WorkOrderStatus.Completed:
    case ComplaintStatus.Resolved:
      return 'success';
    
    case AssetStatus.InMaintenance:
    case WorkOrderStatus.InProgress:
    case ComplaintStatus.InProgress:
      return 'warning';
    
    case AssetStatus.Retired:
    case AssetStatus.Disposed:
    case WorkOrderStatus.Cancelled:
    case ComplaintStatus.Closed:
      return 'default';
    
    case WorkOrderStatus.Open:
    case ComplaintStatus.Open:
      return 'info';
    
    default:
      return 'default';
  }
};

export const getPriorityColor = (priority: Priority): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (priority) {
    case Priority.Low:
      return 'success';
    case Priority.Medium:
      return 'info';
    case Priority.High:
      return 'warning';
    case Priority.Urgent:
      return 'error';
    default:
      return 'default';
  }
};

export const getRoleColor = (role: UserRole): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (role) {
    case UserRole.Admin:
      return 'error';
    case UserRole.Manager:
      return 'warning';
    case UserRole.Supervisor:
      return 'info';
    case UserRole.Worker:
      return 'default';
    default:
      return 'default';
  }
};

// Helper function to get display text for enums
export const getStatusText = (status: AssetStatus | WorkOrderStatus | ComplaintStatus): string => {
  switch (status) {
    case AssetStatus.InMaintenance:
      return 'In Maintenance';
    case WorkOrderStatus.InProgress:
      return 'In Progress';
    case ComplaintStatus.InProgress:
      return 'In Progress';
    default:
      return status;
  }
};

export const getPriorityText = (priority: Priority): string => {
  return priority;
};

export const getRoleText = (role: UserRole): string => {
  return role;
};