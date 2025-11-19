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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  Build,
  DateRange,
  Download,
  TrendingUp,
  TrendingDown,
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

export const InventoryUtilizationReport: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const { data: reportData, isLoading, error, refetch } = useQuery({
    queryKey: ['equipment-utilization-report', startDate, endDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/reports/equipment/utilization?startDate=${startDate}&endDate=${endDate}`,
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
    if (!reportData) return;
    
    const csvContent = [
      ['Category', 'Utilization Rate', 'Total Hours', 'Available Hours'],
      ...reportData.ByCategory.map((item: any) => [
        item.Category,
        item.UtilizationRate,
        item.TotalHours,
        item.AvailableHours,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equipment-utilization-${startDate}-to-${endDate}.csv`;
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
    return <Alert severity="error">Failed to load inventory utilization report</Alert>;
  }

  const categoryChartData = reportData?.ByCategory?.map((item: any) => ({
    name: item.Category,
    rate: item.UtilizationRate,
    hours: item.TotalHours,
  })) || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Build color="primary" />
          Equipment Utilization Report
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
          {/* Summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Utilization
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h3" color="primary">
                  {reportData.OverallUtilization?.toFixed(1)}%
                </Typography>
                <Chip
                  label={reportData.OverallUtilization > 80 ? 'High Utilization' : reportData.OverallUtilization > 60 ? 'Moderate' : 'Low Utilization'}
                  color={reportData.OverallUtilization > 80 ? 'success' : reportData.OverallUtilization > 60 ? 'warning' : 'error'}
                />
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
                  Utilization by Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rate" fill="#4caf50" name="Utilization Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hours Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="hours"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.hours}h`}
                    >
                      {categoryChartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Tables */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 3,
            mb: 3 
          }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp color="success" />
                  Most Used Equipment
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Equipment</TableCell>
                        <TableCell align="right">Category</TableCell>
                        <TableCell align="right">Rate</TableCell>
                        <TableCell align="right">Hours</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.MostUsedEquipment?.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{row.EquipmentName}</TableCell>
                          <TableCell align="right">{row.Category}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${row.UtilizationRate?.toFixed(1)}%`}
                              color="success"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">{row.TotalHours}h</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingDown color="warning" />
                  Underutilized Equipment
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Equipment</TableCell>
                        <TableCell align="right">Category</TableCell>
                        <TableCell align="right">Rate</TableCell>
                        <TableCell align="right">Hours</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.UnderutilizedEquipment?.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{row.EquipmentName}</TableCell>
                          <TableCell align="right">{row.Category}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${row.UtilizationRate?.toFixed(1)}%`}
                              color="warning"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">{row.TotalHours}h</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Category Breakdown */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Utilization by Category
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Utilization Rate</TableCell>
                      <TableCell align="right">Total Hours</TableCell>
                      <TableCell align="right">Available Hours</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.ByCategory?.map((row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{row.Category}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {row.UtilizationRate?.toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{row.TotalHours}</TableCell>
                        <TableCell align="right">{row.AvailableHours}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={row.UtilizationRate > 80 ? 'High' : row.UtilizationRate > 60 ? 'Moderate' : 'Low'}
                            color={row.UtilizationRate > 80 ? 'success' : row.UtilizationRate > 60 ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};
