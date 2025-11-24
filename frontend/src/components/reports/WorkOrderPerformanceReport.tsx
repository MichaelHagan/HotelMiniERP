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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { reportService } from '../../services/reportService';
import {
  Assignment,
  DateRange,
  Download,
  CheckCircle,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const WorkOrderPerformanceReport: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const { data: reportData, isLoading, error, refetch } = useQuery({
    queryKey: ['workorder-performance-report', startDate, endDate],
    queryFn: () => reportService.getWorkOrderPerformanceReport(startDate, endDate),
  });

  const handleGenerateReport = () => {
    refetch();
  };

  const handleExport = () => {
    if (!reportData) return;
    
    const csvContent = [
      ['Priority', 'Total', 'Completed', 'Average Time'],
      ...reportData.byPriority.map((item: any) => [
        item.priority,
        item.total,
        item.completed,
        item.averageTime,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workorder-performance-${startDate}-to-${endDate}.csv`;
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
    return <Alert severity="error">Failed to load work order performance report</Alert>;
  }

  const priorityChartData = reportData?.byPriority?.map((item: any) => ({
    priority: item.priority,
    total: item.total,
    completed: item.completed,
    pending: item.total - item.completed,
  })) || [];

  const assigneeChartData = reportData?.byAssignee?.map((item: any) => ({
    name: item.assigneeName,
    completed: item.workOrdersCompleted,
    rate: item.completionRate,
  })) || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assignment color="primary" />
          Work Order Performance Report
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
          {/* Summary Cards */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, 
            gap: 3,
            mb: 3 
          }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Total Work Orders
                </Typography>
                <Typography variant="h4">{reportData.summary?.totalWorkOrders || 0}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Completed
                </Typography>
                <Typography variant="h4" color="success.main">
                  {reportData.summary?.completedWorkOrders || 0}
                </Typography>
                <Chip
                  icon={<CheckCircle />}
                  label={`${reportData.summary?.completionRate || 0}%`}
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Avg Completion Time
                </Typography>
                <Typography variant="h4">{reportData.summary?.averageCompletionTime || 'N/A'}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  On-Time Rate
                </Typography>
                <Typography variant="h4" color="primary">
                  {reportData.summary?.onTimeCompletionRate || 0}%
                </Typography>
              </CardContent>
            </Card>
          </Box>

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
                  Work Orders by Priority
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priorityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#4caf50" name="Completed" />
                    <Bar dataKey="pending" fill="#ff9800" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Performers
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={assigneeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="completed" stroke="#8884d8" name="Completed" />
                    <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#82ca9d" name="Rate %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Performance Tables */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 3 
          }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance by Priority
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Priority</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Completed</TableCell>
                        <TableCell align="right">Avg Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.byPriority?.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{row.priority}</TableCell>
                          <TableCell align="right">{row.total}</TableCell>
                          <TableCell align="right">{row.completed}</TableCell>
                          <TableCell align="right">{row.averageTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance by Assignee
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Assignee</TableCell>
                        <TableCell align="right">Completed</TableCell>
                        <TableCell align="right">Avg Time</TableCell>
                        <TableCell align="right">Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.byAssignee?.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{row.assigneeName}</TableCell>
                          <TableCell align="right">{row.workOrdersCompleted}</TableCell>
                          <TableCell align="right">{row.averageCompletionTime}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${row.completionRate}%`}
                              color={row.completionRate > 90 ? 'success' : row.completionRate > 80 ? 'warning' : 'default'}
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
          </Box>
        </>
      )}
    </Box>
  );
};
