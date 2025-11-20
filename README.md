# Hotel Mini ERP System

A comprehensive Hotel Management ERP system built with ASP.NET Core Clean Architecture, featuring asset management, work orders, user management, inventory tracking, complaint handling, messaging, and comprehensive reporting capabilities.

## 🏗️ Architecture

The system follows Clean Architecture principles with CQRS (Command Query Responsibility Segregation) pattern using MediatR:

- **Domain Layer**: Core business entities and enumerations
- **Application Layer**: Business logic, CQRS commands/queries, DTOs, and validation rules
- **Infrastructure Layer**: Data access, external services, and infrastructure concerns
- **Presentation Layer**: RESTful API controllers and SignalR hubs

## 🚀 Features

### Core Modules

1. **Asset Register**
   - Complete asset lifecycle management
   - Depreciation tracking and reporting
   - Maintenance scheduling from assets
   - Asset search and categorization
   - Direct work order creation from assets

2. **Work Order Management**
   - Create, assign, and track work orders
   - Priority-based task management
   - Status tracking and completion monitoring
   - Create work orders from assets or complaints
   - Pre-populated maintenance information
   - Performance reporting

3. **User Management & Team**
   - Role-based access control (Admin, Manager, Worker)
   - User authentication with JWT
   - Profile management and password changes
   - Active/inactive user management
   - User search and filtering

4. **Inventory Management**
   - Inventory tracking and categorization
   - Maintenance scheduling and history
   - Utilization reporting
   - Status management (Available, In Use, Maintenance)
   - Stock level monitoring

5. **Complaint Management**
   - **Worker Complaints**: Internal HR and workplace issues
   - **Customer Complaints**: Guest feedback and service issues
   - Priority-based resolution tracking
   - Assignment and escalation workflows
   - Direct work order creation from complaints
   - Unified complaint API with type distinction

6. **Real-time Messaging**
   - Direct messaging between users
   - Broadcast announcements
   - Real-time notifications via SignalR
   - Message history and read status
   - Conversation threading

7. **Procedure Library**
   - Standard operating procedures (SOPs)
   - Categorized procedure management
   - Version control and updates
   - Searchable knowledge base
   - Active/inactive status management

8. **Comprehensive Reporting**
   - Dashboard with key metrics
   - Asset depreciation reports
   - Work order performance analytics
   - Inventory utilization reports
   - Complaint analysis and trends

## 🛠️ Technology Stack

### Backend
- **ASP.NET Core 9.0** - Web API framework
- **Entity Framework Core 9.0** - ORM for data access
- **PostgreSQL** - Primary database
- **MediatR 13.1.0** - CQRS implementation
- **FluentValidation 12.1.0** - Input validation
- **JWT Authentication** - Secure API access
- **SignalR 9.0** - Real-time communication
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React 19.2.0** - Frontend framework
- **TypeScript 4.9.5** - Type-safe development
- **Material-UI 7.3.5** - Component library
- **TanStack Query 5.90.7** - Data fetching and caching
- **React Router 7.9.5** - Navigation
- **Axios** - HTTP client
- **SignalR Client 9.0.6** - Real-time updates
- **date-fns** - Date manipulation
- **Recharts** - Data visualization

### Desktop Application
- **Electron** - Cross-platform desktop wrapper
- **Windows, macOS, Linux** - Multi-platform support

## 📊 Database Schema

### Core Entities

