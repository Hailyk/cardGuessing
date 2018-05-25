const express = require('express');
const http = require('http');
const socket = require('socket.io');
const data = require('./data.js');

const app = express();

const server = http.createServer(app);

const io = socket.listen(server);

setUpData();

io.on('connection', function(socket){
  socket.on('new user', function(callback){
    const indentifier = data.newUser();
    if (data.addSocketId(identifier, socket.id)) callback(identifier);
    else callback (null);
  });
  socket.on('identify', function(identifier, callback){
    if (data.addSocketId(identifier, socket.id)) callback(identifier);
    else callback (null);
  });
  socket.on('credit', function(balance){
    updateBalance(balance);
  });
  socket.on('choice', function(guess, betAmount){
    const winner = Math.floor(Math.random()*4);
    if (guess == winner){
      updateBalance(socket.id, data.getBalance(socket.id)+betAmount*2);
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
