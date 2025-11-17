# Hotel Mini ERP - Configuration Guide

## Environment Setup

This project uses environment variables for configuration in both backend and frontend.

### Backend (.NET)

The backend uses `appsettings.json` and environment variables. Configuration is loaded in this order (later sources override earlier ones):

1. `appsettings.json` (base settings)
2. `appsettings.Development.json` (development overrides)
3. Environment variables
4. Command line arguments

#### Setup for Development

1. Copy the example file (already contains dev settings):
   ```bash
   # The appsettings.Development.json is already configured
   # Just update the database password if needed
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

#### Security Notes

⚠️ **IMPORTANT**: 
- `appsettings.Development.json` is gitignored and should NOT be committed
- Never commit production credentials
- Use Azure Key Vault or similar for production secrets

### Frontend (React)

The frontend uses `.env` files for configuration.

#### Setup for Development

1. Copy the example file:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Update `.env` with your local settings:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_TOKEN_STORAGE_KEY=hotelminierp_token
   REACT_APP_USER_STORAGE_KEY=hotelminierp_user
   ```

#### Available Variables

- **REACT_APP_API_URL** - Backend API base URL
- **REACT_APP_API_TIMEOUT** - API request timeout in milliseconds
- **REACT_APP_TOKEN_STORAGE_KEY** - LocalStorage key for auth token
- **REACT_APP_USER_STORAGE_KEY** - LocalStorage key for user data
- **REACT_APP_ENABLE_MOCK_DATA** - Enable mock data for development (true/false)
- **REACT_APP_ENABLE_DEBUG** - Enable debug logging (true/false)
- **REACT_APP_ITEMS_PER_PAGE** - Default pagination size
- **REACT_APP_MAX_FILE_SIZE** - Maximum file upload size in bytes

#### Usage in Code

```typescript
import config from './config';

// Access configuration
const apiUrl = config.api.url;
const itemsPerPage = config.ui.itemsPerPage;
```

#### Security Notes

⚠️ **IMPORTANT**:
- `.env` is gitignored and should NOT be committed
- All environment variables are embedded in the build
- Never put sensitive secrets in frontend environment variables
- Use the backend API for sensitive operations

## Quick Start

### Backend
```bash
cd backend/HotelMiniERP.API
dotnet run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Production Deployment

### Backend
- Use Azure App Service Configuration or environment variables
- Set `ASPNETCORE_ENVIRONMENT=Production`
- Configure connection strings and JWT secrets via platform settings

### Frontend
- Set environment variables in your build pipeline
- Create production `.env.production` file (gitignored)
- Build: `npm run build`

## Database Configuration

Default PostgreSQL connection:
- **Host**: localhost
- **Database**: HotelMiniERP_Dev
- **Username**: postgres
- **Password**: admin (change this!)
- **Port**: 5432

## Common Issues

### Backend can't connect to database
- Verify PostgreSQL is running: `pg_isready`
- Check connection string in `appsettings.Development.json`
- Verify database exists: `psql -U postgres -l`

### Frontend can't reach API
- Verify backend is running on correct port
- Check CORS settings in backend `Program.cs`
- Verify `REACT_APP_API_URL` in `.env` matches backend URL

### JWT token errors
- Ensure `Jwt:SecretKey` is at least 256 bits (32 characters)
- Verify same secret is used across all backend instances
- Check token expiration settings
