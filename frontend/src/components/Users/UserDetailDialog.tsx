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
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as RoleIcon,
  Business as DepartmentIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';
import { User, UserRole } from '../../types';
import { formatDateTime } from '../../utils/dateUtils';

interface UserDetailDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
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

const UserDetailDialog: React.FC<UserDetailDialogProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  const getRoleColor = (role: UserRole): 'error' | 'warning' | 'info' => {
    switch (role) {
      case UserRole.Admin:
        return 'error';
      case UserRole.Manager:
        return 'warning';
      case UserRole.Supervisor:
        return 'info';
      case UserRole.Worker:
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {user.firstName} {user.lastName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={user.role}
              color={getRoleColor(user.role)}
              size="small"
            />
            <Chip
              label={user.isActive ? 'Active' : 'Inactive'}
              color={user.isActive ? 'success' : 'default'}
              size="small"
              icon={user.isActive ? <ActiveIcon /> : <InactiveIcon />}
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {/* Personal Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
              <DetailRow
                icon={<PersonIcon fontSize="small" />}
                label="Full Name"
                value={`${user.firstName} ${user.lastName}`}
              />

              <DetailRow
                icon={<EmailIcon fontSize="small" />}
                label="Email"
                value={user.email}
              />

              {user.phoneNumber && (
                <DetailRow
                  icon={<PhoneIcon fontSize="small" />}
                  label="Phone Number"
                  value={user.phoneNumber}
                />
              )}
            </Box>
          </Box>

          {/* Work Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Work Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
              <DetailRow
                icon={<RoleIcon fontSize="small" />}
                label="Role"
                value={
                  <Box>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }} color="textSecondary">
                      {user.role === UserRole.Admin && 'Full system access with all permissions'}
                      {user.role === UserRole.Manager && 'Can manage staff and view reports'}
                      {user.role === UserRole.Supervisor && 'Can supervise work orders and inventory'}
                      {user.role === UserRole.Worker && 'Standard user access'}
                    </Typography>
                  </Box>
                }
              />

              {user.department && (
                <DetailRow
                  icon={<DepartmentIcon fontSize="small" />}
                  label="Department"
                  value={user.department}
                />
              )}
            </Box>
          </Box>

          {/* Account Status */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Account Status
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <DetailRow
              icon={user.isActive ? <ActiveIcon fontSize="small" /> : <InactiveIcon fontSize="small" />}
              label="Status"
              value={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'success' : 'default'}
                    size="small"
                  />
                  <Typography variant="caption" color="textSecondary">
                    {user.isActive ? 'User can access the system' : 'User access is disabled'}
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Metadata */}
          <Box sx={{ pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Created"
                value={formatDateTime(user.createdAt)}
              />

              <DetailRow
                icon={<CalendarIcon fontSize="small" />}
                label="Last Modified"
                value={formatDateTime(user.updatedAt)}
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

export default UserDetailDialog;
