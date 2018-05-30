'use strict'

let admin = false;
let adminPassword = "";


const socket = io();

socket.emit('send data');

Vue.component('cell', {
    template: '#template',
    props: ['user'],
    methods:{
        set: function(id, credit){
            if(typeof credit !== 'number'){
                parseInt(credit);
            }
            if(admin){
                socket.emit('set credit', adminPassword, id, credit);
            }
            else{
                socket.emit('send data');
            }
        },
    }
});

let users = new Vue({
    el:"#data_area",
    data:{
        users:[]
    },
});

socket.on('send data', (data)=>{
    console.dir(data);
    updateCards(data);
});

function updateCards(data){
    users.users = data;
}

function adminPanel(password){
    adminPassword = password;
    admin = true;
}
