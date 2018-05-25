/*
 * Create a list that holds all of your cards
 */
var cardNodes = document.querySelectorAll('.card'); 
var cardArr = Array.from(cardNodes);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
var deckSpace = document.querySelector('.deck');
shuffle(cardArr);
for (var i = 0; i < cardArr.length; i++) {
    deckSpace.appendChild(cardArr[i]);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
var counter = 0;
document.querySelector('.moves').innerHTML = counter;
var queueArr = new Array();
var secCount = 0;
var minCount = 0;
var matchedCards = new Array();
var timeState = false;
var sec = 0;

function flip(e, cardClass) {
    if(cardClass === 'card open show') {
        flipOver(e);
    } else {
        e.setAttribute('class','card open show');
        addToQueue(e);
    }
}

function addToQueue(e) {
    if(queueArr.length < 2){
        queueArr.push(e);
    }
}

function lockInPlace(e) {
    queueArr[0].setAttribute('class', 'card match');
    queueArr[1].setAttribute('class', 'card match');
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
    }
}

function youWon() {
    var starsObtained = document.querySelectorAll('.fa-star').length;
    if(matchedCards.length === 16){
        timeState = false;
        var minutesTook = minCount;
        var secondsTook = secCount;
        /* credit for checkmark animation SVG: https://codepen.io/haniotis/pen/KwvYLO */
        document.querySelector('.container').innerHTML = `
            <div id="congratsMod">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
            <header><h1>Congradulations! You Won!</h1></header>
            <p>With` +` `+ counter +` `+ `Moves `+ ` `+ minutesTook + ` ` + `minutes and`+ ` ` + secondsTook + ` ` +     `seconds` +`</p>
            <p>Woooo!</p>
            <div onclick="reload()"><button type="button" class="btn">Play Again?</button></div>
            </div>
        `;
    }
}

function reload() {
    window.location.reload(true);
}

function timer ( val ) { 
    return val > 9 ? val  : "0" + val; 
}

setInterval( function time(){
     if(timeState === true) {
        secCount = timer(++sec%60);
        minCount = timer(parseInt(sec/60,10));
        document.querySelector("#seconds").innerHTML= secCount;
        document.querySelector("#minutes").innerHTML= minCount;
        starChanger(secCount)
     }
 }, 1000);

 function starChanger(starCount) {
    if(starCount % counter === 1){
        if(queueArr[0].isEqualNode(queueArr[1]) === true) {
            document.querySelector('.fa-star-o').setAttribute('class','fa fa-star');    
        }else {
            document.querySelector('.fa-star').setAttribute('class','fa fa-star-o');    
        }
    }
}

cardNodes.forEach(function(elem){
    elem.addEventListener('click', function(e) {
        var cardClass = elem.getAttribute('class'); 
        if(cardClass !== 'card match' && queueArr.length < 2) {
            flip(elem, cardClass);
        }
        
        if (queueArr.length === 2) {
            setTimeout(function () {
                if (queueArr[0].isEqualNode(queueArr[1]) === true) {
                    lockInPlace(elem);
                    if(matchedCards.length < 15) {
                        matchedCards.push(queueArr[0]); 
                        matchedCards.push(queueArr[1]); 
                    }
                    queueArr = [];
                    counter++;
                    document.querySelector('.moves').innerHTML = counter;
                } else {
                    flipOver();
                    queueArr = [];
                    counter++;
                    document.querySelector('.moves').innerHTML = counter;
                }
                youWon(cardClass);
            }, 2000)
        }

        if(timeState !== true) {
            timeState = true;
        }

    })
})
