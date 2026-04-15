# TaskManager

A Spring Boot + React task management application with maker-checker workflow, JWT authentication, and MongoDB persistence.

## Features

- JWT-based authentication with refresh tokens
- Maker-checker approval workflow for tasks
- Role-based access control (USER, CHECKER)
- Audit logging for all operations
- Idempotency handling for write requests
- Pagination and caching
- Soft delete
- Production-ready health checks

## Tech Stack

- Backend: Spring Boot 3.5.13, Java 21, MongoDB, Spring Security, JWT
- Frontend: React, Axios, Vite
- Database: MongoDB

## Local Development

### Prerequisites
- Java 21+
- Node.js 18+
- MongoDB

### Backend
```bash
cd TaskManager
mvn spring-boot:run
```

### Frontend
```bash
cd task-manager-frontend
npm install
npm run dev
```

## Production Deployment

### Environment Variables
Set the following environment variables for production:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing (use a strong, random string)
- `CORS_ORIGINS`: Comma-separated list of allowed frontend origins

### Build and Run
```bash
# Build backend
mvn clean package -DskipTests
java -jar target/TaskManager-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# Build frontend
cd task-manager-frontend
npm run build
# Serve the build/ directory with nginx or another static server
```

### Health Check
- GET `/api/health` returns service status

## API Endpoints

- POST `/api/auth/login`
- POST `/api/auth/register`
- GET `/api/tasks` (paginated, user tasks)
- GET `/api/tasks/pending` (checkers only)
- POST `/api/tasks` (makers/users)
- PUT `/api/tasks/{id}`
- DELETE `/api/tasks/{id}`
- PUT `/api/tasks/{id}/approve` (checkers)
- PUT `/api/tasks/{id}/reject` (checkers)

## Security Notes

- Use HTTPS in production
- Rotate JWT secrets regularly
- Enable MongoDB authentication
- Use environment variables for secrets
- Enable CORS only for your frontend domain

## Monitoring

- Logs are written to `logs/taskmanager.log` in production
- Use `/api/health` for load balancer health checks
- Consider adding metrics (Micrometer + Prometheus) for deeper monitoring
