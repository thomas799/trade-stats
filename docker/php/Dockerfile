FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    mysql-client \
    && docker-php-ext-install pdo pdo_mysql \
    && docker-php-ext-enable pdo_mysql

WORKDIR /var/www/html

EXPOSE 9000

CMD ["php-fpm"]
