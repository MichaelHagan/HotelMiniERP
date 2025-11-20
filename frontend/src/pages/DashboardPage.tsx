import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Assignment,
  Build,
  Report,
  People,
  TrendingUp,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { reportService } from '../services';
import { useNavigate } from 'react-router-dom';
import { DashboardSummaryDto } from '../types';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle, onClick }) => (
  <Card 
    sx={{ 
      height: '100%',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': onClick ? {
        transform: 'translateY(-4px)',
        boxShadow: 4,
      } : {}
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ color: color, fontSize: 48 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

interface ProgressCardProps {
  title: string;
  items: Array<{ label: string; value: number; color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' }>;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, items }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ mt: 3 }}>
        {items.map((item, index) => (
          <Box key={index} sx={{ mb: index < items.length - 1 ? 3 : 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{item.label}</Typography>
              <Typography variant="body2" fontWeight="bold">{item.value}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.value}
              sx={{ height: 8, borderRadius: 4 }}
              color={item.color || 'primary'}
            />
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);

interface SummaryItem {
  label: string;
  value: number;
  color?: string;
  status?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

interface SummaryCardProps {
  title: string;
  items: SummaryItem[];
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, items }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <List dense>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider />}
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{ variant: 'body2' }}
              />
              <Chip
                label={item.value}
                size="small"
                color={item.status || 'default'}
                sx={{ minWidth: 50, fontWeight: 'bold' }}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </CardContent>
  </Card>
);

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: dashboardData, isLoading, error, refetch } = useQuery<DashboardSummaryDto>({
    queryKey: ['dashboard-summary'],
    queryFn: () => reportService.getDashboardSummary(),
    refetchInterval: 60000, // Refetch every minute
  });

  React.useEffect(() => {
    // Refetch when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refetch]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">
          Failed to load dashboard data. Please try again later.
        </Alert>
      </Box>
    );
  }

  const { assets, workOrders, inventory, complaints, users } = dashboardData || {};

  // Calculate percentages for progress bars
  const assetActivePercentage = assets ? Math.round((assets.activeAssets / assets.totalAssets) * 100) : 0;
  const inventoryAvailablePercentage = inventory ? Math.round((inventory.availableInventory / inventory.totalInventory) * 100) : 0;
  const workOrderCompletionPercentage = workOrders && workOrders.totalWorkOrders > 0
    ? Math.round(((workOrders.totalWorkOrders - workOrders.openWorkOrders - workOrders.inProgressWorkOrders) / workOrders.totalWorkOrders) * 100)
    : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Dashboard Overview
        </Typography>
        <Chip
          icon={<TrendingUp />}
          label="Real-time Data"
          color="primary"
          variant="outlined"
        />
      </Box>
      
      {/* Stats Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 4 
      }}>
        <StatCard
          title="Total Assets"
          value={assets?.totalAssets || 0}
          icon={<InventoryIcon />}
          color="#1976d2"
          subtitle={`${assets?.maintenanceRequired || 0} need maintenance`}
          onClick={() => navigate('/assets')}
        />
        <StatCard
          title="Open Work Orders"
          value={workOrders?.openWorkOrders || 0}
          icon={<Assignment />}
          color="#ff9800"
          subtitle={`${workOrders?.highPriorityWorkOrders || 0} high priority`}
          onClick={() => navigate('/workorders')}
        />
        <StatCard
          title="Inventory Items"
          value={inventory?.totalInventory || 0}
          icon={<Build />}
          color="#4caf50"
          subtitle={`${inventory?.availableInventory || 0} available`}
          onClick={() => navigate('/inventory')}
        />
        <StatCard
          title="Open Complaints"
          value={(complaints?.customerComplaints?.open || 0) + (complaints?.workerComplaints?.open || 0)}
          icon={<Report />}
          color="#f44336"
          subtitle={`${complaints?.customerComplaints?.open || 0} customer, ${complaints?.workerComplaints?.open || 0} worker`}
          onClick={() => navigate('/complaints')}
        />
        <StatCard
          title="Active Users"
          value={users?.activeUsers || 0}
          icon={<People />}
          color="#9c27b0"
          subtitle={`${users?.onlineUsers || 0} online now`}
          onClick={() => navigate('/users')}
        />
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap: 3,
        mb: 3
      }}>
        {/* Work Orders Summary */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment color="primary" />
              Work Orders Overview
            </Typography>
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              mt: 2
            }}>
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Total Work Orders
                </Typography>
                <Typography variant="h4">{workOrders?.totalWorkOrders || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Completed This Month
                </Typography>
                <Typography variant="h4" color="success.main">
                  {workOrders?.completedThisMonth || 0}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={`${workOrders?.openWorkOrders || 0} Open`} 
                color="info"
                icon={<Assignment />}
              />
              <Chip 
                label={`${workOrders?.inProgressWorkOrders || 0} In Progress`}
                color="warning"
              />
              <Chip 
                label={`${workOrders?.highPriorityWorkOrders || 0} High Priority`}
                color="error"
              />
              {(workOrders?.overdueWorkOrders || 0) > 0 && (
                <Chip 
                  label={`${workOrders?.overdueWorkOrders} Overdue`}
                  color="error"
                  icon={<Warning />}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* System Health */}
        <ProgressCard
          title="System Health"
          items={[
            {
              label: `Assets Active (${assets?.activeAssets || 0}/${assets?.totalAssets || 0})`,
              value: assetActivePercentage,
              color: assetActivePercentage > 90 ? 'success' : assetActivePercentage > 70 ? 'warning' : 'error'
            },
            {
              label: `Inventory Available (${inventory?.availableInventory || 0}/${inventory?.totalInventory || 0})`,
              value: inventoryAvailablePercentage,
              color: inventoryAvailablePercentage > 80 ? 'success' : inventoryAvailablePercentage > 60 ? 'warning' : 'error'
            },
            {
              label: 'Work Order Completion',
              value: workOrderCompletionPercentage,
              color: workOrderCompletionPercentage > 75 ? 'success' : workOrderCompletionPercentage > 50 ? 'warning' : 'error'
            },
          ]}
        />
      </Box>

      {/* Bottom Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
        gap: 3 
      }}>
        {/* Assets Summary */}
        <SummaryCard
          title="Assets Breakdown"
          items={[
            { label: 'Total Assets', value: assets?.totalAssets || 0, status: 'default' },
            { label: 'Active', value: assets?.activeAssets || 0, status: 'success' },
            { label: 'Maintenance Required', value: assets?.maintenanceRequired || 0, status: 'warning' },
            { label: 'Recently Added', value: assets?.recentlyAdded || 0, status: 'info' },
          ]}
        />

        {/* Inventory Summary */}
        <SummaryCard
          title="Inventory Status"
          items={[
            { label: 'Total Inventory', value: inventory?.totalInventory || 0, status: 'default' },
            { label: 'Available', value: inventory?.availableInventory || 0, status: 'success' },
            { label: 'In Use', value: inventory?.inUseInventory || 0, status: 'info' },
            { label: 'In Maintenance', value: inventory?.maintenanceInventory || 0, status: 'warning' },
            { label: 'Maintenance Due This Week', value: inventory?.maintenanceDueThisWeek || 0, 
              status: (inventory?.maintenanceDueThisWeek || 0) > 0 ? 'warning' : 'success' 
            },
          ]}
        />

        {/* Complaints Summary */}
        <SummaryCard
          title="Complaints Overview"
          items={[
            { label: 'Customer - Total', value: complaints?.customerComplaints?.total || 0, status: 'default' },
            { label: 'Customer - Open', value: complaints?.customerComplaints?.open || 0, 
              status: (complaints?.customerComplaints?.open || 0) > 0 ? 'error' : 'success' 
            },
            { label: 'Customer - In Progress', value: complaints?.customerComplaints?.inProgress || 0, status: 'warning' },
            { label: 'Worker - Total', value: complaints?.workerComplaints?.total || 0, status: 'default' },
            { label: 'Worker - Open', value: complaints?.workerComplaints?.open || 0,
              status: (complaints?.workerComplaints?.open || 0) > 0 ? 'error' : 'success'
            },
            { label: 'Worker - In Progress', value: complaints?.workerComplaints?.inProgress || 0, status: 'warning' },
          ]}
        />
      </Box>

      {/* Additional Info Card */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <CheckCircle color="success" />
            <Typography variant="body1" sx={{ flex: 1 }}>
              Dashboard automatically refreshes every minute to show the latest data from all modules.
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Total Asset Value: GHC{assets?.totalValue?.toLocaleString() || '0'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};