# 🎓 Student Management System (Java Full Stack)

A production-ready, full-stack enterprise **Student Management System** built with **Java 17+ / Spring Boot 3** on the backend and **React.js + Vite** on the frontend, using **MySQL 8** for data persistence.

---

## 🚀 Technology Stack

### Backend
- **Language**: Java 17+ (JDK 24 compatible)
- **Framework**: Spring Boot 3.3.4
- **Web & REST**: Spring Web (Spring MVC)
- **ORM & Data Access**: Spring Data JPA & Hibernate
- **Database Driver**: MySQL Connector/J
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Email`, etc.)
- **Build Tool**: Apache Maven

### Frontend
- **Framework**: React.js 18+ (SPA)
- **Build Tool / Bundler**: Vite
- **HTTP Client**: Axios (with base URL and centralized error interceptors)
- **Routing**: React Router DOM (v6+)
- **Icons**: Lucide React
- **Styling**: Modern, responsive custom CSS design with stat cards, modals, and toasts

### Database
- **Engine**: MySQL 8.0
- **Connection Pool**: HikariCP (embedded in Spring Boot)
- **Database Name**: `student_management_db`

---

## 📁 Project Structure

```
student-management/
├── .gitignore
├── README.md
├── backend/
│   ├── src/main/java/com/sms/
│   │   ├── config/
│   │   │   └── WebConfig.java               # Global CORS configuration
│   │   ├── controller/
│   │   │   └── StudentController.java       # REST API endpoints
│   │   ├── dto/
│   │   │   ├── ApiResponse.java             # Standardized JSON response envelope
│   │   │   ├── StudentRequestDTO.java       # Validation & request payload
│   │   │   └── StudentResponseDTO.java      # Output data transfer object
│   │   ├── entity/
│   │   │   └── Student.java                 # JPA Entity (MySQL mapping)
│   │   ├── exception/
│   │   │   ├── EmailAlreadyExistsException.java
│   │   │   ├── GlobalExceptionHandler.java  # @RestControllerAdvice
│   │   │   └── ResourceNotFoundException.java
│   │   ├── repository/
│   │   │   └── StudentRepository.java       # Spring Data JPA Repository
│   │   ├── service/
│   │   │   ├── StudentService.java          # Service interface
│   │   │   └── impl/
│   │   │       └── StudentServiceImpl.java  # Business logic & transaction handling
│   │   └── StudentManagementApplication.java# Spring Boot main class
│   ├── src/main/resources/
│   │   └── application.properties           # MySQL connection and JPA configuration
│   ├── src/test/java/com/sms/
│   │   ├── StudentControllerTest.java       # Integration tests
│   │   └── StudentManagementApplicationTests.java
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Modal.jsx                    # Confirmation dialog
    │   │   ├── Navbar.jsx                   # Top header navigation
    │   │   ├── StatCards.jsx                # Metric cards (total, active, depts, GPA)
    │   │   └── Toast.jsx                    # Floating alerts
    │   ├── pages/
    │   │   ├── StudentDetails.jsx           # Individual profile card
    │   │   ├── StudentForm.jsx              # Add and edit student form
    │   │   └── StudentList.jsx              # Directory table, search, & filter
    │   ├── services/
    │   │   ├── api.js                       # Axios instance with interceptors
    │   │   └── studentService.js            # API methods (CRUD)
    │   ├── App.jsx                          # Root router & notification state
    │   ├── index.css                        # Modern UI styling
    │   └── main.jsx                         # React DOM bootstrap
    ├── index.html
    ├── package.json
    └── vite.config.js                       # Vite dev server & proxy settings
```

---

## 🛠️ Prerequisites & Setup

### 1. MySQL Setup
Make sure MySQL 8 is running on port `3306`:
```sql
CREATE DATABASE student_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update your database credentials in `backend/src/main/resources/application.properties` if different from `root`/`root`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_management_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
server.port=8085
```

---

## 🏃 Running the Application

### 1. Start Backend (Spring Boot)
Open a terminal in the `backend/` directory:
```bash
mvn spring-boot:run
```
> The backend will start on **http://localhost:8085**.

To run unit and integration tests:
```bash
mvn test
```

### 2. Start Frontend (React + Vite)
Open another terminal in the `frontend/` directory:
```bash
npm install
npm run dev
```
> The frontend will start on **http://localhost:5173**.

---

## 📡 REST API Documentation

Base URL: `http://localhost:8085/api/v1/students`

| Method | Endpoint | Description | Request Body | Status Code |
|:---|:---|:---|:---|:---|
| `GET` | `/api/v1/students` | Get all students (supports `?search=` and `?department=`) | None | `200 OK` |
| `GET` | `/api/v1/students/{id}` | Get student details by ID | None | `200 OK` / `404 Not Found` |
| `POST` | `/api/v1/students` | Register a new student | JSON (`StudentRequestDTO`) | `201 Created` / `400 Bad Request` / `409 Conflict` |
| `PUT` | `/api/v1/students/{id}` | Update student details | JSON (`StudentRequestDTO`) | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE`| `/api/v1/students/{id}` | Remove a student record | None | `200 OK` / `404 Not Found` |

### Sample JSON Request Payload:
```json
{
  "firstName": "Alex",
  "lastName": "Johnson",
  "email": "alex.johnson@university.edu",
  "department": "Computer Science",
  "phone": "+1-555-0142",
  "dateOfBirth": "2002-04-12",
  "enrollmentDate": "2023-09-01",
  "status": "ACTIVE",
  "gpa": 3.88
}
```
