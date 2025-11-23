// Constants
export const INVENTORY_CATEGORIES = [
  'Cleaning Supplies',
  'Kitchen Inventory',
  'Kitchen Supplies',
  'Food & Beverage',
  'Dry Goods',
  'Fresh Produce',
  'Dairy & Refrigerated',
  'Beverages',
  'Bar Supplies',
  'Linens & Bedding',
  'Toiletries & Amenities',
  'Maintenance Tools',
  'Office Supplies',
  'Safety Inventory',
  'Other'
] as const;

export const ASSET_CATEGORIES = [
  'Furniture',
  'Electronics',
  'HVAC Systems',
  'Kitchen Equipment',
  'Appliances',
  'Vehicles',
  'Tools & Equipment',
  'IT Equipment',
  'Lighting',
  'Safety Equipment',
  'Plumbing Fixtures',
  'Building Infrastructure',
  'Other'
] as const;

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  Supervisor = 'Supervisor',
  Worker = 'Worker'
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
}

export interface UpdateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  isActive: boolean;
}

// Authentication Types
export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Asset Types
export interface Asset {
  id: string;
  assetName: string;
  assetCode: string;
  description?: string;
  category: string;
  purchasePrice: number;
  purchaseDate: string;
  supplier: string;
  location: string;
  status: AssetStatus;
  warrantyExpiry?: string;
  serialNumber?: string;
  model?: string;
  brand?: string;
  depreciationRate?: number;
  currentValue?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum AssetStatus {
  Active = 'Active',
  InMaintenance = 'InMaintenance',
  Retired = 'Retired',
  Disposed = 'Disposed'
}

export interface CreateAssetDto {
  assetName: string;
  assetCode: string;
  description?: string;
  category: string;
  purchasePrice: number;
  purchaseDate: string;
  supplier: string;
  location: string;
  status: AssetStatus;
  warrantyExpiry?: string;
  serialNumber?: string;
  model?: string;
  brand?: string;
  depreciationRate?: number;
  notes?: string;
}

export interface UpdateAssetDto {
  id: number;
  assetName: string;
  assetCode: string;
  description?: string;
  category: string;
  purchasePrice: number;
  purchaseDate: string;
  supplier: string;
  location: string;
  status: AssetStatus;
  warrantyExpiry?: string;
  serialNumber?: string;
  model?: string;
  brand?: string;
  depreciationRate?: number;
  currentValue?: number;
  notes?: string;
}

// Work Order Types
export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  priority: Priority;
  status: WorkOrderStatus;
  requestedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  vendorCost?: number;
  workType?: string;
  location?: string;
  notes?: string;
  assetId?: string;
  assetName?: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  requestedByUserId?: string;
  requestedByUserName?: string;
  workerComplaintId?: string;
  customerComplaintId?: string;
  vendorId?: string;
  vendorName?: string;
  createdAt: string;
  updatedAt: string;
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent'
}

