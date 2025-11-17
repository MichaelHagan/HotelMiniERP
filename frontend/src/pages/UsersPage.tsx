import React from 'react';
import { Box } from '@mui/material';
import UserList from '../components/Users/UserList';

export const UsersPage: React.FC = () => {
  return (
    <Box>
      <UserList />
    </Box>
  );
};