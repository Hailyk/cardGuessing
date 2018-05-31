'use strict';

let ready = true;

let selected = -1;

let cards = [];

let stats = {
    totalTry: 0,
    totalWins: 0,
    clickArray:[0,0,0,0],
    winArray:[0,0,0,0],
}

let overlay = new Vue({
    el:"#overlay",
    data:{
        active: false,
        message:"Test",
        img: "",
    },
    methods:{
        disable_overlay: ()=>{
            if(ready === true) {
                for (let i = 0; i < 4; i++) {
                    cards[i].debug_text = "back";
                    cards[i].back = true;
                    cards[i].lose = false;
                    cards[i].win = false;
                    cards[i].chosen = false;
                }
                overlay.img = "";
                setOverlay(false);
                cards[selected] = false;
                selected = -1;
            }
        },
    },
});

let statsVue = new Vue({
    el:"#stats",
    data:{
        totalTry: 0,
        totalWins: 0,
        clickArray:[0,0,0,0],
        winArray:[0,0,0,0],
        winRatio:0,
    },
});

let instructions_overlay = new Vue({
    el:"#instructions_overlay",
    data:{
        active: true,
    },
    methods:{
        disable_overlay: ()=>{
            instructions_overlay.active = false;
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
        chosen: false,
    },
    methods:{
        card_click: card_click_constructor(0),
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
        chosen: false,
    },
    methods:{
        card_click: card_click_constructor(1),
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
        chosen: false,
    },
    methods:{
        card_click: card_click_constructor(2),
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
        chosen: false,
    },
    methods:{
        card_click: card_click_constructor(3),
    },
});

function card_click_constructor(cardNumber){
    return ()=>{
        console.log("card "+cardNumber+" clicked");
        if(ready === true){
            ready = false;
            cards[cardNumber].chosen = true;
            setOverlay(true);
            bet(cardNumber);
        }
    }
}

function updateStats(){
    statsVue.totalTry = stats.totalTry;
    statsVue.totalWins = stats.totalWins;
    statsVue.clickArray = stats.clickArray;
    statsVue.winArray = stats.winArray;
    statsVue.winArray = ((stats.totalWins / stats.totalTry)*100).toFixed(2);
}

function toast(message){
    document.querySelector('#toast').MaterialSnackbar.showSnackbar({message:message});
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

function bet(guess){
    if(typeof guess === 'number'){
        const winner = Math.floor(Math.random()*4);
        let isWinner = guess === winner;
        
        for (let i = 0; i < 4; i++) {
            if (i === winner) {
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
        if (isWinner) {
            toast("Winner!");
            stats.totalWins++;
            stats.winArray[guess]++;
        }
        else {
            toast("Better Luck Next Time");
        }
        stats.totalTry++;
        stats.clickArray[guess]++;
        updateStats();
        setTimeout(()=>{
            ready = true;
        }, 3000);
    }
}

function resetCard(){
    for (let i = 0; i < 4; i++) {
        cards[i].debug_text = "back";
        cards[i].back = true;
        cards[i].lose = false;
        cards[i].win = false;
        cards[i].chosen = false;
    }
}