# Build stage
FROM node:20 AS build

WORKDIR /app

# NOTE: This Dockerfile uses an unconventional approach due to a known npm bug
# in Docker containers where "npm install" fails with "Exit handler never called!"
# We copy all files including pre-installed node_modules from the host as a workaround.
# This breaks layer caching but ensures the build succeeds.
# See: https://github.com/npm/cli/issues/4028

# Copy all files first (including node_modules from host)
COPY . .

# Attempt to install/update dependencies (may fail but won't break the build)
RUN npm install || true

# Build the app - this works because node_modules is already present from host
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
