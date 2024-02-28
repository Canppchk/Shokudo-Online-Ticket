# How to deploy in server

## Backend
```
cd backend
```
Build go module
```
go build .
./backend
```
Install Nginx
```
sudo apt-get install nginx
```
Allow Firewall
```
sudo ufw app list
sudo ufw allow "Nginx Full"
sudo ufw reload
sudo ufw enable
sudo ufw status
```
#### Setup Reverse Proxy
change working directory to Nginx sites-available directory
```
cd /etc/nginx/sites-available/
```
Create a new file with the name of the domain on which you wish to expose your application.
```
sudo vi backend
```
Coppy this to backend
```
server {
    listen 80;
    listen [::]:80;

    location / {
        proxy_pass http://localhost:8080;
    }
}
```
Create a symlink of this Nginx configuration in the sites-enabled 
```
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/backend
```
Remove default sites-enabled
```
cd ../sites-enabled/
sudo rm default
```
Reload Nginx configurations
```
sudo nginx -s reload
```
#### Creating a Systemd Unit File
```
sudo vi /lib/systemd/system/goweb.service
```
Coppy this to goweb.service
```
[Unit]
Description=goweb

[Service]
Type=simple
Restart=always
RestartSec=5s
ExecStart=/home/dev/Shokudo-Online-Ticket-main/backend/backend

[Install]
WantedBy=multi-user.target
```
Start service and check status
```
sudo service goweb start
sudo service goweb status
```
#### Reference
```
https://www.youtube.com/watch?v=50LfgfveD_A&t=959s
```
```
https://www.digitalocean.com/community/tutorials/how-to-deploy-a-go-web-application-using-nginx-on-ubuntu-18-04
```

## Frontend
```
cd frontend
```
Build frontend image
```
docker build -t frontend .
```
Run docker container with expose port 3000
```
docker run -d -p 3000:3000 frontend
```
