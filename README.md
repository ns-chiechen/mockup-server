# unified-auth-mockup-server
This is a mock up http server for unified auth.

## Run locally
```
npm install
DEBUG=mockup-server PORT=3000 npm start 
```
Try http://localhost:3000/apps to see some response.

## Build the image
```
docker build . -t chiehyu/server
```

## Run the server 
```
docker run --name mocker -p 3000:3000 -d chiehyu/server
```
Try http://localhost:3000/apps to see some response.
 

## Logs
```
docker logs -f mocker
```
