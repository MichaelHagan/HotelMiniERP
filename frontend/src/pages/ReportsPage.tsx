import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingDown,
  Assignment,
  Build,
  BarChart,
  Report as ReportIcon,
} from '@mui/icons-material';
import { AssetDepreciationReport } from '../components/reports/AssetDepreciationReport';
import { WorkOrderPerformanceReport } from '../components/reports/WorkOrderPerformanceReport';
import { InventoryUtilizationReport } from '../components/reports/InventoryUtilizationReport';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requiredRole?: string[];
}

const availableReports: ReportCard[] = [
  {
    id: 'asset-depreciation',
    title: 'Asset Depreciation',
    description: 'View asset depreciation over time by category and identify top depreciating assets.',
    icon: <TrendingDown sx={{ fontSize: 40 }} />,
    color: '#f44336',
    requiredRole: ['Admin', 'Manager'],
  },
  {
    id: 'workorder-performance',
    title: 'Work Order Performance',
    description: 'Analyze work order completion rates, average times, and performance by priority and assignee.',
    icon: <Assignment sx={{ fontSize: 40 }} />,
    color: '#ff9800',
    requiredRole: ['Admin', 'Manager'],
  },
  {
    id: 'inventory-utilization',
    title: 'Inventory Utilization',
    description: 'Track inventory usage rates, identify underutilized assets, and optimize inventory allocation.',
    icon: <Build sx={{ fontSize: 40 }} />,
    color: '#4caf50',
    requiredRole: ['Admin', 'Manager'],
  },
];

export const ReportsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setActiveReport(null);
  };

  const handleViewReport = (reportId: string) => {
    setActiveReport(reportId);
    setSelectedTab(1);
  };

  const handleBackToList = () => {
    setActiveReport(null);
    setSelectedTab(0);
  };

  const renderReportContent = () => {
    switch (activeReport) {
      case 'asset-depreciation':
        return <AssetDepreciationReport />;
      case 'workorder-performance':
        return <WorkOrderPerformanceReport />;
      case 'inventory-utilization':
        return <InventoryUtilizationReport />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <BarChart sx={{ fontSize: 32 }} color="primary" />
        <Typography variant="h4">
          Reports & Analytics
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Available Reports" />
          <Tab label="Report View" disabled={!activeReport} />
        </Tabs>
      </Box>

      {selectedTab === 0 && (
        <Box>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Select a report to view detailed analytics and insights about your hotel operations.
          </Typography>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
            gap: 3 
          }}>
            {availableReports.map((report) => (
              <Card
                key={report.id}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      color: report.color,
                    }}
                  >
                    {report.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom align="center">
                    {report.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    {report.description}
                  </Typography>
                  {report.requiredRole && (
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      align="center"
                      sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}
                    >
                      Requires: {report.requiredRole.join(', ')}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<ReportIcon />}
                    onClick={() => handleViewReport(report.id)}
                    fullWidth
                    sx={{ mx: 2 }}
                  >
                    View Report
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {/* Info Card */}
          <Card sx={{ mt: 4, bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Typography variant="body2">
                <strong>Note:</strong> All reports can be exported to CSV format for further analysis. 
                Date ranges can be customized to view data for specific time periods. 
                Charts and visualizations update in real-time based on your selections.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {selectedTab === 1 && activeReport && (
        <Box>
          <Button
            variant="outlined"
            onClick={handleBackToList}
            sx={{ mb: 3 }}
          >
            ← Back to Reports List
          </Button>
          {renderReportContent()}
        </Box>
      )}
    </Box>
  );
};