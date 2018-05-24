'use strict';

const socket = io(); //todo: fill in url


socket.on("auth", (from, message)=>{
    console.log(message+" from "+from);
    localStorage.setItem('auth', message.key);
});
socket.on("credit", (from, message)=>{
    console.log(message+" from "+from);
});
socket.on("choice", (from, message)=>{
    console.log(message+" from "+from);
    for(let i = 1;i<=4;i++){
        let cardID = "card"+i;
        if(i == message.CardWinner+1){
            window[cardID].debugg_text = "win";
            window[cardID].back = false;
            window[cardID].lose = false;
            window[cardID].win = true;
        }
        else{
            window[cardID].debugg_text = "lose";
            window[cardID].back = false;
            window[cardID].lose = true;
            window[cardID].win = false;
        }
    }
    if(message.isWinner){
        
    }
});

let overlay = new Vue({
    el:"#overlay",
    data:{
        active: false,
        message:"",
    },
});

let card_1 = new Vue({
    el:"#card1",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
    },
    methods:{
        card_click: card_click_constructor(1),
    },
});

let card_2 = new Vue({
    el:"#card2",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
    },
    methods:{
        card_click: card_click_constructor(2),
    },
});

let card_3 = new Vue({
    el:"#card3",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
    },
    methods:{
        card_click: card_click_constructor(3),
    },
});

let card_4 = new Vue({
    el:"#card4",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
    },
    methods:{
        card_click: card_click_constructor(4),
    },
});

let credit = new Vue({
    el:"#credit",
    data:{
        credit:0,
    },
});

function card_click_constructor(cardNumber){
    return function(){
        //todo: what to do after selected card
    }
}

// set or get how much credit is left, display only, unsecured
// @arg credit, number, amount of credit to display
function gsetcredit(credit){
    if(credit == undefined){
        return credit.data.credit;
    }
    credit.data.credit = credit;
}

// set overlay status
// @arg status, boolean,
function setOverlay(status){
    if(typeof status == "boolean"){
        overlay.data.active = status;
    }
    else{
        throw new Error("Overlay status not a boolean");
    }
}

function setOverlayText(text){
    if(typeof text == "Text"){
        overlay.data.active = text;
    }
    else{
        throw new Error("OverlayText not words");
    }
}