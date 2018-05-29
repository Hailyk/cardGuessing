'use strict'

let admin = false;

const socket = io();

socket.emit('get data');

Vue.component('cell', {
    template: '#template',
    props: ['user'],
    methods:{
        set: function(id, credit){
            if(typeof credit !== 'number'){
                parseInt(credit);
            }
            if(admin){
                socket.emit('set credit', id, credit);
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
