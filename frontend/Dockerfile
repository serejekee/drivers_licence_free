FROM node:18-alpine

# Рабочая директория
WORKDIR /app

# Копируем package.json и lock-файл
COPY package*.json ./

# Устанавливаем зависимости (форсированно, чтобы обойти конфликты)
RUN npm install --legacy-peer-deps --force

# Копируем остальной код
COPY . .

# Открываем порт (нужен Vite)
EXPOSE 5173

# Запускаем Vite с доступом извне
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
