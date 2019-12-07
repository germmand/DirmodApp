# Stage 1: The building environment.
FROM node:10.17.0 AS react-build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
# ARG REACT_APP_DIRMOD_API_DOMAIN
RUN yarn build

# Stage 2: The production environment.
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=react-build /app/build .
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY env.sh .env ./
EXPOSE 80
RUN apk add --no-cache bash && chmod +x env.sh
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
