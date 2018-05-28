'use strict';

const fs = require('fs');
const path = require('path');

const datafile = path.resolve(path.join(__dirname,'students.json'));

const uuid = require('uuid/v4');

let students = [];

function readFile(callback){
    fs.readFile(datafile, 'utf-8', function (error, data) {
        if (error) callback(error);
        else {
            students = JSON.parse(data);
            callback();
        }
    });
}

function auth(num, id){
  for (let i = 0; i < students.length; i++){
    if (students[i].id ==id &&students[i].number == num)return students[i].name;
  }
  return null;
}

exports.readFile = readFile;
exports.auth = auth;
