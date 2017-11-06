#!/bin/sh

systemctl stop nginx

docker stop backend
docker stop frontend
docker rm -f backend
docker rm -f frontend

docker rmi bws-nginx:v1.0
docker rmi tassel-service:v1.1

./frontend/build.sh
./backend/build.sh

docker run -d --name backend -p 5000:5000 -v /root/bws/data/wwwroot:/app/wwwroot --link=mongodb:mongodb tassel-service:v1.1
docker run -d --name frontend -p 4200:4200 bws-nginx:v1.0

systemctl start nginx
