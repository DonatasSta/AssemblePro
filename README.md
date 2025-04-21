# FurnitureHeroes

A comprehensive UK-focused marketplace platform connecting furniture assembly service providers with customers, specializing in local service delivery and transparent pricing.

## Tech Stack

- **Frontend**: React.js with Bootstrap for UI
- **Backend**: Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL
- **Design**: Responsive web design with UK-focused style
- **Architecture**: RESTful API

## Development Setup

### Prerequisites

- Node.js (v18+)
- Python (v3.11+)
- PostgreSQL

### Running the Application

To start the application in development mode:

```bash
bash run.sh
```

This will:
- Start the Django backend server on port 8000
- Start the React dev server on port 5000
- Apply any pending database migrations

The application will be accessible at http://localhost:5000

### Testing

To run all tests (frontend and backend):

```bash
bash run_tests.sh
```

#### Frontend Tests

Frontend tests use Jest and React Testing Library. To run only frontend tests:

```bash
cd frontend
npm test
```

For linting:

```bash
cd frontend
npm run lint
```

To automatically fix linting issues:

```bash
cd frontend
npm run lint:fix
```

For prettier formatting:

```bash
cd frontend
npm run format
```

#### Backend Tests

Backend tests use pytest. To run backend tests:

```bash
cd backend
pytest
```

### Code Quality Tools

#### Frontend

- **ESLint**: Static code analysis tool to identify problematic patterns
- **Prettier**: Code formatter to ensure consistent style
- Configuration files:
  - `.eslintrc.json`
  - `.prettierrc`

#### Backend

- **Pytest**: Testing framework
- **Django Test Client**: For API testing
- Configuration files:
  - `pytest.ini`

### CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- Automatically runs tests for pull requests to `main` and `develop` branches
- Checks code formatting and linting
- Deploys to production on merges to `main` branch

## Features

- User registration and authentication
- Profile management (assembler vs customer)
- Service listing creation and browsing
- Project listing creation and browsing
- Messaging between users
- Project assignment system
- Review and rating system
- UK-focused location and currency (£)

## Contributing

1. Create feature branches from `develop`
2. Ensure all tests pass before submitting a pull request
3. Follow the code style guidelines
4. Submit pull requests to the `develop` branch

## Deployment

### Production Environment Setup

For deploying the application to production:

1. Set `DEBUG = False` in `backend/assembleally/settings.py`
2. Enable the HTTPS settings in `backend/assembleally/settings.py`:
   ```python
   SECURE_SSL_REDIRECT = True
   SESSION_COOKIE_SECURE = True
   CSRF_COOKIE_SECURE = True
   SECURE_HSTS_SECONDS = 31536000  # 1 year
   SECURE_HSTS_INCLUDE_SUBDOMAINS = True
   SECURE_HSTS_PRELOAD = True
   ```
3. Generate a new secret key and set it as an environment variable
4. Configure proper CORS settings by specifying exact origins

### Domain Configuration

To set up the furnitureheroes.co.uk domain:

1. **Domain Registration**: 
   - Ensure the domain is properly registered with a domain registrar.
   - Verify ownership and access to DNS management.

2. **DNS Configuration**:
   - Create an A record pointing to your server's IP address:
     - `furnitureheroes.co.uk` → [Your Server IP]
     - `www.furnitureheroes.co.uk` → [Your Server IP]
   - Set appropriate TTL values (Time to Live)

3. **SSL Certificate**:
   - Obtain an SSL certificate for your domain (Let's Encrypt is a free option)
   - Set up your web server (Nginx/Apache) to use the certificate
   - Configure your web server to proxy requests to your Django/React application

4. **Application Settings**:
   - The domain is already added to `ALLOWED_HOSTS` in Django settings
   - Ensure the frontend is properly built for production with `npm run build`
   - Serve static files correctly in production

5. **Testing the Domain**:
   - Verify that both HTTP and HTTPS versions work correctly
   - Check that redirects from HTTP to HTTPS work
   - Test on multiple devices and browsers

Remember to update the `.env` file with production values when deploying.

## License

This project is proprietary software.