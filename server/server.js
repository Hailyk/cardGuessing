const express = require('express');
const http = require('http');
const socket = require('socket.io');
const data = require('./data.js');
const auth = require('./auth.js');
const fs = require("fs");
const path = require("path");

const app = express();

const server = http.createServer(app);

const io = socket.listen(server);

app.use(express.static(__dirname + "/../client"));
app.use(express.static(__dirname + "/../client/adminPanel"));

io.on('connection', (socket)=>{
  socket.on('auth', (num, id, callback)=>{
    const name = auth.auth(num, id)
    if(name){
      const identifier = data.newUser(num, id, name);
      if (data.identify(identifier, socket.id)) callback(identifier, name);
      else callback (null);
    }
    else callback (null);
  });
  socket.on('identify', (identifier, callback)=>{
    const name = data.identify(identifier, socket.id);
    callback(name);
  });

  socket.on('credit', (id, callback)=>{
    callback(data.getBalance(id));
  });
  
  socket.on('send data', ()=>{
    updateAdmin();
  });
  
  socket.on('choice', (id, guess, betAmount, callback)=>{
    if(data.getBalance(id) - betAmount < 0){
      callback({winnerCard:-1, isWinner: false});
    }
    else{
      const winner = Math.floor(Math.random()*4);
      data.incrementClicks(id, guess, (guess == winner) );
      if (guess == winner){
        data.updateBalance(id, data.getBalance(id)+betAmount*2);
        data.incrementWins(id);
      }
      else data.updateBalance(id, data.getBalance(id)-betAmount);
      updateAdmin();
      callback({winnerCard:winner, isWinner: (guess == winner)});
    }
  });
  socket.on('set credit',(adminPassword,id,credit)=>{
    if(adminPassword === "!@#$SLUSD!@#$"){
      if(typeof credit !== 'number'){
        credit = parseInt(credit);
      }
      data.updateBalance(id,credit);
      updateAdmin();
    }
  })
});

function updateAdmin(){
  io.emit('send data', data.getData());
}

function setUpData(){
  data.readFile((error)=>{
    if (error) console.dir(error);
    else{
      console.log("read file");
      setInterval(()=>{
        data.updateFile(()=>{
          if (error) console.dir(error);
        });
      },8000);
    }
    auth.readFile((error)=>{
      if (error) console.dir(error);
    });
  });
}

app.get("/", (req, res)=>{
  fs.readFile(path.resolve(path.join(__dirname,'../client/index.html')),function(err, html){
        if(err) res.end(err);
        else{
            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write(html);
            res.end();
        }
    });
});

app.get('/adminpanel', (req,res)=>{
  fs.readFile(path.resolve(path.join(__dirname,'../client/adminPanel/adminPanel.html')),function(err, html){
        if(err) res.end(err);
        else{
            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write(html);
            res.end();
        }
    });
});

let host = process.env.IP || 'localhost';
let port = process.env.PORT || '3000';
server.listen(port, host, function () {
  console.log("Hosting webpage");
  setUpData();
});
