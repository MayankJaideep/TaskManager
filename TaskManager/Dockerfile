# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jre-slim

# Set the working directory
WORKDIR /app

# Copy the jar file into the container
COPY target/TaskManager-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Make port 8080 available to the world outside this container
# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
