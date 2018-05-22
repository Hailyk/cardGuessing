'use strict';

let card_1 = new Vue({
    el:"#card1",
    data:{
        debug_text:"down",
    },
    methods:{
        card_click: card_click_constructor(1),
    },
});

let card_2 = new Vue({
    el:"#card2",
    data:{
        debug_text:"down",
    },
    methods:{
        card_click: card_click_constructor(2),
    },
});

let card_3 = new Vue({
    el:"#card3",
    data:{
        debug_text:"down",
    },
    methods:{
        card_click: card_click_constructor(3),
    },
});

let card_4 = new Vue({
    el:"#card4",
    data:{
        debug_text:"down",
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

