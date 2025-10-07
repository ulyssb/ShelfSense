# Environment Variables Configuration

This document explains how to configure the frontend and backend using environment variables.

## Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Backend Server Configuration
BACKEND_HOST=localhost
BACKEND_PORT=5001

# Alternative: Use PORT (standard for many hosting platforms)
# PORT=5001

# AI Service Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Environment
NODE_ENV=development
```

### Backend Variables

- `BACKEND_HOST`: The host address for the backend server (default: localhost)
- `BACKEND_PORT`: The port for the backend server (default: 5001)
- `PORT`: Alternative port variable (used by many hosting platforms)
- `OPENAI_API_KEY`: Your OpenAI API key for AI services
- `NODE_ENV`: Environment mode (development, production, etc.)

## Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# Frontend Server Configuration
FRONTEND_HOST=localhost
FRONTEND_PORT=3000

# Backend API Configuration
BACKEND_URL=http://localhost:5001

# Client-side Environment Variables (Vite requires VITE_ prefix)
VITE_BACKEND_URL=http://localhost:5001
VITE_API_URL=http://localhost:5001
```

### Frontend Variables

- `FRONTEND_HOST`: The host address for the frontend server (default: localhost)
- `FRONTEND_PORT`: The port for the frontend server (default: 3000)
- `BACKEND_URL`: Backend URL for Vite proxy configuration
- `VITE_BACKEND_URL`: Backend URL accessible in client-side code
- `VITE_API_URL`: Alternative API URL for client-side code

## Usage Examples

### Development
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev
```

### Production
```bash
# Backend
BACKEND_HOST=0.0.0.0 BACKEND_PORT=8080 npm start

# Frontend
FRONTEND_PORT=3000 npm run build
```

### Docker/Deployment
```bash
# Set environment variables in your deployment platform
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8080
FRONTEND_PORT=3000
VITE_BACKEND_URL=https://your-backend-domain.com
```

## Notes

1. **Vite Environment Variables**: Client-side environment variables must be prefixed with `VITE_`
2. **Fallback Values**: All variables have sensible defaults if not provided
3. **Security**: Never commit `.env` files to version control
4. **Production**: Use your hosting platform's environment variable configuration
