FROM node:18
WORKDIR /app
COPY package*.json ./
COPY patch-*.cjs ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 7860
ENV NODE_ENV=production
CMD ["npm", "start"]
