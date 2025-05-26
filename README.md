# Full Stack Application

This is a full-stack web application featuring authentication, user roles, a user dashboard, and an admin panel.

## Features

- **Authentication & Authorization:**
  - User registration, login, and logout.
  - JWT-based authentication.
  - User roles: user and admin.

- **User Dashboard:**
  - View and edit user profile.
  - Display user-specific data such as items, orders, and history.

- **Admin Panel:**
  - View a list of all users.
  - Create, update, and delete users.
  - Manage other entities like items and products.

## Tech Stack

- **Frontend:**
  - React with Vite
  - React Router
  - Axios
  - TailwindCSS
  - Redux Toolkit for state management

- **Backend:**
  - FastAPI
  - PostgreSQL
  - SQLAlchemy and Alembic
  - Pydantic for schema validation
  - JWT-based authentication

- **Others:**
  - Docker & Docker-Compose

## Installation

1. **Clone the repository**
   ```bash
   git clone https://your-repo-link.git
   cd fullstack-app
   ```

2. **Running with Docker-Compose**
   Ensure you have Docker and Docker-Compose installed on your system.
   ```bash
   docker-compose up --build
   ```

3. **Database Setup**
   After the containers are running, you need to set up the database and create an admin user:
   
   ```bash
   # Apply database migrations
   docker-compose exec backend alembic upgrade head
   
   # Create admin user (username: admin, password: admin)
   docker-compose exec backend python create_admin.py
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API docs: `http://localhost:8000/docs`
   - Login with admin credentials: `admin` / `admin`
   - Admin panel: `http://localhost:5173/admin`

## Environment Variables

Create a `.env` file in the backend directory with the following content:

```
DATABASE_URL=postgresql://user:password@localhost:5432/fullstack_db
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
```

## Testing

To run tests for the FastAPI backend, navigate to the backend directory and run:
```bash
pytest
```

## License
[MIT](LICENSE)
