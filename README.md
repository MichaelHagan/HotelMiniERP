# Hotel Mini ERP System

A comprehensive Hotel Management ERP system built with ASP.NET Core Clean Architecture, featuring asset management, work orders, user management, equipment tracking, complaint handling, messaging, and comprehensive reporting capabilities.

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
   - Maintenance scheduling
   - Asset search and categorization

2. **Work Order Management**
   - Create, assign, and track work orders
   - Priority-based task management
   - Status tracking and completion monitoring
   - Performance reporting

3. **User Management & Team**
   - Role-based access control (Admin, Manager, Staff, Viewer)
   - User authentication with JWT
   - Profile management and password changes
   - Active/inactive user management

4. **Equipment Inventory**
   - Equipment tracking and categorization
   - Maintenance scheduling and history
   - Utilization reporting
   - Status management (Available, In Use, Maintenance)

5. **Complaint Management**
   - **Worker Complaints**: Internal HR and workplace issues
   - **Customer Complaints**: Guest feedback and service issues
   - Priority-based resolution tracking
   - Assignment and escalation workflows

6. **Real-time Messaging**
   - Direct messaging between users
   - Broadcast announcements
   - Real-time notifications via SignalR
   - Message history and read status

7. **Procedure Library**
   - Standard operating procedures (SOPs)
   - Categorized procedure management
   - Version control and updates
   - Searchable knowledge base

8. **Comprehensive Reporting**
   - Dashboard with key metrics
   - Asset depreciation reports
   - Work order performance analytics
   - Equipment utilization reports
   - Complaint analysis and trends
   - Financial summaries and ROI calculations

## 🛠️ Technology Stack

### Backend
- **ASP.NET Core 9.0** - Web API framework
- **Entity Framework Core 9.0** - ORM for data access
- **MediatR 13.1.0** - CQRS implementation
- **FluentValidation 12.1.0** - Input validation
- **JWT Authentication** - Secure API access
- **SignalR** - Real-time communication
- **SQL Server** - Database (configurable)
- **Swagger/OpenAPI** - API documentation

### Frontend (Planned)
- **React 18+** - Frontend framework
- **TypeScript** - Type-safe development
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **SignalR Client** - Real-time updates

### Desktop Application
- **Electron** - Cross-platform desktop wrapper
- **Windows, macOS, Linux** - Multi-platform support

## 📊 Database Schema

### Core Entities

```
Assets
├── Id, Name, AssetType, SerialNumber
├── PurchaseDate, PurchasePrice, CurrentValue
├── Status, Location, Description
└── Maintenance tracking fields

WorkOrders
├── Id, Title, Description, Priority, Status
├── AssetId (FK), AssignedToUserId (FK)
├── CreatedByUserId (FK), Dates
└── Notes and completion tracking

Users
├── Id, Username, Email, PasswordHash
├── FirstName, LastName, Role, IsActive
├── CreatedAt, LastLoginAt
└── PhoneNumber, Department

Equipment
├── Id, Name, Model, SerialNumber, Category
├── Status, Location, Purchase information
├── Warranty and maintenance data
└── Specifications and contact info

Messages
├── Id, Content, SenderUserId (FK)
├── RecipientUserId (FK), SentAt
├── IsRead, MessageType
└── Group messaging support

Procedures
├── Id, Title, Description, Category
├── Steps, EstimatedDuration
├── IsActive, Version
└── Creation and update tracking

Complaints (Worker/Customer)
├── Id, Subject, Description, Priority
├── Status, Category, SubmittedAt
├── AssignedToUserId (FK)
└── Contact and resolution information
```

## 🔐 Security Features

