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
var movesCounter = document.querySelector('.moves').innerHTML = counter;
var queueArr = new Array();

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
                        queueArr = [];
                        counter++;
                    } else {
                        flipOver();
                        queueArr = [];
                        counter++;
                    }
                }, 2000)
            }
        
    })
})