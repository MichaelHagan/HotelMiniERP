import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Inventory2 as StockIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '../../services/inventoryService';
import { Inventory, InventoryQueryParams, UserRole } from '../../types';
import InventoryDialog from './InventoryDialog';
import InventoryDetailDialog from './InventoryDetailDialog';
import UpdateStockDialog from './UpdateStockDialog';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatUtils';

const InventoryList: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);

  const queryParams: InventoryQueryParams = {
    page: page + 1,
    pageSize,
    searchTerm: searchTerm || undefined,
    category: categoryFilter || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['inventory', queryParams],
    queryFn: () => inventoryService.getInventory(queryParams),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryService.deleteInventory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const handleCreate = () => {
    setSelectedInventory(null);
    setDialogOpen(true);
  };

  const handleEdit = (inventory?: Inventory) => {
    setSelectedInventory(inventory || null);
    setDialogOpen(true);
  };

  const handleView = (inventory?: Inventory) => {
    setSelectedInventory(inventory || null);
    setDetailDialogOpen(true);
  };

  const handleUpdateStock = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setStockDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const canEdit = user?.role === UserRole.Admin || user?.role === UserRole.Manager;
  const canDelete = user?.role === UserRole.Admin;

  const inventory = data?.data || [];
  const totalCount = data?.totalCount || 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Inventory</Typography>
        {canEdit && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Add Inventory Item
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Search"
              placeholder="Search by name, model, or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Category"
              placeholder="Filter by category..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Min Stock</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : inventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              inventory.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      color={item.minimumStock && item.quantity <= item.minimumStock ? 'error' : 'inherit'}
                      fontWeight={item.minimumStock && item.quantity <= item.minimumStock ? 'bold' : 'normal'}
                    >
                      {item.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {item.minimumStock || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.unitCost ? `${formatCurrency(item.unitCost)}` : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {canEdit && (
                      <Tooltip title="Update Stock">
                        <IconButton size="small" onClick={() => handleUpdateStock(item)} color="primary">
                          <StockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleView(item)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {canEdit && (
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(item)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {canDelete && (
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(item.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      <InventoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        inventory={selectedInventory}
      />

      <InventoryDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        inventory={selectedInventory}
      />

      {selectedInventory && (
        <UpdateStockDialog
          open={stockDialogOpen}
          onClose={() => setStockDialogOpen(false)}
          inventory={selectedInventory}
        />
      )}
    </Box>
  );
};

export default InventoryList;
