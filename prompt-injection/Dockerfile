# =============================================================================
# Stage 1 — Build
# Compiles the Spring Boot application and produces the executable JAR.
# =============================================================================
FROM gradle:8.5-jdk17 AS build

WORKDIR /app

# Copy dependency definitions first to leverage Docker layer caching.
# If build.gradle and settings.gradle have not changed, this layer is reused
# and Gradle does not re-download dependencies on every build.
COPY build.gradle settings.gradle ./
COPY gradle ./gradle

RUN gradle dependencies --no-daemon || true

# Copy the rest of the source code and build the JAR.
COPY src ./src
RUN gradle bootJar --no-daemon

# =============================================================================
# Stage 2 — Runtime
# Copies only the JAR into a minimal JRE image. The full JDK and Gradle are
# not included in the final image, keeping it small and reducing attack surface.
# =============================================================================
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Create a non-root user to run the application.
# Running as root inside a container is a security risk.
RUN groupadd --system appgroup && useradd --system --gid appgroup appuser

# Copy the JAR from the build stage.
# Fixed name used here for clarity and predictability.
# Alternative (version-agnostic wildcard): COPY --from=build /app/build/libs/*.jar app.jar
COPY --from=build /app/build/libs/prompt-injection-0.0.1-SNAPSHOT.jar app.jar

RUN chown appuser:appgroup app.jar
USER appuser

# The port the Spring Boot app listens on.
# Must match SERVER_PORT in your .env file.
EXPOSE ${SERVER_PORT:-8081}

ENTRYPOINT ["java", "-jar", "app.jar"]