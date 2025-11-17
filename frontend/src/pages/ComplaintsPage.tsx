import React from 'react';
import { Box } from '@mui/material';
import { ComplaintList } from '../components/Complaints/ComplaintList';

export const ComplaintsPage: React.FC = () => {
  return (
    <Box>
      <ComplaintList />
    </Box>
  );
};