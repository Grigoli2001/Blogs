FROM node:18-alpine

WORKDIR /app

RUN apk --no-cache add curl

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

# Step 8: Set the command to run the app
CMD ["npm", "run", "start:prod"]
