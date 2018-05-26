'use strict';

const socket = io(); //todo: fill in url

let ready = true;

let cards = [];

socket.on("identify", (identifier) => {
    localStorage.setItem('auth', identifier.key);
});
socket.on("credit", (balance) => {
    onCredit(balance);
});
socket.on("choice", (data) => {
    onBet(data);
});

let overlay = new Vue({
    el:"#overlay",
    data:{
        active: false,
        message:"test",
    },
    methods:{
        disable_overlay: ()=>{
            if(ready === true) {
                for (let i = 0; i < 4; i++) {
                    cards[i].debug_text = "back";
                    cards[i].back = true;
                    cards[i].lose = false;
                    cards[i].win = false;
                }
                setOverlay(false);
            }
        },
    },
});

cards[0] = new Vue({
    el:"#card1",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
        debug:false,
    },
    methods:{
        card_click: card_click_constructor(1),
    },
});

cards[1] = new Vue({
    el:"#card2",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
        debug:false,
    },
    methods:{
        card_click: card_click_constructor(2),
    },
});

cards[2] = new Vue({
    el:"#card3",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
        debug:false,
    },
    methods:{
        card_click: card_click_constructor(3),
    },
});

cards[3] = new Vue({
    el:"#card4",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
        debug:false,
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

identify();

function card_click_constructor(cardNumber){
    return function(){
        console.log(cardNumber+" clicked");
        if(ready === true){
            ready = false;
            setOverlay(true);
            sendBet(cardNumber, 1);
        }
    }
}

// set or get how much credit is left, display only, unsecured
// @arg credit, number, amount of credit to display
function gsetcredit(credit){
    if (credit === undefined) {
        return credit.credit;
    }
    credit.credit = credit;
}

// set overlay status
// @arg status, boolean,
function setOverlay(status){
    if (typeof status === "boolean") {
        overlay.active = status;
    }
    else{
        throw new Error("Overlay status not a boolean");
    }
}

function setOverlayText(text){
    if (typeof text === "string") {
        overlay.message = text;
    }
    else{
        throw new Error("OverlayText not words");
    }
}

function setDebug(debug){
    if(typeof debug === "boolean"){
        for(let i=0;i<4;i++){
            cards[i].debug = debug;
        }
    }
    else{
        throw new TypeError("Debug need to be boolean value");
    }
}

function sendBet(guess,betAmount){
    if(typeof bet === "number" && typeof amount === "number"){
        socket.emit('choice', bet, amount, onBet);
    }
    else{
        throw new TypeError("sendBet arguments must be number");
    }
}

function onBet(result) {
    for (let i = 0; i < 4; i++) {
        if (i === result.winnerCard + 1) {
            cards[i].debugg_text = "win";
            cards[i].back = false;
            cards[i].lose = false;
            cards[i].win = true;
        }
        else {
            cards[i].debugg_text = "lose";
            cards[i].back = false;
            cards[i].lose = true;
            cards[i].win = false;
        }
    }
    if (result.isWinner) {
        setOverlayText("Winner!");
    }
    else {
        setOverlayText("Better Luck Next Time");
    }
    ready = true;
}

function getCredit(){
    socket.emit('credit', onCredit);
}

function onCredit(balance) {
    if (typeof balance === "number") {
        gsetcredit(balance);
    }
    else {
        throw new TypeError("Invalid event from server");
    }
}

function identify() {
    const key = getKey();
    console.log(key);
    if (key) {
        console.log("new user");
        socket.emit('new user', function (identifier) {
            console.log(identifier);
            setKey(identifier)
        });
    }
    else {
        socket.emit('identify', key, function (identifier) {
            setKey(identifier);
        });
    }
}

function setKey(id) {
    localStorage.setItem('id', id);
}

function getKey() {
    return localStorage.getItem("id");
}