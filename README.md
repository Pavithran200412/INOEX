# Expense Tracker

This archive contains a minimal full-stack Expense Tracker:

- backend: Spring Boot application (H2 in-memory DB)
- frontend: React app (Material UI) that talks to backend at http://localhost:8080

How to run:

1. Backend:
   - cd backend
   - mvn spring-boot:run

2. Frontend:
   - cd frontend
   - npm install
     npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
     npm install axios
     npm install react-scripts
   - npm start

H2 console: http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:testdb)
