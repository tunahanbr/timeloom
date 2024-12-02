# Step 1: Build the app using Node.js
FROM node:22-alpine AS build

WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) for installing dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Build the Vite project (adjust for your project build command)
RUN npm run build

# Step 2: Set up Nginx to serve the built app
FROM nginx:alpine

# Copy the build output from the previous stage to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
#COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80