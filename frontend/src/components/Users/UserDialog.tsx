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
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserRole,
} from '../../types';

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDialog: React.FC<UserDialogProps> = ({ open, onClose, user }) => {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(user);

  const [formData, setFormData] = useState<CreateUserDto | UpdateUserDto>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: UserRole.Worker,
    department: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: (data: CreateUserDto) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleClose();
    },
    onError: (error: any) => {
      setErrors({ submit: error.message || 'Failed to create user' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleClose();
    },
    onError: (error: any) => {
      setErrors({ submit: error.message || 'Failed to update user' });
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        isActive: user.isActive,
      });
    } else {
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: UserRole.Worker,
        department: '',
      });
    }
    setErrors({});
    setShowPassword(false);
  }, [user, open]);

  const handleClose = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: UserRole.Worker,
      department: '',
    });
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!isEditMode) {
      const createData = formData as CreateUserDto;
      
      if (!createData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createData.email)) {
        newErrors.email = 'Invalid email format';
      }

      if (!createData.password) {
        newErrors.password = 'Password is required';
      } else if (createData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isEditMode && user) {
      updateMutation.mutate({ id: user.id, data: formData as UpdateUserDto });
    } else {
      createMutation.mutate(formData as CreateUserDto);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditMode ? 'Edit User' : 'Create New User'}</DialogTitle>
        <DialogContent>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  value={formData.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />

                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  value={formData.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Box>

              {!isEditMode && (
                <>
                  <TextField
                    required
                    fullWidth
                    type="email"
                    label="Email"
                    value={(formData as CreateUserDto).email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                  />

                  <TextField
                    required
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    value={(formData as CreateUserDto).password || ''}
                    onChange={(e) => handleChange('password', e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password || 'Minimum 6 characters'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}

              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role || UserRole.Worker}
                  label="Role"
                  onChange={(e) => handleChange('role', e.target.value as UserRole)}
                >
                  <MenuItem value={UserRole.Admin}>Admin</MenuItem>
                  <MenuItem value={UserRole.Manager}>Manager</MenuItem>
                  <MenuItem value={UserRole.Supervisor}>Supervisor</MenuItem>
                  <MenuItem value={UserRole.Worker}>Worker</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Department"
                value={formData.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="e.g., Housekeeping, Front Desk, Maintenance"
              />

              {isEditMode && (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={(formData as UpdateUserDto).isActive !== undefined ? ((formData as UpdateUserDto).isActive ? 'active' : 'inactive') : 'active'}
                    label="Status"
                    onChange={(e) => handleChange('isActive', e.target.value === 'active')}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
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
              'Update User'
            ) : (
              'Create User'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserDialog;
