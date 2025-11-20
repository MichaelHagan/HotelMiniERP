# Hotel Mini ERP - Configuration Guide

## Environment Setup

This project uses environment variables for configuration in both backend and frontend.

### Backend (.NET 9.0)

The backend uses `appsettings.json` and environment variables. Configuration is loaded in this order (later sources override earlier ones):

1. `appsettings.json` (base settings)
2. `appsettings.Development.json` (development overrides)
3. Environment variables
4. Command line arguments

#### Setup for Development

1. The `appsettings.Development.json` is already configured:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=HotelMiniERP_Dev;Username=postgres;Password=postgres"
     },
     "Logging": {
       "LogLevel": {
         "Default": "Information",
         "Microsoft.AspNetCore": "Warning",
         "Microsoft.EntityFrameworkCore": "Information"
       }
     }
   }
   ```

2. Or use environment variables (optional):
   ```bash
   export ConnectionStrings__DefaultConnection="Host=localhost;Database=HotelMiniERP_Dev;Username=postgres;Password=yourpassword"
   export Jwt__SecretKey="YourSecretKeyHere"
   ```

#### Configuration Structure

- **ConnectionStrings:DefaultConnection** - PostgreSQL connection string
- **Jwt:SecretKey** - Secret key for JWT token generation (min 256 bits)
- **Jwt:Issuer** - JWT token issuer
- **Jwt:Audience** - JWT token audience
- **Jwt:ExpiryInDays** - Token expiration period
- **SignalR** - Real-time messaging hub configuration

#### Security Notes

⚠️ **IMPORTANT**: 
- `appsettings.Development.json` is gitignored and should NOT be committed
- Never commit production credentials
- Use Azure Key Vault or similar for production secrets
- Change default PostgreSQL password in production

### Frontend (React + TypeScript)

The frontend is built with Create React App and TypeScript.

#### Key Technologies
- **React 19.2.0** - UI framework
- **TypeScript 4.9.5** - Type safety
- **Material-UI 7.3.5** - Component library
- **TanStack Query 5.90.7** - Data fetching and caching
- **React Router 7.9.5** - Navigation
- **SignalR 9.0.6** - Real-time messaging
- **Axios** - HTTP client
- **date-fns** - Date utilities
- **Recharts** - Charts and graphs

#### API Configuration

The API URL is configured in the frontend codebase (no .env file needed):

```typescript
// frontend/src/config/index.ts
const API_BASE_URL = 'http://localhost:5000/api';
```

To change the API URL, update the config file directly.

#### Security Notes

⚠️ **IMPORTANT**:
- All API requests include JWT token in Authorization header
- Tokens are stored in localStorage
- Auto-logout on token expiration
- CORS is configured in backend for allowed origins

## Quick Start

### Backend
```bash
cd backend/HotelMiniERP.API
dotnet run
```
API runs on: http://localhost:5000

### Frontend
```bash
cd frontend
npm install  # First time only
npm start
```
Frontend runs on: http://localhost:3000

## Database Configuration

PostgreSQL connection (default):
- **Host**: localhost
- **Database**: HotelMiniERP_Dev
- **Username**: postgres
- **Password**: postgres (CHANGE IN PRODUCTION!)
- **Port**: 5432

### Database Migrations

```bash
cd backend/HotelMiniERP.Infrastructure
dotnet ef database update --startup-project ../HotelMiniERP.API
```

## Default User Accounts

After seeding the database:

1. **Admin Account**
   - Username: `admin`
   - Password: `Admin@123`
   - Email: admin@hotel.com
   - Role: Admin

2. **Manager Account**
   - Username: `manager`
   - Password: `Manager@123`
   - Email: manager@hotel.com
   - Role: Manager

3. **Worker Accounts**
   - Username: `worker1` / `worker2`
   - Password: `Worker@123`
   - Role: Worker

⚠️ **Change all default passwords in production!**

## Production Deployment

### Backend (.NET)
- Use Azure App Service Configuration or environment variables
- Set `ASPNETCORE_ENVIRONMENT=Production`
- Configure connection strings via platform settings
- Enable HTTPS
- Configure CORS for production domain
- Set strong JWT secret key

### Frontend (React)
- Update API base URL to production backend
- Build: `npm run build`
- Deploy `build/` folder to static hosting
- Configure CDN for performance
- Enable HTTPS

## Common Issues

### Backend can't connect to database
- Verify PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Check connection string in `appsettings.Development.json`
- Verify database exists: `psql -U postgres -l`
- Check PostgreSQL logs for connection errors

### Frontend can't reach API
- Verify backend is running: http://localhost:5000/swagger
- Check CORS settings in backend `Program.cs`
- Verify API URL in frontend config
- Check browser console for CORS errors

### JWT token errors
- Ensure `Jwt:SecretKey` is at least 256 bits (32 characters)
- Verify same secret is used across all backend instances
- Check token expiration settings
- Clear localStorage and login again

### SignalR connection fails
- Verify SignalR hub is registered in backend
- Check hub URL matches frontend configuration
- Ensure CORS allows SignalR connections
- Check browser console for connection errors

## Port Configuration

Default ports:
- **Backend API**: 5000 (HTTP), 5001 (HTTPS)
- **Frontend**: 3000
- **PostgreSQL**: 5432
- **SignalR Hub**: Same as API port

To change ports:
- **Backend**: Update `Properties/launchSettings.json`
- **Frontend**: Set PORT environment variable or update package.json scripts

## Environment Variables Reference

### Backend
- `ASPNETCORE_ENVIRONMENT` - Development/Production
- `ConnectionStrings__DefaultConnection` - Database connection
- `Jwt__SecretKey` - JWT signing key
- `Jwt__Issuer` - Token issuer
- `Jwt__Audience` - Token audience
- `Jwt__ExpiryInDays` - Token expiration

### Frontend
- No environment variables needed (config in code)
- Update `src/config/index.ts` for API URL changes
