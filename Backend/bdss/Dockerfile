# Step 1: Use the official Maven image to build the application
# The Maven image also includes Java, so no need to install separately
FROM maven:3.9.4-eclipse-temurin-21 AS build

# Set working directory inside the container
WORKDIR /app

# Copy the pom.xml file and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy the rest of the project code
COPY src ./src

# Build the application (packaging it into a JAR file)
RUN mvn clean package -DskipTests

# Step 2: Use a light JDK runtime image to run the application
FROM eclipse-temurin:21-jre

# Set working directory inside the container
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port your Spring Boot application listens on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]