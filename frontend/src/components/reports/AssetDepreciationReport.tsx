import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  TrendingDown,
  DateRange,
  Download,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const AssetDepreciationReport: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const { data: reportData, isLoading, error, refetch } = useQuery({
    queryKey: ['asset-depreciation-report', startDate, endDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/reports/assets/depreciation?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch report');
      return response.json();
    },
  });

  const handleGenerateReport = () => {
    refetch();
  };

  const handleExport = () => {
    // Simple CSV export
    if (!reportData) return;
    
    const csvContent = [
      ['Category', 'Total Value', 'Depreciation Amount', 'Depreciation %'],
      ...reportData.AssetsByCategory.map((item: any) => [
        item.Category,
        item.TotalValue,
        item.DepreciationAmount,
        item.DepreciationPercentage,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asset-depreciation-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load depreciation report</Alert>;
  }

  const chartData = reportData?.AssetsByCategory?.map((item: any) => ({
    name: item.Category,
    value: item.TotalValue,
    depreciation: item.DepreciationAmount,
    percentage: item.DepreciationPercentage,
  })) || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingDown color="primary" />
          Asset Depreciation Report
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
          disabled={!reportData}
        >
          Export CSV
        </Button>
      </Box>

      {/* Date Range Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <DateRange color="action" />
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button variant="contained" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </Box>
        </CardContent>
      </Card>

      {reportData && (
        <>
          {/* Summary Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Report Period
                  </Typography>
                  <Typography variant="body1">
                    {new Date(reportData.ReportPeriod.StartDate).toLocaleDateString()} - {new Date(reportData.ReportPeriod.EndDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Depreciation
                  </Typography>
                  <Typography variant="h5" color="error">
                    ${reportData.TotalDepreciation?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Charts */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            mb: 3 
          }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Depreciation by Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="depreciation" fill="#FF8042" name="Depreciation Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Category Value Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: any) => `${entry.name}: $${entry.value.toLocaleString()}`}
                    >
                      {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Top Depreciating Assets */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Depreciating Assets
              </Typography>
              <Box sx={{ mt: 2 }}>
                {reportData.TopDepreciatingAssets?.map((asset: any, index: number) => (
                  <Box key={index}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {asset.AssetName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Original: ${asset.OriginalValue?.toLocaleString()} → Current: ${asset.CurrentValue?.toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="error">
                        -${asset.DepreciationAmount?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};
