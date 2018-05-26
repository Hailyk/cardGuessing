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
    fs.writeFile(JSON.stringify(datafile), users, 'utf-8', function (error) {
        callback(error);
    });
}

function generateIdentifier(){
    let id = uuid();
    while (findUserByIdentifier(id) !== -1) {
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
        wins: 0,
    });
    return id;
}

function updateBalance(socketId, newBalance){
    const i = findUser(socketId);
    users[i].balance = newBalance;
}

function getBalance(socketId){
    const i = findUser(socketId);
    return users[i].balance;
}

function incrementWins(socketId){
    const i = findUser(socketId);
    users[i].wins++;
}

function addSocketId(identifier, socketId, callback){
    const i = findUserByIdentifier(identifier);
    if (i === -1) return false;
    else {
        users[i].socketId = socketId;
        return true;
    }
}

function findUser(socketId){
    for (let i = 0; i < users.length; i++) {
        if (users[i].socketId === socketId) return i;
    }
}

function findUserByIdentifier(identifier) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === identifier) return i;
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
