let values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"],
    suits = ["heart", "spade"]; //"diamond", "club", 

let textArea = document.getElementById('text-area'),
    startGameButton = document.getElementById('new-game-button'),
    hitButton = document.getElementById('hit-button'),
    stayButton = document.getElementById('stay-button'),
    content = document.getElementById('content'),
    result = document.getElementById('result'),
    //container = document.getElementById('containers'),
    dealerElement = document.getElementById('dealer-card'),
    playerElement = document.getElementById('player-card'),
    score = document.getElementById("score"),
    playerContainer = document.getElementById('player-container'),
    dealerContainer = document.getElementById('dealer-container');

console.log(playerContainer, dealerContainer);

function hideButton() {
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
    return;
}

hideButton();

let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    playerCount = 0,
    dealerCount = 0,
    deck = [];

startGameButton.addEventListener('click', function() {

    result.style.display = 'none';
    score.innerText = '';

    playerCount = 0;
    dealerCount = 0;
    gameStarted = true;
    gameOver = false;
    playerWon = false;

    startGameButton.style.display = 'none';
    hitButton.style.display = 'table-cell';
    stayButton.style.display = 'table-cell';
    textArea.style.display = 'none';

    deck = createDeck();
    deck = shuffleDeck();
    //cheating here lol
    //console.table(deck);
    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];
    printCard();

    // console.log("First compare: ", playerWon);
});

//hit
hitButton.addEventListener('click', function() {
    // console.log(playerCount, gameOver)
    if (playerCount < 3) {
        playerCards.push(getNextCard());
        printCard();
        playerCount++;
    }
    if (playerCount === 3) {
        hitButton.style.display = 'none';
    }
    dealerAction();
});

//stay
stayButton.addEventListener('click', function() {
    hitButton.style.display = 'none';
    // console.log("current player count: ", playerCount);
    playerCount = 3;
    if (dealerCount !== 3) {
        dealerAction();
    }
    if (playerCount == 3) {
        compareScore();
    }
    return;
});

function gameIsOver() {
    hideButton();
    let playerScore = calcScore()[0];
    let dealerScore = calcScore()[1];

    if (!gameOver) {
        score.innerText += "\n\nDealer's score: " + dealerScore;
        score.innerText += "\n\nPlayer's score: " + playerScore;
        if (playerWon) {
            setTimeout(5000);
            result.innerText = '\n\nYou Win!';
            // console.log('win');
        } else {
            setTimeout(5000);
            result.innerText = '\n\nYou Lose!';
            // console.log('lose');
        }
        result.style.display = 'block';
    }

    startGameButton.style.display = 'table-cell'
    gameOver = true;
    return;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dealerAction() {
    // console.log("dealer action based on: ", calcScore()[1], '\tdealer count: ', dealerCount);
    let playerScore = calcScore()[0];
    let dealerScore = calcScore()[1];

    if (dealerCount < 3 && playerScore <= 21) {
        // console.log("the dealer not lose yet", dealerScore);
        if (dealerScore < 15) {
            // console.log("the dealer score is < 15");
            dealerCards.push(getNextCard());
            printCard();
            dealerCount++;
        } else if (dealerScore > 14 && dealerScore < 21) {
            // 0 or 1
            let rand = getRndInteger(0, 1);
            // console.log(rand);
            if (rand == 0) {
                // console.log("rand = 0", rand);
                dealerCards.push(getNextCard());
                printCard();
                dealerCount++;
            } else {
                // console.log("rand != 0", rand);
                dealerCount = 3;
            }
        } else if (dealerScore == 21) {
            // console.log('dealer = 21');
            dealerCount = 3;
        } else {
            // console.log("hit here -.-");
            dealerCount = 3;
        }
        // console.log("dealercount:", dealerCount);
        // console.log("gameover:", gameOver, "\tPlayerWon:", playerWon);
    }
    dealerScore = calcScore()[1];
    // console.log("dealer's score now:", dealerScore);
    if (dealerScore > 21) {
        // console.log("hit ++++++");
        playerWon = true;
        gameIsOver();
    } else {
        playerWon = compareScore();
    }
    return;
}

// function showStatus() {
//     if (!gameStarted) {
//         textArea.innerText = 'Welcome to Bakcjack!';
//         return;
//     }
// }

function getNextCard() {
    return deck.shift();
}

function createDeck() {
    let deck = [];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            let card = {
                suit: suits[i],
                value: values[j]
            };
            deck.push(card);
        }
    }
    return deck;
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let swapIndex = Math.trunc(Math.random() * deck.length);
        let temp = deck[swapIndex];
        deck[swapIndex] = deck[i];
        deck[i] = temp;
    }
    return deck;
}