- **JWT Token Authentication** with configurable expiration
- **Role-based Authorization** (Admin, Manager, Staff, Viewer)
- **Password Hashing** using PBKDF2 with salt
- **CORS Configuration** for cross-origin requests
- **Input Validation** with FluentValidation
- **SQL Injection Protection** via Entity Framework parameterization

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
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/{id}` - Update user
- `PUT /api/users/{id}/change-password` - Change password
- `PUT /api/users/{id}/activate` - Activate user (Admin only)
- `PUT /api/users/{id}/deactivate` - Deactivate user (Admin only)

### Equipment
- `GET /api/equipment` - List equipment with pagination
- `GET /api/equipment/{id}` - Get equipment by ID
- `POST /api/equipment` - Create equipment entry
- `PUT /api/equipment/{id}` - Update equipment
- `PUT /api/equipment/{id}/status` - Update status
- `GET /api/equipment/maintenance-schedule` - Maintenance schedule
- `POST /api/equipment/{id}/maintenance` - Record maintenance

### Complaints
- `GET /api/complaints/worker` - Worker complaints
- `GET /api/complaints/customer` - Customer complaints
- `POST /api/complaints/worker` - Submit worker complaint
- `POST /api/complaints/customer` - Submit customer complaint
- `PUT /api/complaints/worker/{id}/status` - Update status
- `PUT /api/complaints/customer/{id}/status` - Update status
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
- `GET /api/reports/equipment/utilization` - Equipment utilization
- `GET /api/reports/complaints/analysis` - Complaint analysis
- `GET /api/reports/financial/summary` - Financial overview (Admin only)

## 🚀 Getting Started

### Prerequisites
- **.NET 9.0 SDK** or later
- **SQL Server** (LocalDB for development)
- **Visual Studio 2022** or **VS Code**
- **Node.js 18+** (for frontend development)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HotelMiniERP/backend
   ```

2. **Update connection string** in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HotelMiniERP;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

3. **Run database migrations**:
   ```bash
   cd HotelMiniERP.Infrastructure
   dotnet ef database update
   ```

4. **Build and run the API**:
   ```bash
   cd ../HotelMiniERP.API
   dotnet run
   ```

5. **Access Swagger documentation**: Navigate to `https://localhost:5253/swagger`

### Configuration

#### JWT Settings (appsettings.json)
```json
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-jwt-signing-key-here-minimum-32-characters-long",
    "Issuer": "HotelMiniERP",
    "Audience": "HotelMiniERPUsers",
    "ExpirationInDays": 7
  }
}
```

#### CORS Policy
```json
{
  "AllowedOrigins": [
    "http://localhost:3000",
    "https://localhost:3001"
  ]
}
```

## 🔧 Development

### Adding New Features

1. **Domain**: Add entities in `HotelMiniERP.Domain/Entities`
2. **Application**: Create DTOs, Commands, Queries, and Validators
3. **Infrastructure**: Add repository implementations and configurations
4. **API**: Create controllers with proper authorization

### Database Migrations

```bash
# Add new migration
dotnet ef migrations add MigrationName --project HotelMiniERP.Infrastructure --startup-project HotelMiniERP.API

# Update database
dotnet ef database update --project HotelMiniERP.Infrastructure --startup-project HotelMiniERP.API
```

### Running Tests
```bash
dotnet test
```

## 📝 Next Steps

### Immediate Implementation Tasks

1. **Complete CQRS Handlers**
   - Implement all MediatR commands and queries
   - Add proper validation and business logic
   - Create comprehensive unit tests

2. **Database Integration**
   - Set up Entity Framework migrations
   - Seed initial data (admin user, default categories)
   - Configure production database settings

3. **Authentication Enhancement**
   - Implement user registration workflow
   - Add password reset functionality
   - Set up refresh token mechanism

4. **Frontend Development**
   - Initialize React + TypeScript project
   - Set up Material-UI theme and components
   - Implement authentication context
   - Create responsive dashboard layout
   - Build CRUD interfaces for all modules

5. **Real-time Features**
   - Enhance SignalR hub with user groups
   - Add notification system
   - Implement live dashboard updates

### Future Enhancements

1. **Advanced Features**
   - File upload for asset images/documents
   - Barcode/QR code generation for assets
   - Advanced reporting with charts and graphs
   - Email notifications for critical events
   - Audit trail and activity logging

2. **Mobile Responsiveness**
   - Progressive Web App (PWA) features
   - Mobile-optimized interfaces
   - Offline capability for critical functions

3. **Integration Capabilities**
   - REST API for third-party integrations
   - Export capabilities (PDF, Excel, CSV)
   - Integration with external maintenance systems
   - Calendar integration for scheduling

4. **Performance Optimization**
   - Implement caching strategies
   - Add API rate limiting
   - Optimize database queries
   - Implement background job processing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@hotelmini-erp.com or create an issue in this repository.