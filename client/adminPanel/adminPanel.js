'use strict'

const socket = io();

socket.emit('get data');

Vue.component('cell', {
    template: '#template',
    props: ['user']
});

let users = new Vue({
    el:"#data_area",
    data:{
        users:[]
    }
});

socket.on('send data', (data)=>{
    console.dir(data);
    updateCards(data);
});

function updateCards(data){
    users.users = data;
}
