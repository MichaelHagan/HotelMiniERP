// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  profilePictureUrl?: string;
  createdDate: string;
  lastModifiedDate: string;
}

export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  Employee = 'Employee'
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
  createdDate: string;
  lastModifiedDate: string;
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
  estimatedHours?: number;
  actualHours?: number;
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
  createdDate: string;
  lastModifiedDate: string;
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

// Equipment Types
export interface Equipment {
  id: string;
  name: string;
  description?: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  location: string;
  category: string;
  status: EquipmentStatus;
  purchaseDate: string;
  warrantyExpiryDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  operatingHours: number;
  specifications?: Record<string, any>;
  createdDate: string;
  lastModifiedDate: string;
}

export enum EquipmentStatus {
  Operational = 'Operational',
  Maintenance = 'Maintenance',
  OutOfService = 'OutOfService',
  Retired = 'Retired'
}

export interface CreateEquipmentDto {
  name: string;
  description?: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  location: string;
  category: string;
  purchaseDate: string;
  warrantyExpiryDate?: string;
  specifications?: Record<string, any>;
}

export interface UpdateEquipmentDto {
  name?: string;
  description?: string;
  location?: string;
  category?: string;
  status?: EquipmentStatus;
  operatingHours?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  specifications?: Record<string, any>;
}

// Procedure Types
export interface Procedure {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: ProcedureStep[];
  estimatedDuration?: number;
  requiredSkills?: string[];
  safetyNotes?: string;
  version: number;
  isActive: boolean;
  createdById: string;
  createdBy?: User;
  createdDate: string;
  lastModifiedDate: string;
}

export interface ProcedureStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedDuration?: number;
  warningNotes?: string;
}

export interface CreateProcedureDto {
  title: string;
  description: string;
  category: string;
  steps: ProcedureStep[];
  estimatedDuration?: number;
  requiredSkills?: string[];
  safetyNotes?: string;
}

export interface UpdateProcedureDto {
  title?: string;
  description?: string;
  category?: string;
  steps?: ProcedureStep[];
  estimatedDuration?: number;
  requiredSkills?: string[];
  safetyNotes?: string;
  isActive?: boolean;
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
  createdDate: string;
  lastModifiedDate: string;
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
  createdDate: string;
  lastModifiedDate: string;
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
  createdDate: string;
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

export interface EquipmentQueryParams extends PaginationParams {
  searchTerm?: string;
  category?: string;
  status?: EquipmentStatus;
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