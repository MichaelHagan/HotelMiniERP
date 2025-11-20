import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
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
import { useQuery } from '@tanstack/react-query';
import { stockTransactionService } from '../../services/stockTransactionService';
import {
  Inventory,
  StockTransaction,
  StockTransactionType,
  StockReductionReason,
} from '../../types';
import { format } from 'date-fns';

interface StockHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  inventory: Inventory;
}

const StockHistoryDialog: React.FC<StockHistoryDialogProps> = ({ open, onClose, inventory }) => {
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['stockTransactions', inventory.id],
    queryFn: () => stockTransactionService.getTransactionsByInventoryId(parseInt(inventory.id)),
    enabled: open,
  });

  const getTransactionTypeLabel = (type: StockTransactionType) => {
    return type === StockTransactionType.Restock ? 'Restock' : 'Reduction';
  };

  const getTransactionTypeColor = (type: StockTransactionType): 'success' | 'error' => {
    return type === StockTransactionType.Restock ? 'success' : 'error';
  };

  const getReductionReasonLabel = (reason?: StockReductionReason) => {
    if (!reason) return '-';
    const labels = {
      [StockReductionReason.Spoilage]: 'Spoilage',
      [StockReductionReason.Used]: 'Used',
      [StockReductionReason.Damaged]: 'Damaged',
      [StockReductionReason.Lost]: 'Lost',
      [StockReductionReason.Expired]: 'Expired',
      [StockReductionReason.Other]: 'Other',
    };
    return labels[reason] || '-';
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return `$${amount.toFixed(2)}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Stock History - {inventory.name}
        <Typography variant="body2" color="text.secondary">
          Current Stock: {inventory.quantity} units
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error">
              Failed to load transaction history. Please try again.
            </Alert>
          )}

          {!isLoading && !error && transactions && transactions.length === 0 && (
            <Alert severity="info">
              No stock transactions found for this item.
            </Alert>
          )}

          {!isLoading && !error && transactions && transactions.length > 0 && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell align="right">Unit Cost</TableCell>
                    <TableCell>Recorded By</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction: StockTransaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.transactionDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getTransactionTypeLabel(transaction.transactionType)}
                          color={getTransactionTypeColor(transaction.transactionType)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          color={transaction.transactionType === StockTransactionType.Restock ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                        >
                          {transaction.transactionType === StockTransactionType.Restock ? '+' : '-'}
                          {transaction.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {transaction.vendorName || '-'}
                      </TableCell>
                      <TableCell>
                        {getReductionReasonLabel(transaction.reductionReason)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(transaction.unitCost)}
                      </TableCell>
                      <TableCell>
                        {transaction.createdByUserName || '-'}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {transaction.notes || '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockHistoryDialog;