function getCardString(card) {
    return card.value + ' of ' + card.suit;
}


function deleteChild() {
    //e.firstElementChild can be used. 
    if (!dealerContainer.hasChildNodes && !playerContainer.hasChildNodes) {
        console.log(dealerContainer.lastElementChild);
        console.log("not empty");
        var child = dealerContainer.lastElementChild;
        while (child) {
            dealerContainer.removeChild(child);
            child = dealerContainer.lastElementChild;
        }

        child = playerContainer.lastElementChild;
        while (child) {
            playerContainer.removeChild(child);
            child = playerContainer.lastElementChild;
        }
    } else {
        console.log("just started");
    }
    return;

}

function printCard() {

    deleteChild();

    // let dealerContainer = document.createElement("span");
    // dealerContainer.setAttribute("id", "dealer-container");
    // container.appendChild(dealerContainer);
    // let playerContainer = document.createElement("span");
    // playerContainer.setAttribute("id", "player-container");
    // container.appendChild(playerContainer);


    let text = "\n\n\t\tDealer's card: ";
    let p = document.createElement("p");
    dealerContainer.appendChild(p);
    for (let i = 0; i < dealerCards.length; i++) {
        //dealer should only display one card - fix later
        //convertToImage(dealerContainer, dealerCards[i]);
        text += getCardString(dealerCards[i]);
        if (i < dealerCards.length - 1) {
            text += "\t|\t";
        }
        console.log(text);
        console.table(dealerCards);
        // showRealCard(dealerCards[i]);
    }
    p.innerText = text;
    //dealerElement.innerHTML = text;
    text = "\n\n\t\tPlayer's card: ";
    let p2 = document.createElement("p");
    playerContainer.appendChild(p2);
    for (let i = 0; i < playerCards.length; i++) {
        text += getCardString(playerCards[i]);
        if (i < playerCards.length - 1) {
            text += "\t|\t";
        }
        //convertToImage(playerContainer, playerCards[i]);
        console.table(playerCards);
        showRealCard(playerCards[i]);
    }
    p2.innerHTML = text;
    return;
}

function calcScore() {
    let isPlayerAce = false;
    let isDealerAce = false;
    let playerScore = 0;
    let dealerScore = 0;
    for (let i = 0; i < playerCards.length; i++) {
        playerScore += convertToNumericValue(playerCards[i]);
        if (playerCards[i].value === 'Ace') {
            isPlayerAce = true;
        }
    }
    for (let i = 0; i < dealerCards.length; i++) {
        dealerScore += convertToNumericValue(dealerCards[i]);
        if (dealerCards[i].value === 'Ace') {
            isDealerAce = true;
        }
    }
    if (playerScore + 10 <= 21 && isPlayerAce) {
        playerScore += 10;
    }
    if (dealerScore + 10 <= 21 && isDealerAce) {
        dealerScore += 10;
    }
    // console.log(dealerScore, playerScore);
    let score = [playerScore, dealerScore];
    return score;
}

function compareScore() {
    let playerScore = calcScore()[0];
    let dealerScore = calcScore()[1];
    // console.log(playerCount, dealerCount);
    // console.table(playerCards);
    // console.table(dealerCards);
    console.log(playerScore, dealerScore, playerWon);
    if (playerScore <= 21 && dealerScore <= 21) {
        playerWon = (playerScore > dealerScore);
        //console.log("we are <= 21");
        if (dealerCount === 3 && playerCount === 3) {
            gameIsOver();
            return playerWon;
        }
    } else if (playerScore > 21) {
        //console.log('player>21');
        playerWon = false;
        gameIsOver();
        return playerWon;
    } else if (dealerScore > 21 && playerScore <= 21) {
        //console.log('dealer>21');
        playerWon = true;
        gameIsOver();
        return playerWon;
    }
    return playerWon;
}