```
Assets
├── Id, Name, AssetType, SerialNumber
├── PurchaseDate, PurchasePrice, CurrentValue (optional)
├── Status, Location, Description
├── DepreciationRate (optional)
└── Maintenance tracking fields

WorkOrders
├── Id, Title, Description, Priority, Status
├── AssetId (FK, optional), AssignedToUserId (FK, optional)
├── CreatedByUserId (FK), Dates
├── AssignedToUserName (flattened)
├── RequestedByUserName (flattened)
├── AssetName (flattened)
└── Notes and completion tracking

Users
├── Id, Username, Email, PasswordHash
├── FirstName, LastName, Role, IsActive
├── CreatedAt, LastLoginAt
└── PhoneNumber (optional)

Inventory
├── Id, Name, Model, SerialNumber, Category
├── Status, Location, Purchase information
├── Warranty and maintenance data
├── Description (optional)
└── Specifications and contact info

Messages
├── Id, Content, SenderId (FK)
├── ReceiverId (FK), SentAt
├── IsRead, MessageType
└── Group messaging support

Procedures
├── Id, Title, Description, Category
├── Steps, IsActive, Version
└── Creation and update tracking

WorkerComplaints
├── Id, Subject, Description, Priority
├── Status, Category, SubmittedAt
├── SubmittedByUserId (FK, optional)
├── Type ('worker')
└── Resolution information

CustomerComplaints
├── Id, Subject, Description, Priority
├── Status, Category, SubmittedAt
├── AssignedToUserId (FK, optional)
├── CustomerName (optional), CustomerEmail (optional)
├── Type ('customer')
└── Resolution information
```

## 🔐 Security Features

- **JWT Token Authentication** with configurable expiration
- **Role-based Authorization** (Admin, Manager, Worker)
- **Password Hashing** using secure algorithms
- **CORS Configuration** for cross-origin requests
- **Input Validation** with FluentValidation
- **SQL Injection Protection** via Entity Framework parameterization
- **Secure credential management** (gitignored configuration files)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/profile` - User profile

### Assets
- `GET /api/assets` - List all assets with pagination
- `GET /api/assets/{id}` - Get asset by ID
- `POST /api/assets` - Create new asset
- `PUT /api/assets/{id}` - Update asset
- `DELETE /api/assets/{id}` - Delete asset
- `GET /api/assets/search` - Search assets
- `GET /api/assets/reports/depreciation` - Depreciation report

### Work Orders
- `GET /api/workorders` - List work orders with pagination
- `GET /api/workorders/{id}` - Get work order by ID
- `POST /api/workorders` - Create work order
- `PUT /api/workorders/{id}` - Update work order
- `PUT /api/workorders/{id}/status` - Update status
- `PUT /api/workorders/{id}/assign` - Assign work order
- `GET /api/workorders/my-assignments` - User's assignments
- `GET /api/workorders/reports/summary` - Performance summary

### Users
- `GET /api/users` - List all users (Admin/Manager only)
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user (Admin only, requires username)
- `PUT /api/users/{id}` - Update user
- `PUT /api/users/{id}/change-password` - Change password (requires confirmPassword)
- `PUT /api/users/{id}/activate` - Activate user (Admin only)
- `PUT /api/users/{id}/deactivate` - Deactivate user (Admin only)

### Inventory
- `GET /api/inventory` - List inventory with pagination
- `GET /api/inventory/{id}` - Get inventory by ID
- `POST /api/inventory` - Create inventory entry
- `PUT /api/inventory/{id}` - Update inventory
- `PUT /api/inventory/{id}/status` - Update status
- `GET /api/inventory/maintenance-schedule` - Maintenance schedule
- `POST /api/inventory/{id}/maintenance` - Record maintenance

### Complaints
- `GET /api/complaints` - List all complaints (unified endpoint)
- `GET /api/complaints/{id}` - Get complaint by ID
- `POST /api/complaints` - Submit complaint (type: 'worker' or 'customer' in request body)
- `PUT /api/complaints/{id}/status` - Update complaint status
- `PUT /api/complaints/{id}/assign` - Assign complaint
- `GET /api/complaints/reports/summary` - Analytics summary

### Messages
- `GET /api/messages` - Get user messages
- `POST /api/messages/send` - Send message
- `PUT /api/messages/{id}/mark-as-read` - Mark as read
- `GET /api/messages/unread-count` - Unread count
- `GET /api/messages/conversation/{userId}` - Conversation history

### Procedures
- `GET /api/procedures` - List procedures
- `GET /api/procedures/{id}` - Get procedure by ID
- `POST /api/procedures` - Create procedure (Admin/Manager)
- `PUT /api/procedures/{id}` - Update procedure (Admin/Manager)
- `GET /api/procedures/categories` - Available categories
- `GET /api/procedures/search` - Search procedures

### Reports
- `GET /api/reports/dashboard` - Dashboard summary
- `GET /api/reports/assets/depreciation` - Asset depreciation
- `GET /api/reports/workorders/performance` - Work order analytics
- `GET /api/reports/inventory/utilization` - Inventory utilization
- `GET /api/reports/complaints/analysis` - Complaint analysis

## 🚀 Getting Started

### Prerequisites
- **.NET 9.0 SDK** or later
- **PostgreSQL** (version 12+ recommended)
- **Visual Studio 2022** or **VS Code**
- **Node.js 18+** (for frontend development)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HotelMiniERP/backend
   ```

