import React from 'react';
import { Box } from '@mui/material';
import WorkOrderList from '../components/WorkOrders/WorkOrderList';

export const WorkOrdersPage: React.FC = () => {
  return (
    <Box>
      <WorkOrderList />
    </Box>
  );
};