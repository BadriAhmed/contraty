# Tiny analytics dashboard — single static page + nginx basic auth
# Serves analytics/index.html, fetches data from the Contraty backend API.

FROM nginx:1.27-alpine

ARG ANALYTICS_PASSWORD=contraty-admin-2026
ARG ANALYTICS_USER=contraty

# Generate htpasswd for HTTP Basic Auth (password baked at build time)
RUN apk add --no-cache openssl && \
    echo "${ANALYTICS_USER}:$(openssl passwd -apr1 ${ANALYTICS_PASSWORD})" > /etc/nginx/.htpasswd && \
    apk del openssl

COPY index.html /usr/share/nginx/html/index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