2. **Update connection string** in `appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=HotelMiniERP_Dev;Username=postgres;Password=postgres"
     }
   }
   ```

3. **Run database migrations**:
   ```bash
   cd HotelMiniERP.Infrastructure
   dotnet ef database update --startup-project ../HotelMiniERP.API
   ```

4. **Build and run the API**:
   ```bash
   cd ../HotelMiniERP.API
   dotnet run
   ```

5. **Access Swagger documentation**: Navigate to `http://localhost:5000/swagger`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API URL** in `src/config/index.ts` if needed (default: http://localhost:5000/api)

4. **Start development server**
   ```bash
   npm start
   ```

5. **Access application**: Navigate to `http://localhost:3000`

### Default User Accounts

After database seeding:

- **Admin**: username: `admin`, password: `Admin@123`
- **Manager**: username: `manager`, password: `Manager@123`
- **Workers**: username: `worker1`/`worker2`, password: `Worker@123`

⚠️ **Change all default passwords in production!**

## 🔧 Development

### Adding New Features

1. **Domain**: Add entities in `HotelMiniERP.Domain/Entities`
2. **Application**: Create DTOs, Commands, Queries, and Validators
3. **Infrastructure**: Add repository implementations and configurations
4. **API**: Create controllers with proper authorization

### Important DTO Pattern

The backend uses **flattened DTOs** instead of nested objects:

```typescript
// ✅ Correct: Flattened properties
interface WorkOrder {
  assignedToUserName: string;  // NOT assignedToUser: User
  requestedByUserName: string; // NOT requestedByUser: User
  assetName: string;           // NOT asset: Asset
}
```

Frontend types must match this pattern to avoid compilation errors.

### ID Type Conversions

- Frontend uses **string IDs** (e.g., `user.id` is string)
- Backend expects **integer IDs** in DTOs
- Always convert when sending to backend: `Number(user.id)` or `parseInt(userId)`

### Database Migrations

```bash
# Add new migration
dotnet ef migrations add MigrationName --project HotelMiniERP.Infrastructure --startup-project HotelMiniERP.API

# Update database
dotnet ef database update --project HotelMiniERP.Infrastructure --startup-project HotelMiniERP.API

# Remove last migration (if not applied)
dotnet ef migrations remove --project HotelMiniERP.Infrastructure --startup-project HotelMiniERP.API
```

### Running Tests
```bash
dotnet test
```

## 📝 Current Implementation Status

### ✅ Fully Implemented
- User authentication and authorization
- Asset management with depreciation
- Work order creation and assignment
- Complaint submission and tracking (both worker and customer)
- Real-time messaging with SignalR
- Inventory tracking
- Procedure library
- Role-based access control
- Work order creation from assets and complaints
- Frontend/backend type alignment

### 🔄 In Progress
- Advanced reporting and analytics
- Email notifications
- File upload capabilities

### 📋 Planned
- Barcode/QR code generation
- Mobile app development
- Advanced audit trail
- Third-party integrations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, create an issue in this repository.

## 🔧 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Verify PostgreSQL is running
   - Check connection string in `appsettings.Development.json`
   - Ensure database exists: `psql -U postgres -l`

2. **Frontend compilation errors**
   - Ensure types match backend DTOs (flattened properties)
   - Convert IDs to numbers when sending to backend
   - Check that optional fields are handled correctly

3. **SignalR connection issues**
   - Verify backend is running on expected port
   - Check CORS configuration
   - Ensure SignalR hub is registered in backend

4. **JWT token errors**
   - Clear localStorage and login again
   - Verify JWT secret key is at least 256 bits
   - Check token expiration settings

See CONFIGURATION.md for detailed setup and troubleshooting guide.
