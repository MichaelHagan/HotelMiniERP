import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';

export const ProceduresPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Procedure Library
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Standard Operating Procedures (SOPs)
          </Typography>
          <Typography variant="body1" color="textSecondary">
            This page will manage all hotel standard operating procedures and documentation.
            Features will include:
          </Typography>
          <Box sx={{ mt: 2, ml: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>• Step-by-step procedure documentation</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Categorized procedure library</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Safety guidelines and notes</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Procedure version control</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Search and filtering capabilities</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};