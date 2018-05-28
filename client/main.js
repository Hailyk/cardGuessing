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
                }
                overlay.img = "";
                setOverlay(false);
            }
        },
    },
});

let instructions_overlay = new Vue({
    el:"#instructions_overlay",
    data:{
        active: false,
    },
    methods:{
        disable_overlay: ()=>{
            instructions_overlay.active = false;
        },
    },
});

let overlay_bet = new Vue({
    el:"#overlay_bet",
    data:{
        active: false,
        message: "How much do you want to bet your card is the winner? ($1 to $1000)",
        cardClicked: 0,
    },
    methods:{
        disable_overlay: ()=>{
            let betAmount = parseFloat(document.getElementById('bet').value);
            if (isNaN(betAmount) || betAmount < 1 || betAmount > 1000){
              document.getElementById('bet').value = "";
                overlay_bet.message = "You didn't put in a bet between $1 and $1000!";
            }
            else{
              overlay_bet.active = false;
              overlay_bet.message = "How much do you want to bet your card is the winner? ($1 to $1000)";
              sendBet(overlay_bet.cardClicked, betAmount);
            }

        },
    },
});

let overlay_login = new Vue({
    el:"#overlay_login",
    data:{
        active: true,
        message: "Log in using your number from Petersen's attendance sheet and your student id.",
        button: "Submit",
    },
    methods:{
      submit_login: ()=>{
        overlay_login.button = "Verifying...";
        let number = parseInt(document.getElementById("stu_num").value);
        let studentId = parseInt(document.getElementById("stu_id").value);
        if (isNaN(number)|| isNaN(studentId)){
          overlay_login.button = "Submit";
          overlay_login.message = "You failed to input numbers for at least one of the two fields."

          document.getElementById("stu_num").value = "";
          document.getElementById("stu_id").value = "";
        }
        else{
          socket.emit("auth", number, studentId, (identifier, name)=>{
            console.log(identifier);
            if (!identifier){
              overlay_login.button = "Submit";
              overlay_login.message = "Incorrect number or student ID."

              document.getElementById("stu_num").value = "";
              document.getElementById("stu_id").value = "";
            }
            else{
              setKey(identifier);
              overlay_login.active = false;
              logged_in.message = "Logged in as " + name + ". Click here to log out.";

              socket.emit("credit", (balance)=>{
                  gsetcredit(balance);
                  document.getElementById("stu_num").value = "";
                  document.getElementById("stu_id").value = "";

                  instructions_overlay.active = true;
              });
            }

          })
        }
      },
    },
});

let logged_in = new Vue({
  el:"#logged_in",
  data: {
    message: "Not logged in.",
  },
  methods:{
    logout: ()=>{
      socket.emit("log out", ()=>{
        setKey(null);
        overlay_login.active = true;
        logged_in.message = "Not logged in.";
        overlay_login.message = "Log in using your number from Petersen's attendance sheet and your student id.";
        overlay_login.button = "Submit";
        credit.credit = 0;
      });
    },
  }
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
    },
    methods:{
        card_click: card_click_constructor(3),
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
    return ()=>{
        console.log(cardNumber+" clicked");
        if(ready === true){
            ready = false;
            overlay_bet.cardClicked = cardNumber;
            overlay_bet.active = true;
        }
    }
}

// set or get how much credit is left, display only, unsecured
// @arg credit, number, amount of credit to display
function gsetcredit(balance){
    if (balance === undefined) {
        return credit.credit;
    }
    credit.credit = balance;
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

function setOverlayImage(winner){
  if (winner) overlay.img = "youwin.png";
  else overlay.img = "youlose.png";
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
    setOverlay(true);
    if(typeof guess === "number" && typeof betAmount === "number"){
        socket.emit('choice', guess, betAmount, onBet);
    }
    else{
        throw new TypeError("sendBet arguments must be number");
    }
}

function onBet(result) {
    for (let i = 0; i < 4; i++) {
        if (i === result.winnerCard) {
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
        setOverlayImage(true);
    }
    else {
        setOverlayText("Better Luck Next Time");
        setOverlayImage(false);
    }
    socket.emit('credit', function(balance){
      gsetcredit(balance);
    });
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
      socket.emit('identify', key, function (name) {
        if (name){
          socket.emit("credit", (balance)=>{
              gsetcredit(balance);
              overlay_login.active = false;
              logged_in.message = "Logged in as " + name + ". Click here to log out.";
              instructions_overlay.active = true;
          });

        }

      });
    }
}

function setKey(id) {
    localStorage.setItem('id', id);
}

function getKey() {
    return localStorage.getItem("id");
}
