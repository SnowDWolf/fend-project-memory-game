/*
 * Create a list that holds all of your cards
 */
let cardNodes = document.querySelectorAll('.card'); 
let cardArr = Array.from(cardNodes);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
let deckSpace = document.querySelector('.deck');
shuffle(cardArr);
for (let i = 0; i < cardArr.length; i++) {
    deckSpace.appendChild(cardArr[i]);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let counter = 0;
document.querySelector('.moves').innerHTML = counter;
let queueArr = new Array();
let secCount = 0;
let minCount = 0;
let matchedCards = new Array();
let timeState = false;
let sec = 0;
var startTime = '';

function flip(e, cardClass) {
    if(cardClass !== 'card open show'){
        e.setAttribute('class','card open show');
        addToQueue(e);
    }
}

function addToQueue(e) {
    if(queueArr.length < 2){
        queueArr.push(e);
        counter++;
        document.querySelector('.moves').innerHTML = counter;
    }
}

function lockInPlace(e) {
    queueArr[0].setAttribute('class', 'card match');
    queueArr[1].setAttribute('class', 'card match');
    if(matchedCards.length < 15) {
        matchedCards.push(queueArr[0]); 
        matchedCards.push(queueArr[1]); 
    }
    queueArr = [];
}

function flipOver(e = null) {
    if(queueArr.length < 2) {
        e.setAttribute('class', 'card');
        queueArr.pop(e);
    } else {
        queueArr[0].setAttribute('class', 'card');
        queueArr[1].setAttribute('class', 'card');    
        queueArr.pop(queueArr[0]);
        queueArr.pop(queueArr[1]);
        queueArr = [];
    }
}

function youWon() {
    let starsObtained = document.querySelectorAll('.fa-star').length;
    if(matchedCards.length === 16){
        timeState = false;
        let minutesTook = minCount;
        let secondsTook = secCount;
        /* 
        * Credit for checkmark animation SVG: https://codepen.io/haniotis/pen/KwvYLO 
        * utlized string literal to inject SVG animation into win module
        */
        document.querySelector('.container').innerHTML = `
            <div id="congratsMod">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
            <header><h1>Congradulations! You Won!</h1></header>
            <p>With` +` `+ counter +` `+ `Moves ` + ` ` + starsObtained + ` ` + `stars` + ` ` + minutesTook + ` ` + `minutes and`+ ` ` + secondsTook + ` ` + `seconds` + `</p>
            <p>Woooo!</p>
            <div onclick="reload()"><button type="button" class="btn">Play Again?</button></div>
            </div>
        `;
    } 
}

function reload() {
    window.location.reload(true);
}


function isCardMatching(elem, cardClass) {
    if (queueArr[0].isEqualNode(queueArr[1])) {
        lockInPlace(elem);
        
        if(document.querySelector('.star') !== null){
            document.querySelector('.star').setAttribute('class','fa fa-star stary');    
        }
        
        document.querySelector('.moves').innerHTML = counter;
    } else {
        queueArr[0].setAttribute('class', 'card bad');
        queueArr[1].setAttribute('class', 'card bad');
        setTimeout(flipOver, 1500);
        document.querySelector('.moves').innerHTML = counter;
    }
    youWon(cardClass);
}

/*
* Timer function w/ my own spin to intergrate with star functionality and click event 
* credit for timer funtion: https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript 
*/

function timer ( val ) { 
    return val > 9 ? val  : "0" + val; 
}

function writeTime() {
    let congratsNode = document.querySelector('#congratsMod');
    if(!document.body.contains(congratsNode)){
        document.querySelector("#seconds").innerHTML= secCount;
        document.querySelector("#minutes").innerHTML= minCount;
    } else {
        clearInterval(startTime);   
    }
}

function time(){
    secCount = timer(++sec%60);
    minCount = timer(parseInt(sec/60,10));
    if(timeState) {
        writeTime();
    }
 }
/* end of credit */

cardNodes.forEach(function(elem){
    elem.addEventListener('click', function(e) {
        let cardClass = elem.getAttribute('class'); 
        if(cardClass !== 'card match' && queueArr.length < 2) {
            flip(elem, cardClass);
            if (queueArr.length === 2) {            
                isCardMatching(elem, cardClass);
            }
        }
        
        if(counter % 4 === 0 && document.querySelectorAll('.stary').length > 1) {
            $('.stary:last').attr('class','fa fa-star-o star');    
        }  
        
        if(!timeState) {
            timeState = true;
            startTime = setInterval(time, 1000);
        }

    })
})
