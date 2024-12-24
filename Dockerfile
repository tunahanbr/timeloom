# Stage 1: Build the Vite app
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the build using Nginx
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the container
EXPOSE 5173

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
