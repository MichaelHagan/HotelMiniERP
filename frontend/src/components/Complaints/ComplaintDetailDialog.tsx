import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Card,
  CardMedia
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Room as RoomIcon,
  Person as PersonIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { WorkerComplaint, CustomerComplaint, ComplaintStatus, Priority } from '../../types';
import { formatDateTime } from '../../utils/dateUtils';

interface ComplaintDetailDialogProps {
  open: boolean;
  onClose: () => void;
  complaint: WorkerComplaint | CustomerComplaint | null;
  complaintType: 'worker' | 'customer';
}

export const ComplaintDetailDialog: React.FC<ComplaintDetailDialogProps> = ({
  open,
  onClose,
  complaint,
  complaintType
}) => {
  if (!complaint) return null;

  const isCustomerComplaint = (c: WorkerComplaint | CustomerComplaint): c is CustomerComplaint => {
    return 'customerName' in c;
  };

  const getStatusColor = (status: ComplaintStatus): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
    switch (status) {
      case ComplaintStatus.Open:
        return 'error';
      case ComplaintStatus.InProgress:
        return 'warning';
      case ComplaintStatus.Resolved:
        return 'success';
      case ComplaintStatus.Closed:
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: Priority): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
    switch (priority) {
      case Priority.Urgent:
        return 'error';
      case Priority.High:
        return 'warning';
      case Priority.Medium:
        return 'primary';
      case Priority.Low:
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Complaint Details - {complaintType === 'worker' ? 'Worker' : 'Customer'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
          {/* Basic Information */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Title
                </Typography>
                <Typography variant="body1">{complaint.title}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Category
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip label={complaint.category} size="small" />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Priority
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={complaint.priority}
                    size="small"
                    color={getPriorityColor(complaint.priority)}
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={complaint.status}
                    size="small"
                    color={getStatusColor(complaint.status)}
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="textSecondary">
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                {complaint.description}
              </Typography>
            </Box>
          </Box>

          {/* Customer Information (for customer complaints) */}
          {complaintType === 'customer' && isCustomerComplaint(complaint) && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Customer Name
                    </Typography>
                    <Typography variant="body1">{complaint.customerName}</Typography>
                  </Box>
                </Box>
                {complaint.customerEmail && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="action" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body1">{complaint.customerEmail}</Typography>
                    </Box>
                  </Box>
                )}
                {complaint.customerPhone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">{complaint.customerPhone}</Typography>
                    </Box>
                  </Box>
                )}
                {complaint.roomNumber && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RoomIcon color="action" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Room Number
                      </Typography>
                      <Typography variant="body1">{complaint.roomNumber}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Staff Information (for worker complaints) */}
          {complaintType === 'worker' && !isCustomerComplaint(complaint) && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Staff Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Submitted By (User ID)
                  </Typography>
                  <Typography variant="body1">
                    {complaint.submittedByUserId || 'Not specified'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Assignment Information */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Assignment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Assigned To (User ID)
                </Typography>
                <Typography variant="body1">
                  {complaint.assignedToUserId || 'Unassigned'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Resolution Information */}
          {(complaint.status === ComplaintStatus.Resolved || complaint.status === ComplaintStatus.Closed) && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Resolution Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                {complaint.resolvedDate && (
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Resolution Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDateTime(complaint.resolvedDate)}
                    </Typography>
                  </Box>
                )}
                {complaint.resolution && (
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Resolution Notes
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                      {complaint.resolution}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Attached Images */}
          {complaint.imageUrls && complaint.imageUrls.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon color="action" />
                <Typography variant="h6" gutterBottom>
                  Attached Images ({complaint.imageUrls.length})
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
                gap: 2 
              }}>
                {complaint.imageUrls.map((image) => (
                  <Card key={image.id}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={image.imageUrl}
                      alt={image.fileName}
                      sx={{ 
                        objectFit: 'cover',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8
                        }
                      }}
                      onClick={() => window.open(image.imageUrl, '_blank')}
                    />
                    <Box sx={{ p: 1 }}>
                      <Typography variant="caption" display="block" noWrap title={image.fileName}>
                        {image.fileName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {image.fileSize ? (image.fileSize / 1024).toFixed(1) : '0'} KB
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {formatDateTime(image.createdAt)}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* Metadata */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Metadata
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Created Date
                </Typography>
                <Typography variant="body2">{formatDateTime(complaint.createdAt)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Last Modified
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(complaint.updatedAt)}
                </Typography>
              </Box>
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
