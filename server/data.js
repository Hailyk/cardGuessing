'use strict';

const fs = require('fs');
const path = require('path');

const datafile = path.resolve(path.join(__dirname,'data.json'));

const uuid = require('uuid/v4');

let users = [];

function readFile(callback){
    fs.readFile(datafile, 'utf-8', function (error, data) {
        if (error) callback(error);
        else {
            users = JSON.parse(data);
            callback();
        }
    });
}

function updateFile(callback){
    fs.writeFile(datafile, JSON.stringify(users), 'utf-8', function (error) {
        callback(error);
    });
}

function generateIdentifier(){
    let id = uuid();
    while (findUser(id) !== -1) {
        id = uuid();
    }
    return id;
}

function newUser(num, studentId, name){
    const i = findUserByInfo(num, studentId);
    if (i > -1){
      return users[i].id;
    }
    const id = generateIdentifier();
    users.push({
        num: num,
        studentId: studentId,
        name: name,
        id: id,
        balance: 50,
        wins: 0,
        clicks: [0,0,0,0],
        clickwins: [0,0,0,0]
    });
    return id;
}

function updateBalance(id, newBalance){
    const i = findUser(id);
    if (i == -1) return null;
    users[i].balance = newBalance;
}

function getBalance(id){
    const i = findUser(id);
    if (i == -1) return null;
    return users[i].balance;
}

function incrementWins(id){
    const i = findUser(id);
    if (i == -1) return null;
    users[i].wins++;
}

function identify(identifier, socketId){
    const i = findUser(identifier);
    if (i === -1) return null;
    else {
        return users[i].name;
    }
}

function incrementClicks(id, card, winner){
    const i = findUser(id);
    if (i == -1 || card < 0 || card > 3) return;
    users[i].clicks[card]++;
    if (winner) users[i].clickwins[card]++;
}

function findUser(identifier) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === identifier) return i;
    }
    return -1;
}

function findUserByInfo(num, id){
  for (let i = 0; i < users.length; i++){
    if (users[i].studentId == id && users[i].num == num) return i;
  }
  return -1;
}

function getData(){
    return users;
}

exports.newUser = newUser;
exports.updateBalance = updateBalance;
exports.incrementWins = incrementWins;
exports.updateFile = updateFile;
exports.getBalance = getBalance;
exports.readFile = readFile;
exports.identify = identify;
exports.incrementClicks = incrementClicks;
exports.getData = getData;