// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  role: UserRole;
  department?: string;
  position?: string;
  hireDate?: string;
  isActive: boolean;
  profilePicture?: string;
  address?: string;
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
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  department?: string;
  profilePictureUrl?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  department?: string;
  profilePictureUrl?: string;
  isActive?: boolean;
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
}

// Asset Types
export interface Asset {
  id: string;
  assetName: string;
  assetCode: string;
  description?: string;
  category: string;
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationRate: number;
  supplier: string;
  warrantyExpiry?: string;
  status: AssetStatus;
  serialNumber?: string;
  model?: string;
  brand?: string;
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
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  supplier: string;
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
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  supplier: string;
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
  workType?: string;
  location?: string;
  notes?: string;
  assetId?: string;
  asset?: Asset;
  assignedToUserId?: string;
  assignedToUser?: User;
  requestedByUserId?: string;
  requestedByUser?: User;
  workerComplaintId?: string;
  workerComplaint?: WorkerComplaint;
  customerComplaintId?: string;
  customerComplaint?: CustomerComplaint;
  createdAt: string;
  updatedAt: string;
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum WorkOrderStatus {
  Open = 'Open',
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
  scheduledDate?: string;
  notes?: string;
}

export interface UpdateWorkOrderDto {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: WorkOrderStatus;
  workType?: string;
  location?: string;
  assignedToUserId?: string;
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
}

// Inventory Types
export interface Inventory {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  location: string;
  quantity: number;
  minimumStock?: number;
  unitCost?: number;
  supplier?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  lastRestockedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryDto {
  name: string;
  code: string;
  description: string;
  category: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  location: string;
  quantity: number;
  minimumStock?: number;
  unitCost?: number;
  supplier?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
}

export interface UpdateInventoryDto {
  name?: string;
  code?: string;
  description?: string;
  category?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  location?: string;
  quantity?: number;
  minimumStock?: number;
  unitCost?: number;
  supplier?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  lastRestockedDate?: string;
  notes?: string;
}

// Procedure Types
export interface Procedure {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  tags?: string;
  version: string;
  isActive: boolean;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  documentUrl?: string;
  estimatedDurationMinutes?: number;
  requiredInventory?: string;
  safetyNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProcedureDto {
  title: string;
  description: string;
  category: string;
  content: string;
  tags?: string;
  version?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  documentUrl?: string;
  estimatedDurationMinutes?: number;
  requiredInventory?: string;
  safetyNotes?: string;
}

export interface UpdateProcedureDto {
  title?: string;
  description?: string;
  category?: string;
  content?: string;
  tags?: string;
  isActive?: boolean;
  version?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  documentUrl?: string;
  estimatedDurationMinutes?: number;
  requiredInventory?: string;
  safetyNotes?: string;
}

// Complaint Types
export interface WorkerComplaint {
  id: string;
  complaintNumber: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: ComplaintStatus;
  location?: string;
  submittedByUserId: string;
  submittedByUser?: User;
  assignedToUserId?: string;
  assignedToUser?: User;
  resolvedDate?: string;
  resolution?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerComplaint {
  id: string;
  complaintNumber: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: ComplaintStatus;
  location?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  roomNumber?: string;
  assignedToUserId?: string;
  assignedToUser?: User;
  resolvedDate?: string;
  resolution?: string;
  notes?: string;
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
  isRead: boolean;
  readAt?: string;
  attachmentUrl?: string;
  senderId: string;
  sender?: User;
  receiverId: string;
  receiver?: User;
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
  attachmentUrl?: string;
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
