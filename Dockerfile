# Build stage
FROM node:20 AS build

WORKDIR /app

# Copy all files first (including node_modules from host if exists)
COPY . .

# Install dependencies using npm
RUN npm install || true

# Build the app
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
