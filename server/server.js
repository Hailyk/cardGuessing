const express = require('express');
const http = require('http');
const socket = require('socket.io');
const data = require('./data.js');
const fs = require("fs");
const path = require("path");

const app = express();

const server = http.createServer(app);

const io = socket.listen(server);

app.use(express.static("../client"));

io.on('connection', function(socket, callback){
  socket.on('new user', function(callback){
    const indentifier = data.newUser();
    if (data.addSocketId(identifier, socket.id)) callback(identifier);
    else callback (null);
  });
  socket.on('identify', function(identifier, callback){
    if (data.addSocketId(identifier, socket.id)) callback(identifier);
    else callback (null);
  });
  socket.on('credit', function(callback){
    callback(data.getBalance());
  });
  socket.on('choice', function(guess, betAmount, callback){
    const winner = Math.floor(Math.random()*4);
    if (guess == winner){
      data.updateBalance(socket.id, data.getBalance(socket.id)+betAmount*2);
      data.incrementWins(socket.id);
    }
    else data.updateBalance(socket.id, data.getBalance(socket.id)-betAmount);
    callback({winnerCard:winner, isWinner: (guess == winner)});
  });
});

function setUpData(){
  data.readFile((error)=>{
    if (error) console.dir(error);
    else{
      console.log("read file");
      setInterval(()=>{
        data.updateFile(()=>{
          console.dir(error);
        });
      },60000);
    }
  });
}

app.get("/", function(req, res){
  fs.readFile(path.resolve(path.join(__dirname,'../client/index.html')),function(err, html){
        if(err) res.end(err);
        else{
            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write(html);
            res.end();
        }
    });
});

var host = process.env.HOST || 'localhost';
var port = process.env.PORT || '3000';
server.listen(port, host, function () {
  console.log("Hosting webpage");
  setUpData();
});
