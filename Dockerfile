# Step 1: Use Node.js 22 image as the base image
FROM node:22-slim AS build

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --frozen-lockfile

# Step 5: Copy the rest of your app's source code
COPY . .

# Step 6: Build your Vite app for production
RUN npm run build

# Step 7: Serve the app using an HTTP server
FROM nginx:alpine

# Step 8: Copy the built app from the build container to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Expose the port the app will run on
EXPOSE 8000

# Step 10: Start nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
