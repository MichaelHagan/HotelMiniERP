// User Types
export interface User {
  id: string;
  username?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
  profilePictureUrl?: string;
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
  name: string;
  description?: string;
  assetTag: string;
  category: string;
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationRate: number;
  vendor: string;
  warrantyExpiryDate?: string;
  status: AssetStatus;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  assignedUserId?: string;
  assignedUser?: User;
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
  name: string;
  description?: string;
  assetTag: string;
  category: string;
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationRate: number;
  vendor: string;
  warrantyExpiryDate?: string;
  assignedUserId?: string;
}

export interface UpdateAssetDto {
  name?: string;
  description?: string;
  category?: string;
  location?: string;
  currentValue?: number;
  status?: AssetStatus;
  assignedUserId?: string;
  nextMaintenanceDate?: string;
}

// Work Order Types
export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: WorkOrderStatus;
  assetId?: string;
  asset?: Asset;
  assignedUserId?: string;
  assignedUser?: User;
  requesterId: string;
  requester?: User;
  workerComplaintId?: string;
  customerComplaintId?: string;
  estimatedHours?: number;
  actualHours?: number;
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
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
  assetId?: string;
  assignedUserId?: string;
  workerComplaintId?: string;
  customerComplaintId?: string;
  estimatedHours?: number;
  scheduledDate?: string;
}

export interface UpdateWorkOrderDto {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: WorkOrderStatus;
  assignedUserId?: string;
  estimatedHours?: number;
  actualHours?: number;
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
}

// Inventory Types
export interface Inventory {
  id: string;
  name: string;
  description?: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  location: string;
  category: string;
  quantity: number;
  minimumStock?: number;
  unitCost?: number;
  supplier?: string;
  purchaseDate: string;
  warrantyExpiryDate?: string;
  lastRestockedDate?: string;
  specifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryDto {
  name: string;
  description?: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  location: string;
  category: string;
  quantity: number;
  minimumStock?: number;
  unitCost?: number;
  supplier?: string;
  purchaseDate: string;
  warrantyExpiryDate?: string;
  lastRestockedDate?: string;
  specifications?: Record<string, any>;
}

export interface UpdateInventoryDto {
  name?: string;
  description?: string;
  location?: string;
  category?: string;
  quantity?: number;
  minimumStock?: number;
  unitCost?: number;
  supplier?: string;
  lastRestockedDate?: string;
  specifications?: Record<string, any>;
}

// Procedure Types
export interface Procedure {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
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
  category: string;
  content: string;
  version?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
}

export interface UpdateProcedureDto {
  title?: string;
  description?: string;
  category?: string;
  content?: string;
  isActive?: boolean;
  version?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
}

// Complaint Types
export interface WorkerComplaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: Priority;
  status: ComplaintStatus;
  complainantId: string;
  complainant?: User;
  assignedUserId?: string;
  assignedUser?: User;
  resolutionNotes?: string;
  resolutionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerComplaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: Priority;
  status: ComplaintStatus;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  roomNumber?: string;
  assignedUserId?: string;
  assignedUser?: User;
  resolutionNotes?: string;
  resolutionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ComplaintCategory {
  Service = 'Service',
  Maintenance = 'Maintenance',
  Cleanliness = 'Cleanliness',
  Noise = 'Noise',
  Safety = 'Safety',
  Other = 'Other'
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
  category: ComplaintCategory;
  priority: Priority;
}

export interface CreateCustomerComplaintDto {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: Priority;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  roomNumber?: string;
}

export interface UpdateComplaintDto {
  title?: string;
  description?: string;
  category?: ComplaintCategory;
  priority?: Priority;
  status?: ComplaintStatus;
  assignedUserId?: string;
  resolutionNotes?: string;
  resolutionDate?: string;
}

// Message Types
export interface Message {
  id: string;
  subject?: string;
  content: string;
  messageType: MessageType;
  senderId: string;
  sender?: User;
  recipientId?: string;
  recipient?: User;
  isRead: boolean;
  readDate?: string;
  createdAt: string;
}

export enum MessageType {
  Personal = 'Personal',
  Broadcast = 'Broadcast',
  System = 'System'
}

export interface CreateMessageDto {
  subject?: string;
  content: string;
  messageType: MessageType;
  recipientId?: string;
}

export interface UpdateMessageDto {
  isRead?: boolean;
  readDate?: string;
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
  category?: ComplaintCategory;
  assignedUserId?: string;
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