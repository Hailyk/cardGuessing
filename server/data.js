'use strict';

const fs = require('fs');
const path = require('path');

const datafile = path.resolve(path.join(__dirname,'data.json'));

const uuid = require('uuid/v4');

let users;

function readFile(callback){
  fs.readFile(datafile,'utf-8', function(error, data){
    if (error) callback(error);
    else{
      let users = data;
      callback();
    }
  });
}

function updateFile(callback){
  fs.writeFile(datafile, users, 'utf-8', function(error){
    callback(error);
  });
}

function generateIdentifier(){
  let id = uuid();
  while (findUserByIdentifier(id) != -1){
    id = uuid();
  }
  return id;
}

function newUser(){
  const id = generateIdentifier();
  users.push({
    id: id,
    socketId: null,
    balance: 10,
    wins:0
  });
  return id;
}

function updateBalance(socketId, newBalance){
  const i = findUser(socketId);
  if (i == -1) return;
  users[i].balance = newBalance;
}

function getBalance(socketId){
  const i = findUser(socketId);
  if (i == -1) return 0;
  return users[i].balance;
}

function incrementWins(socketId){
  const i = findUser(socketId);
  if (i == -1) return;
  users[i].wins++;
}

function addSocketId(identifier, socketId, callback){
  const i = findUserByIdentifier();
  if (i == -1) return false;
  else{
    users[i].socketId = socketId;
    return true;
  }
}

function findUser(socketId){
  for (let i = 0; i < users.length; i++){
    if (users[i].socketId == socketId) return i;
  }
}

function findUserByIdentifier(){
  for (let i = 0; i < users.length; i++){
    if (users[i].id == id) return i;
  }
  return -1;
}

exports.newUser = newUser;
exports.updateBalance = updateBalance;
exports.incrementWins = incrementWins;
exports.addSocketId = addSocketId;
exports.updateFile = updateFile;
exports.getBalance = getBalance;
exports.readFile = readFile;
