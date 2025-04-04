# COMP 3133 Assignment 2
Created by Adam Simcoe - 101442161

Last Updated - April 4th, 2025

---

## App Purpose
This fullstack application uses a Node.js Express backend and an Angular frontend to provide users with a comprehensive employee management system.

Key features of this app include:

- User Signup and Login functionality with session-based authentication
- Role protected access to employee data
- CRUD operations for employees
-Integrated GraphQL API for data fetching
- Real-time form validation with user-friendly error feedback
- Live search and filtering of employee records based off department and/or designation
- Employee photo previews

---

## How to Setup and Run the App

### Backend Setup
Navigate to the root directory of the project and run the following Docker command to initialize and start your Docker containers using Docker Desktop:

```bash
docker-compose -p comp3133-assignment2 up --build -d
```

### Frontend Setup
Navigate to frontend/employee-management and run the following command in order to install all necessary dependencies:

```bash
npm install
```

Then, within the same directory run the following command in order to start the Angular application:


```bash
ng serve
```

### Run Steps
In order to view the application in your browser of choice, please navigate to the following url:

**URL:** `http://localhost:4200/`

Sample user data has been provided already in the database for easy testing and viewing of the application.

### Login Credentials

**Email:** `test1@example.com`
**Password:** `password123`