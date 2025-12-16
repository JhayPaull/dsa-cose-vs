# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app

# Create uploads directory with proper permissions
RUN mkdir -p /app/uploads/slider-images
RUN chown -R nextjs:nodejs /app/uploads

USER nextjs

# Expose port 8080 for the application
EXPOSE 8080

# Start the application
CMD ["npm", "run", "serve"]