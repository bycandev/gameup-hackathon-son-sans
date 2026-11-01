FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY karakterler /usr/share/nginx/html/karakterler
COPY logo /usr/share/nginx/html/logo
EXPOSE 80
