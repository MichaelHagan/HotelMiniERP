import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  Build,
  Assignment,
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Asset, AssetStatus, AssetQueryParams, UserRole } from '../../types';
import { assetService } from '../../services';
import { formatDate, formatCurrency, getStatusColor, getStatusText } from '../../utils';
import { AssetDialog } from './AssetDialog';
import { AssetDetailDialog } from './AssetDetailDialog';
import { useAuth } from '../../context/AuthContext';

export const AssetList: React.FC = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const queryClient = useQueryClient();

  const queryParams: AssetQueryParams = {
    page: page + 1,
    pageSize: rowsPerPage,
    status: statusFilter || undefined,
    category: categoryFilter || undefined,
    location: locationFilter || undefined,
  };

  const { data: assetsData, isLoading, error } = useQuery({
    queryKey: ['assets', queryParams, searchTerm],
    queryFn: () => assetService.getAssets(queryParams),
    placeholderData: (previousData: any) => previousData,
  });

  // Filter assets by search term (client-side)
  const filteredAssets = (assetsData as any)?.data?.filter((asset: Asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const canCreate = user?.role === UserRole.Admin || user?.role === UserRole.Manager;
  const canEdit = user?.role === UserRole.Admin || user?.role === UserRole.Manager;
  const canDelete = user?.role === UserRole.Admin;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateAsset = () => {
    setSelectedAsset(null);
    setCreateDialogOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditDialogOpen(true);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailDialogOpen(true);
  };

  const handleDeleteAsset = async (asset: Asset) => {
    if (window.confirm(`Are you sure you want to delete asset "${asset.name}"?`)) {
      try {
        await assetService.deleteAsset(asset.id);
        queryClient.invalidateQueries({ queryKey: ['assets'] });
      } catch (error) {
        console.error('Failed to delete asset:', error);
      }
    }
  };

  const handleCreateWorkOrder = (asset: Asset) => {
    // Navigate to work orders with pre-filled asset
    console.log('Create work order for asset:', asset.id);
  };

  const handleScheduleMaintenance = (asset: Asset) => {
    // Open maintenance scheduling dialog
    console.log('Schedule maintenance for asset:', asset.id);
  };

  if (error) {
    return (
      <Box>
        <Typography color="error">Failed to load assets</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Asset Register
        </Typography>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateAsset}
          >
            Add Asset
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Search Assets"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AssetStatus | '')}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                {Object.values(AssetStatus).map(status => (
                  <MenuItem key={status} value={status}>
                    {getStatusText(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Category"
              variant="outlined"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />

            <TextField
              label="Location"
              variant="outlined"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset Tag</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Current Value</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Loading assets...
                  </TableCell>
                </TableRow>
              ) : filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No assets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssets.map((asset: Asset) => (
                  <TableRow key={asset.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {asset.assetTag}
                      </Typography>
                    </TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(asset.status)}
                        color={getStatusColor(asset.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(asset.purchaseDate)}</TableCell>
                    <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                    <TableCell>
                      {asset.assignedUser ? (
                        <Typography variant="body2">
                          {asset.assignedUser.firstName} {asset.assignedUser.lastName}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Unassigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewAsset(asset)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        {canEdit && (
                          <Tooltip title="Edit Asset">
                            <IconButton size="small" onClick={() => handleEditAsset(asset)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Create Work Order">
                          <IconButton size="small" onClick={() => handleCreateWorkOrder(asset)}>
                            <Assignment />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Schedule Maintenance">
                          <IconButton size="small" onClick={() => handleScheduleMaintenance(asset)}>
                            <Build />
                          </IconButton>
                        </Tooltip>
                        {canDelete && (
                          <Tooltip title="Delete Asset">
                            <IconButton size="small" color="error" onClick={() => handleDeleteAsset(asset)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={(assetsData as any)?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Asset Dialogs */}
      <AssetDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        asset={null}
        mode="create"
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['assets'] });
          setCreateDialogOpen(false);
        }}
      />

      <AssetDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        asset={selectedAsset}
        mode="edit"
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['assets'] });
          setEditDialogOpen(false);
        }}
      />

      <AssetDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        asset={selectedAsset}
      />
    </Box>
  );
};