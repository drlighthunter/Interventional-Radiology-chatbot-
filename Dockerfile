FROM node:18
WORKDIR /app
COPY package*.json ./
COPY patch-*.cjs ./
RUN npm install
COPY . .
RUN npm run build || echo "No build script"
EXPOSE 7860
ENV NODE_ENV=production
CMD ["npm", "start"]
