# Stage 1: The building environment.
FROM node:10.17.0 AS react-build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
ARG REACT_APP_DIRMOD_API_DOMAIN
RUN yarn build

# Stage 2: The production environment.
FROM nginx:alpine
COPY --from=react-build /app/build /usr/share/nginx/html
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
