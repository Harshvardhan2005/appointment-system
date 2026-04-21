# Appointment & Queue Management System

A robust, real-world full-stack application built using Spring Boot and React.

## System Features
- **Book Appointments**: Customers can book specific time slots.
- **Live Queue Tracking**: A dynamic interface showing the current queue number and serving slot directly from the server.
- **Admin Panel**: Dashboard for staff to advance the queue and view scheduled appointments.
- **Premium Aesthetics**: Engineered frontend using glassmorphism and modern Vanilla CSS.

## 🚀 How to Run

### 1. Database Setup
The backend requires a MySQL database. If you have Docker installed, simply run:
```bash
docker-compose up -d
```
This will launch a MySQL instance with the database `appointment_db` on port 3306.
*(If you already have a local MySQL instance, make sure the user `root` with password `root` exists, or modify `backend/src/main/resources/application.properties`)*

### 2. Spring Boot Backend
Navigate to the `backend` directory.
Assuming you have Maven and Java 17+ installed:
```bash
# Using Maven wrapper (if present) or global Maven
mvn clean install
mvn spring-boot:run
```
The backend API will run on **http://localhost:8080**.

### 3. React Frontend
Navigate to the `frontend` directory in a new terminal instance:
```bash
npm install
npm run dev
```
The application UI will run at **http://localhost:5173**.

## API Endpoints (Postman)
Use the included `postman_collection.json` file in Postman to directly test all backend endpoints.

## Unit Testing
Run the comprehensive backend service unit tests:
```bash
mvn test
```
