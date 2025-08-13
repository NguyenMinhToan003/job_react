FROM node:22.18.0

WORKDIR /app

# Copy file dependency trước
COPY package.json ./
RUN yarn install

# Copy toàn bộ source
COPY . .

# Expose port của Vite
EXPOSE 5173

# Chạy vite với host 0.0.0.0
CMD ["yarn", "dev", "--host", "0.0.0.0"]