function convertToImage(element, card) {
    // let eachCard = document.createElement('span');
    // eachCard.setAttribute("class", "eachCard");
    // (element).appendChild(eachCard);
    // let img = document.createElement('img');
    // img.setAttribute("id", "imgs")
    // console.log(card.suit);
    // img.src = `${card.suit}.png`;
    // // /**  <div class="text-block">
    // //     <h4>Nature</h4>
    // //     <p>What a beautiful sunrise</p>
    // //   </div> */
    // // img.alt = card.value;
    // eachCard.appendChild(img);
    // let text = document.createElement('span');
    // text.setAttribute("class", "values");
    // eachCard.appendChild(text);
    // text.innerText = convertToNumericValue(card);
    // // let _text = document.createElement('p');
    // // _text.setAttribute("class", "text-block");
    // // _text.innerText = convertToNumericValue(card);
    // eachCard.appendChild(text);
    // // //document.body.appendChild(img);

    return;
}

function showRealCard(card) {
    let sec = document.createElement("section");
    sec.setAttribute("class", "cards");

    // if (isDealer) {
    playerContainer.appendChild(sec);
    // } else {
    //     playerContainer.appendChild(cardSection);
    // }

    let innerSec = document.createElement("section");
    innerSec.setAttribute("class", `card card--${card.suit}`);
    let cardValue = convertToNumericValue(card);
    innerSec.setAttribute("value", cardValue);

    sec.appendChild(innerSec);
    let innerCard = document.createElement("div");
    innerCard.setAttribute("class", "card__inner card__inner--centered");
    innerSec.appendChild(innerCard);

    let col1 = document.createElement("div");
    col1.setAttribute("class", "card__column");
    innerCard.appendChild(col1);
    // card < 4
    if (cardValue < 4) {
        //one col
        for (let i = 0; i < cardValue; i++) {
            let div = document.createElement("div");
            div.setAttribute("class", "card__symbol");
            col1.appendChild(div);
        }
    } else if (cardValue >= 4) { // card >= 4
        let col2 = document.createElement("div");
        col2.setAttribute("class", "card__column");
        //card = 8 || 10
        if (cardValue === 8 || cardValue === 10) {
            let col3 = document.createElement("div");
            col3.setAttribute("class", "card__column");
            innerCard.appendChild(col3);
            innerCard.appendChild(col2);
            let i = 0;
            //1st
            while (i < (cardValue / 2 - 1)) {
                let div = document.createElement("div");
                div.setAttribute("class", "card__symbol");
                col1.appendChild(div);
                i++;
            }
            i = 0;
            //2nd
            while (i < 2) {
                let div = document.createElement("div");
                div.setAttribute("class", "card__symbol");
                col3.appendChild(div);
            }
            i = 0;
            //3rd
            while (i < (cardValue / 2 - 1)) {
                let div = document.createElement("div");
                div.setAttribute("class", "card__symbol");
                col2.appendChild(div);
            }
        } else {
            //card = 4 || 6
            if (cardValue === 4 || cardValue === 6) {
                //1st
                innerCard.appendChild(col2);
                for (let i = 0; i < cardValue / 2; i++) {
                    let div = document.createElement("div");
                    div.setAttribute("class", "card__symbol");
                    col1.appendChild(div);
                }
                //2nd
                for (let j = 0; j < cardValue / 2; j++) {
                    let div = document.createElement("div");
                    div.setAttribute("class", "card__symbol");
                    col2.appendChild(div);
                }
            }
            //card = 5 || 7 || 9
            if (cardValue === 5 || cardValue === 7 || card === 9) {
                //left
                for (let i = 0; i < (cardValue - 1) / 2; i++) {
                    let div = document.createElement("div");
                    div.setAttribute("class", "card__symbol");
                    col1.appendChild(div);
                }
                //middle
                let col3 = document.createElement("div");
                col3.setAttribute("class", "card__column");
                innerCard.appendChild(col3);
                innerCard.appendChild(col2);
                let div = document.createElement("div");
                div.setAttribute("class", "card__symbol");
                col3.appendChild(div);

                //right
                for (let j = 0; j < (cardValue - 1) / 2; j++) {
                    let div = document.createElement("div");
                    div.setAttribute("class", "card__symbol");
                    col2.appendChild(div);
                }
            } //5,7,9
        } //>=4
    }
    return;
}

function convertToNumericValue(card) {
    switch (card.value) {
        case "Ace":
            return 1;
        case "Two":
            return 2;
        case "Three":
            return 3;
        case "Four":
            return 4;
        case "Five":
            return 5;
        case "Six":
            return 6;
        case "Seven":
            return 7;
        case "Eight":
            return 8;
        case "Nine":
            return 9;
        case "Ten":
            return 10;
        case "Jack":
            return 10;
        case "Queen":
            return 10;
        case "King":
            return 10;
        default:
            return 0;
    }
}