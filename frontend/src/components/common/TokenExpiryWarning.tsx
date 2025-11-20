import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, AlertTitle, Button } from '@mui/material';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';

export const TokenExpiryWarning: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const { logout } = useAuth();

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (!authService.isAuthenticated()) {
        return;
      }

      const secondsUntilExpiry = authService.getTimeUntilExpiry();
      
      // Show warning if less than 5 minutes (300 seconds) remaining
      if (secondsUntilExpiry > 0 && secondsUntilExpiry <= 300) {
        setShowWarning(true);
        
        // Format time remaining
        const minutes = Math.floor(secondsUntilExpiry / 60);
        const seconds = secondsUntilExpiry % 60;
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else if (secondsUntilExpiry === 0) {
        // Token expired, log out
        logout();
      } else {
        setShowWarning(false);
      }
    };

    // Check every 10 seconds
    const interval = setInterval(checkTokenExpiry, 10000);
    
    // Initial check
    checkTokenExpiry();

    return () => clearInterval(interval);
  }, [logout]);

  const handleClose = () => {
    setShowWarning(false);
  };

  const handleLogoutNow = () => {
    logout();
  };

  return (
    <Snackbar
      open={showWarning}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Alert 
        severity="warning" 
        onClose={handleClose}
        action={
          <Button color="inherit" size="small" onClick={handleLogoutNow}>
            Logout Now
          </Button>
        }
      >
        <AlertTitle>Session Expiring Soon</AlertTitle>
        Your session will expire in {timeRemaining}. Please save your work.
      </Alert>
    </Snackbar>
  );
};
