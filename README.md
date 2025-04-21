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

### Production Environment Preparation

Before deploying to any platform:

1. Update environment settings in `backend/assembleally/settings.py`:
   ```python
   DEBUG = False
   SECRET_KEY = os.environ.get('SECRET_KEY', 'default-development-key')
   ALLOWED_HOSTS = ['furnitureheroes.co.uk', 'www.furnitureheroes.co.uk', 'your-app-domain.com']
   SECURE_SSL_REDIRECT = True
   SESSION_COOKIE_SECURE = True
   CSRF_COOKIE_SECURE = True
   SECURE_HSTS_SECONDS = 31536000  # 1 year
   SECURE_HSTS_INCLUDE_SUBDOMAINS = True
   SECURE_HSTS_PRELOAD = True
   ```

2. Build the React frontend for production:
   ```bash
   cd frontend
   npm run build
   ```

3. Collect static files for Django:
   ```bash
   cd backend
   python manage.py collectstatic
   ```

4. Generate Django migration files:
   ```bash
   python manage.py makemigrations
   ```

### Deployment Options

#### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

1. **Server Setup**:
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Install required dependencies
   sudo apt install -y nginx python3-pip python3-venv postgresql postgresql-contrib
   
   # Clone the repository
   git clone https://github.com/yourusername/furnitureheroes.git
   cd furnitureheroes
   
   # Create and activate virtual environment
   python3 -m venv venv
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

2. **Database Setup**:
   ```bash
   # Create PostgreSQL database and user
   sudo -u postgres psql
   CREATE DATABASE furnitureheroes;
   CREATE USER furnitureadmin WITH PASSWORD 'secure-password';
   GRANT ALL PRIVILEGES ON DATABASE furnitureheroes TO furnitureadmin;
   \q
   
   # Update environment variables
   export DATABASE_URL="postgresql://furnitureadmin:secure-password@localhost:5432/furnitureheroes"
   ```

3. **Configure Gunicorn (WSGI server)**:
   Create a file `/etc/systemd/system/gunicorn.service`:
   ```
   [Unit]
   Description=gunicorn daemon for FurnitureHeroes
   After=network.target
   
   [Service]
   User=ubuntu
   Group=www-data
   WorkingDirectory=/path/to/furnitureheroes/backend
   ExecStart=/path/to/furnitureheroes/venv/bin/gunicorn --access-logfile - --workers 3 --bind 0.0.0.0:8000 assembleally.wsgi:application
   Environment="DATABASE_URL=postgresql://furnitureadmin:secure-password@localhost:5432/furnitureheroes"
   Environment="SECRET_KEY=your-production-secret-key"
   
   [Install]
   WantedBy=multi-user.target
   ```

4. **Configure Nginx**:
   Create a file `/etc/nginx/sites-available/furnitureheroes`:
   ```
   server {
       listen 80;
       server_name furnitureheroes.co.uk www.furnitureheroes.co.uk;
   
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   
       location /admin {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   
       location /static/admin {
           alias /path/to/furnitureheroes/backend/staticfiles/admin;
       }
   
       location /static {
           alias /path/to/furnitureheroes/backend/staticfiles;
       }
   
       location /media {
           alias /path/to/furnitureheroes/backend/media;
       }
   
       location / {
           root /path/to/furnitureheroes/frontend/build;
           try_files $uri /index.html;
       }
   }
   ```

5. **SSL Configuration with Certbot**:
   ```bash
   # Install Certbot
   sudo apt install -y certbot python3-certbot-nginx
   
   # Get SSL certificate
   sudo certbot --nginx -d furnitureheroes.co.uk -d www.furnitureheroes.co.uk
   ```

6. **Start services**:
   ```bash
   sudo systemctl start gunicorn
   sudo systemctl enable gunicorn
   sudo systemctl restart nginx
   ```

#### Option 2: Platform as a Service (Heroku)

1. **Prepare the project**:
   Create a `Procfile` in the root directory:
   ```
   web: cd backend && gunicorn assembleally.wsgi --log-file -
   ```

2. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   heroku login
   ```

3. **Create Heroku app**:
   ```bash
   heroku create furnitureheroes
   ```

4. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Configure environment variables**:
   ```bash
   heroku config:set SECRET_KEY="your-production-secret-key"
   heroku config:set DEBUG=False
   ```

6. **Deploy the application**:
   ```bash
   git push heroku main
   ```

7. **Run migrations**:
   ```bash
   heroku run python backend/manage.py migrate
   ```

8. **Set up custom domain**:
   ```bash
   heroku domains:add furnitureheroes.co.uk
   heroku domains:add www.furnitureheroes.co.uk
   ```
   Add the DNS target records provided by Heroku to your domain registrar.

#### Option 3: Containerization (Docker)

1. **Create a Dockerfile**:
   ```dockerfile
   FROM node:18 as frontend-build
   WORKDIR /app/frontend
   COPY frontend/package*.json ./
   RUN npm install
   COPY frontend/ ./
   RUN npm run build
   
   FROM python:3.11
   WORKDIR /app
   COPY backend/requirements.txt .
   RUN pip install -r requirements.txt
   COPY backend/ ./backend/
   COPY --from=frontend-build /app/frontend/build ./frontend/build
   COPY run_prod.sh .
   RUN chmod +x run_prod.sh
   CMD ["./run_prod.sh"]
   ```

2. **Create a docker-compose.yml file**:
   ```yaml
   version: '3'
   
   services:
     db:
       image: postgres:14
       volumes:
         - postgres_data:/var/lib/postgresql/data/
       env_file:
         - ./.env
       environment:
         - POSTGRES_PASSWORD=postgres
         - POSTGRES_USER=postgres
         - POSTGRES_DB=furnitureheroes
   
     web:
       build: .
       depends_on:
         - db
       env_file:
         - ./.env
       environment:
         - DATABASE_URL=postgresql://postgres:postgres@db:5432/furnitureheroes
         - SECRET_KEY=your-production-secret-key
         - DEBUG=False
       ports:
         - "8000:8000"
   
     nginx:
       image: nginx:1.23
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx/conf.d:/etc/nginx/conf.d
         - ./frontend/build:/usr/share/nginx/html
         - ./backend/staticfiles:/usr/share/nginx/static
         - ./backend/media:/usr/share/nginx/media
         - ./certbot/conf:/etc/letsencrypt
         - ./certbot/www:/var/www/certbot
       depends_on:
         - web
   
     certbot:
       image: certbot/certbot
       volumes:
         - ./certbot/conf:/etc/letsencrypt
         - ./certbot/www:/var/www/certbot
       entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
   
   volumes:
     postgres_data:
   ```

3. **Create a run_prod.sh script**:
   ```bash
   #!/bin/bash
   cd backend
   python manage.py collectstatic --noinput
   python manage.py migrate
   gunicorn assembleally.wsgi:application --bind 0.0.0.0:8000
   ```

4. **Deploy with Docker**:
   ```bash
   docker-compose up -d
   ```

### Domain Configuration

To set up the furnitureheroes.co.uk domain:

1. **Domain Registration**: 
   - Purchase the domain from a reputable registrar (Namecheap, GoDaddy, Google Domains)
   - Make sure you have access to the domain's DNS settings

2. **DNS Configuration**:
   - For VPS/Docker deployment:
     - Create an A record pointing to your server's IP address
     - `furnitureheroes.co.uk` → [Your Server IP]
     - `www.furnitureheroes.co.uk` → [Your Server IP]
   - For Heroku deployment:
     - Create CNAME records pointing to your Heroku app
     - `furnitureheroes.co.uk` → [Your Heroku DNS Target]
     - `www.furnitureheroes.co.uk` → [Your Heroku DNS Target]

3. **SSL Certificate**:
   - For VPS: Use Certbot/Let's Encrypt as shown above
   - For Heroku: SSL is automatically managed with Heroku's paid plans
   - For Docker: Use the Certbot container as configured in docker-compose.yml

## License

This project is proprietary software.