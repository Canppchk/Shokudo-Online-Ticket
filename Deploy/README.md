# Shokudo-Online-Ticket
slides: [link](https://naistjp-my.sharepoint.com/personal/kohei_ichikawa_ms_ext_naist_jp/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fkohei%5Fichikawa%5Fms%5Fext%5Fnaist%5Fjp%2FDocuments%2F%E8%AC%9B%E7%BE%A9%E8%B3%87%E6%96%99%2FPBL2023&FolderCTID=0x012000AF3BAC58BFDAAF45840EFA0160BD60A9&view=0)

## Getting started
### Backend
```
cd backend
```
Build go module
```
go build .
```
Run backend server using nginx
```
https://www.youtube.com/watch?v=50LfgfveD_A&t=959s
```
```
https://www.digitalocean.com/community/tutorials/how-to-deploy-a-go-web-application-using-nginx-on-ubuntu-18-04
```
The MySQL server is automatically connected to the lab's server, and the API server is set up on the university's local network.

### Frontend
```
cd frontend
```
start app
```
docker build -t frontend .
```
mock api
```
docker run -d -p 3000:3000 frontend
```
