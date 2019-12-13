#!/bin/bash

chmod +x /home/ec2-user/nosa-cms/cron_ssl.sh
certonly --webroot --webroot-path=/var/www/html --email thientt@kyc.net.vn --agree-tos --no-eff-email --staging -d ttt.vaytieudungtheoluong247.com  -d www.ttt.vaytieudungtheoluong247.com;
docker-compose stop webserver;
mkdir dhparam;
sudo openssl dhparam -out /home/ec2-user/nosa-cms/dhparam/dhparam-2048.pem 2048;
rm /home/ec2-user/nosa-cms/nginx-conf/nginx.conf;
mv /home/ec2-user/nosa-cms/ssl.conf /home/ec2-user/nosa-cms/nginx_conf/;
docker-compose up -d --force-recreate --no-deps webserver;