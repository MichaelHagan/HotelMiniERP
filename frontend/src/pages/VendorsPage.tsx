import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { VendorList } from '../components/Vendors/VendorList';

export const VendorsPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <VendorList />
      </Box>
    </Container>
  );
};
