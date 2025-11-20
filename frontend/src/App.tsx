import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { SignalRProvider } from './context/SignalRContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Layout } from './components/common/Layout';
import { TokenExpiryWarning } from './components/common/TokenExpiryWarning';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssetsPage } from './pages/AssetsPage';
import { WorkOrdersPage } from './pages/WorkOrdersPage';
import { InventoryPage } from './pages/InventoryPage';
import { UsersPage } from './pages/UsersPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { MessagingPage } from './pages/MessagingPage';
import { ProceduresPage } from './pages/ProceduresPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { Message, UserRole } from './types';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  const handleMessageReceived = (message: Message) => {
    // Messages are now handled directly by MessageList component via SignalR
    console.log('Message received:', message);
  };

  const handleNotificationReceived = (notification: any) => {
    console.log('Notification received:', notification);
    // Handle notifications - could show toast, update badge count, etc.
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <TokenExpiryWarning />
          <SignalRProvider 
            onMessageReceived={handleMessageReceived}
            onNotificationReceived={handleNotificationReceived}
          >
            <Router>
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Layout>
                        <Navigate to="/dashboard" replace />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Layout>
                        <DashboardPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/assets/*" element={
                    <ProtectedRoute>
                      <Layout>
                        <AssetsPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/work-orders/*" element={
                    <ProtectedRoute>
                      <Layout>
                        <WorkOrdersPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/inventory/*" element={
                    <ProtectedRoute>
                      <Layout>
                        <InventoryPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/users/*" element={
                    <ProtectedRoute requiredRoles={[UserRole.Admin, UserRole.Manager]}>
                      <Layout>
                        <UsersPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/complaints/*" element={
                    <ProtectedRoute>
                      <Layout>
                        <ComplaintsPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/messaging/*" element={
                    <ProtectedRoute>
                      <Layout>
                        <MessagingPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/procedures/*" element={
                    <ProtectedRoute>
                      <Layout>
                        <ProceduresPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/reports/*" element={
                    <ProtectedRoute>
                      <Layout>
                        <ReportsPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Layout>
                        <ProfilePage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Box>
            </Router>
          </SignalRProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
