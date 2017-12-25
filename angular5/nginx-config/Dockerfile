FROM nginx:1.12

WORKDIR /etc/nginx

COPY dist /etc/nginx/html
COPY nginx.conf /etc/nginx/
COPY mime.types /etc/nginx/

EXPOSE 4200