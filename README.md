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

## License

This project is proprietary software.