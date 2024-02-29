# How to deploy in server
## Setup DB
```
sudo mkdir /var/lib/mysql-data
sudo chown $USER:$USER /var/lib/mysql-data
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -v /var/lib/mysql-data:/var/lib/mysql -d mysql
```
Create sot DB
```
CREATE DATABASE IF NOT EXISTS sot;
USE sot;
```
Create Food TABLE
```
CREATE TABLE IF NOT EXISTS Food (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Meal VARCHAR(255) NOT NULL,
    Detail TEXT,
    Stock INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Picture LONGTEXT
);
```
Add sample data to Food TABLE
```
INSERT INTO Food (Name, Meal, Detail, Stock, Price, Picture) VALUES
('Grilled Chicken', 'Dinner', 'Delicious grilled chicken with herbs', 20, 12.99, 'base64-encoded-image-string'),
('Vegetable Pasta', 'Lunch', 'Healthy vegetable pasta with a light sauce', 15, 8.50, 'base64-encoded-image-string'),
('Beef Burger', 'Lunch', 'Juicy beef burger with cheese and lettuce', 10, 11.00, 'base64-encoded-image-string'),
('Seafood Salad', 'Dinner', 'Fresh seafood salad with shrimp and lemon dressing', 12, 15.00, 'base64-encoded-image-string');
```
Create Ticket TABLE
```
CREATE TABLE IF NOT EXISTS Ticket (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FoodId INT,
    Date DATE NOT NULL,
    Status VARCHAR(255) NOT NULL,
    Owner VARCHAR(255), -- Assuming you want to add it directly rather than modifying later
    FOREIGN KEY (FoodId) REFERENCES Food(Id)
);
```
JOIN query to fetch ticket details along with food information
```
SELECT Ticket.Id, Food.Name AS Food_name, Food.Meal, Food.Price, Food.Picture, Ticket.Date, Ticket.Status, Ticket.Owner
FROM Ticket
JOIN Food ON Ticket.FoodId = Food.Id;
```
Create User TABLE
```
CREATE TABLE IF NOT EXISTS User (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE, -- Assuming Email should be unique
    Password VARCHAR(255) NOT NULL,
    Role BOOLEAN NOT NULL -- TRUE for admin, FALSE for customer
);
```
Add sample user to User TABLE
```
# Role: true represents "admin", while false represents "customer".
INSERT INTO User (Name, Email, Password, Role) VALUES
('Admin', 'admin@naist.com', 'password', TRUE),
('Papon', 'papon@naist.com', 'password', FALSE),
('Yonekura', 'yonekura@naist.com', 'password', FALSE),
('Haruto', 'haruto@naist.com', 'password', FALSE),
('Indira', 'indira@naist.com', 'password', FALSE);
```
Coppy Deploy folder to server
```
scp Shokudo-Online-Ticket-main.zip dev@163.221.29.107:~/
```
Reset all TABLE
```
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE User;
TRUNCATE TABLE Ticket;
TRUNCATE TABLE Food;
SET FOREIGN_KEY_CHECKS = 1;
```
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
### Setup Reverse Proxy
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
### Creating a Systemd Unit File
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
### Reference
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
