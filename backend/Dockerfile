FROM node:20-alpine

WORKDIR /app/backend

COPY package*.json .

RUN cd /app/frontend; \
    npm install --only=production

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]