export enum WorkOrderStatus {
  Created = 'Created',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface CreateWorkOrderDto {
  title: string;
  description: string;
  priority: Priority;
  workType?: string;
  location?: string;
  assetId?: string;
  assignedToUserId?: string;
  requestedByUserId?: string;
  workerComplaintId?: string;
  customerComplaintId?: string;
  estimatedCost?: number;
  vendorCost?: number;
  vendorId?: number;
  scheduledDate?: string;
  notes?: string;
}

export interface UpdateWorkOrderDto {
  title: string;
  description: string;
  priority: Priority;
  status: WorkOrderStatus;
  workType?: string;
  location?: string;
  assignedToUserId?: number;
  assetId?: number;
  estimatedCost?: number;
  actualCost?: number;
  vendorCost?: number;
  vendorId?: number;
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
}

// Vendor Types
export interface Vendor {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  contactPerson?: string;
  services?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorDto {
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  contactPerson?: string;
  services?: string;
  notes?: string;
}

export interface UpdateVendorDto {
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  contactPerson?: string;
  services?: string;
  notes?: string;
  isActive: boolean;
}

// Inventory Types
export interface Inventory {
  id: string;
  name: string;
  description?: string;
  category: string;
  location: string;
  quantity: number;
  minimumStock?: number;
  unitCost?: number;
  lastRestockedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryDto {
  name: string;
  description?: string;
  category: string;
  location: string;
  minimumStock?: number;
  unitCost?: number;
  notes?: string;
}

export interface UpdateInventoryDto {
  name?: string;
  description?: string;
  category?: string;
  location?: string;
  minimumStock?: number;
  unitCost?: number;
  notes?: string;
}

// Stock Transaction Types
export enum StockTransactionType {
  Restock = "Restock",
  Reduction = "Reduction"
}

export enum StockReductionReason {
  Spoilage = "Spoilage",
  Used = "Used",
  Damaged = "Damaged",
  Lost = "Lost",
  Expired = "Expired",
  Other = "Other"
}

export interface StockTransaction {
  id: string;
  inventoryId: string;
  inventoryName: string;
  transactionType: StockTransactionType;
  quantity: number;
  vendorId?: string;
  vendorName?: string;
  transactionDate: string;
  reductionReason?: StockReductionReason;
  notes?: string;
  unitCost?: number;
  createdByUserId?: string;
  createdByUserName?: string;
  createdAt: string;
}

export interface CreateStockTransactionDto {
  inventoryId: number;
  transactionType: StockTransactionType;
  quantity: number;
  vendorId?: number;
  transactionDate: string;
  reductionReason?: StockReductionReason;
  notes?: string;
  unitCost?: number;
}

// Procedure Types
export interface Procedure {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  isActive: boolean;
  version: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProcedureDto {
  title: string;
  description: string;
  content: string;
  category: string;
  version?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
}

export interface UpdateProcedureDto {
  id: number;
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  isActive?: boolean;
  version?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
}

// Complaint Types
export interface ComplaintImage {
  id: number;
  imageUrl: string;
  publicId: string;
  fileName?: string;
  fileSize?: number;
  createdAt: string;
}

export interface WorkerComplaint {
  id: string;
  type: string;
  complaintNumber: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  priority: Priority;
  category: string;
  location?: string;
  resolvedDate?: string;
  resolution?: string;
  notes?: string;
  submittedByUserId?: number;
  assignedToUserId?: number;
  assignedToUserName?: string;
  hasWorkOrder?: boolean;
  imageUrls?: ComplaintImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerComplaint {
  id: string;
  type: string;
  complaintNumber: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  priority: Priority;
  category: string;
  location?: string;
  resolvedDate?: string;
  resolution?: string;
  notes?: string;
  assignedToUserId?: number;
  assignedToUserName?: string;
  hasWorkOrder?: boolean;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  roomNumber?: string;
  imageUrls?: ComplaintImage[];
  createdAt: string;
  updatedAt: string;
}

export enum ComplaintStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  Closed = 'Closed'
}

export interface CreateWorkerComplaintDto {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  submittedByUserId: string;
  location?: string;
  notes?: string;
}

export interface CreateCustomerComplaintDto {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  location?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  roomNumber?: string;
  notes?: string;
}

export interface UpdateComplaintDto {
  title?: string;
  description?: string;
  category?: string;
  priority?: Priority;
  status?: ComplaintStatus;
  location?: string;
  assignedToUserId?: string;
  resolution?: string;
  resolvedDate?: string;
  notes?: string;
}

// Message Types
export interface Message {
  id: string;
  subject: string;
  content: string;
  messageType: MessageType;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum MessageType {
  Personal = 'Personal',
  Broadcast = 'Broadcast',
  System = 'System'
}

export interface CreateMessageDto {
  subject: string;
  content: string;
  messageType: MessageType;
  receiverId: string;
}

export interface UpdateMessageDto {
  isRead?: boolean;
  readAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface AssetQueryParams extends PaginationParams {
  category?: string;
  status?: AssetStatus;
  location?: string;
  assignedUserId?: string;
}

export interface WorkOrderQueryParams extends PaginationParams {
  status?: WorkOrderStatus;
  priority?: Priority;
  assignedUserId?: string;
  assetId?: string;
}

export interface InventoryQueryParams extends PaginationParams {
  searchTerm?: string;
  category?: string;
  location?: string;
}

export interface ComplaintQueryParams extends PaginationParams {
  status?: ComplaintStatus;
  priority?: Priority;
  category?: string;
  assignedUserId?: string;
}

export interface ProcedureQueryParams extends PaginationParams {
  category?: string;
}

// Report Types
export interface AssetReport {
  totalAssets: number;
  activeAssets: number;
  assetsInMaintenance: number;
  retiredAssets: number;
  totalValue: number;
  averageAge: number;
  upcomingMaintenances: Asset[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface WorkOrderReport {
  totalWorkOrders: number;
  openWorkOrders: number;
  completedWorkOrders: number;
  averageCompletionTime: number;
  priorityBreakdown: PriorityBreakdown[];
  monthlyTrends: MonthlyTrend[];
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  value: number;
}

export interface PriorityBreakdown {
  priority: Priority;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  count: number;
}

// Dashboard Types
export interface DashboardSummaryDto {
  assets: AssetSummaryDto;
  workOrders: WorkOrderSummaryDto;
  inventory: InventorySummaryDto;
  complaints: ComplaintsSummaryDto;
  users: UserSummaryDto;
}

export interface AssetSummaryDto {
  totalAssets: number;
  activeAssets: number;
  maintenanceRequired: number;
  totalValue: number;
  recentlyAdded: number;
}

export interface WorkOrderSummaryDto {
  totalWorkOrders: number;
  openWorkOrders: number;
  inProgressWorkOrders: number;
  completedThisMonth: number;
  highPriorityWorkOrders: number;
  overdueWorkOrders: number;
}

export interface InventorySummaryDto {
  totalInventory: number;
  availableInventory: number;
  inUseInventory: number;
  maintenanceInventory: number;
  maintenanceDueThisWeek: number;
}

export interface ComplaintsSummaryDto {
  customerComplaints: ComplaintTypeSummaryDto;
  workerComplaints: ComplaintTypeSummaryDto;
}

export interface ComplaintTypeSummaryDto {
  total: number;
  open: number;
  inProgress: number;
  resolvedThisMonth: number;
}

export interface UserSummaryDto {
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  newUsersThisMonth: number;
}
