# 1️⃣ Use Node 18 as the base image
FROM node:18-alpine

# 2️⃣ Set the working directory inside the container
WORKDIR /app

# 3️⃣ Copy dependency files first (to optimize Docker caching)
COPY package*.json ./

# 4️⃣ Install dependencies (only production ones for smaller size)
RUN npm install --only=production

# 5️⃣ Copy all project files into the container
COPY . .

# 6️⃣ Expose the port (Render uses this to connect)
EXPOSE 8000

# 7️⃣ Start the app using the start script
CMD ["npm", "start"]
