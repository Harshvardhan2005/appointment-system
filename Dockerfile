# Stage 1: Build the frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend and package frontend static files
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend
COPY backend/pom.xml ./
# Download dependencies first to cache them
RUN mvn dependency:go-offline

COPY backend/src ./src
# Copy frontend build to spring boot static directory
COPY --from=frontend-build /app/frontend/dist /app/backend/src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Setup the runtime environment
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
