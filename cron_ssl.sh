#!/bin/bash

/usr/local/bin/docker-compose -f /home/ecw-user/nosa-cms/docker-compose.yml run certbot renew --dry-run \
&& /usr/local/bin/docker-compose -f /home/ecw-user/nosa-cms/docker-compose.yml kill -s SIGHUP webserver