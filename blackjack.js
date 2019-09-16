let values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"],
    suits = ["diamond", "club", "heart", "spade"]; //"diamond", "club", 

let textArea = document.getElementById('text-area'),
    startGameButton = document.getElementById('new-game-button'),
    hitButton = document.getElementById('hit-button'),
    stayButton = document.getElementById('stay-button'),
    content = document.getElementById('content'),
    result = document.getElementById('result'),
    dealerElement = document.getElementById('dealer-card'),
    playerElement = document.getElementById('player-card'),
    score = document.getElementById("score"),
    playerContainer = document.getElementById('player-container'),
    dealerContainer = document.getElementById('dealer-container');

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
});

//hit
hitButton.addEventListener('click', function() {
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
        score.innerText += "Dealer's score: " + dealerScore;
        score.innerText += "\nPlayer's score: " + playerScore;
        if (playerWon) {
            setTimeout(5000);
            result.innerText = 'You Win!';
        } else {
            setTimeout(5000);
            result.innerText = 'You Lose!';
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
    let playerScore = calcScore()[0];
    let dealerScore = calcScore()[1];

    if (dealerCount < 3 && playerScore <= 21) {
        if (dealerScore < 15) {
            dealerCards.push(getNextCard());
            printCard();
            dealerCount++;
        } else if (dealerScore >= 15 && dealerScore < 21) {
            // 0 or 1
            let rand = getRndInteger(0, 1);
            if (rand == 0) {
                dealerCards.push(getNextCard());
                printCard();
                dealerCount++;
            } else {
                dealerCount = 3;
            }
        } else if (dealerScore == 21) {
            dealerCount = 3;
        } else {
            dealerCount = 3;
        }
    }
    dealerScore = calcScore()[1];
    if (dealerScore > 21) {
        playerWon = true;
        gameIsOver();
    } else {
        playerWon = compareScore();
    }
    return;
}

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

function deleteChild() {
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

    return;
}

function printCard() {

    deleteChild();

    let text = "Dealer's card: ";

    for (let i = 0; i < dealerCards.length; i++) {
        showRealCard(dealerContainer, dealerCards[i]);
    }
    dealerElement.innerText = text;
    text = "Player's card: ";
    for (let i = 0; i < playerCards.length; i++) {
        showRealCard(playerContainer, playerCards[i]);
    }
    playerElement.innerText = text;
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
    let score = [playerScore, dealerScore];
    return score;
}

function compareScore() {
    let playerScore = calcScore()[0];
    let dealerScore = calcScore()[1];
    if (playerScore <= 21 && dealerScore <= 21) {
        playerWon = (playerScore > dealerScore);
        if (dealerCount === 3 && playerCount === 3) {
            gameIsOver();
            return playerWon;
        }
    } else if (playerScore > 21) {
        playerWon = false;
        gameIsOver();
        return playerWon;
    } else if (dealerScore > 21 && playerScore <= 21) {
        playerWon = true;
        gameIsOver();
        return playerWon;
    }
    return playerWon;
}

function showRealCard(container, card) {
    let sec = document.createElement("section");
    sec.setAttribute("class", "cards");

    container.appendChild(sec);

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
        if (cardValue === 1) {
            col1.setAttribute("class", "card__column card__column--centered");
            let div = document.createElement("div");
            div.setAttribute("class", "card__symbol card__symbol--huge");
            col1.appendChild(div);
        } else {
            for (let i = 0; i < cardValue; i++) {
                let div = document.createElement("div");
                div.setAttribute("class", "card__symbol");
                col1.appendChild(div);
            }
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
            let i = 0,
                j = 0,
                k = 0;
            //1st
            while (i < (cardValue / 2 - 1)) {
                let div = document.createElement("div");
                div.setAttribute("class", "card__symbol");
                if (cardValue == 10 && i === 2) {
                    div.setAttribute("class", "card__symbol card__symbol--rotated");
                }
                col1.appendChild(div);
                i++;
            }
            //2nd
            while (j < 2) {
                col3.setAttribute("class", "card__column card__column--centered");
                let div = document.createElement("div");
                div.setAttribute("class", "card__symbol card__symbol--big");
                col3.appendChild(div);
                j++;
            }
            //3rd
            while (k < (cardValue / 2 - 1)) {
                let div = document.createElement("div");
                div.setAttribute("class", "card__symbol");
                if (cardValue == 10 && k === 2) {
                    div.setAttribute("class", "card__symbol card__symbol--rotated");
                }
                col2.appendChild(div);
                k++;
            }
        } else {
            //card = 4 || 6
            if (cardValue === 4 || cardValue === 6) {
                //1st
                innerCard.appendChild(col2);
                let i = 0,
                    j = 0;
                while (i < cardValue / 2) {
                    let div = document.createElement("div");
                    div.setAttribute("class", "card__symbol");
                    col1.appendChild(div);
                    i++;
                }
                //2nd
                while (j < cardValue / 2) {
                    let div = document.createElement("div");
                    div.setAttribute("class", "card__symbol");
                    col2.appendChild(div);
                    j++;
                }
            }
            //card = 5 || 7 || 9
            if (cardValue === 5 || cardValue === 7 || cardValue === 9) {
                //left
                let i = 0,
                    j = 0;
                while (i < (cardValue - 1) / 2) {
                    let div = document.createElement("div");
                    div.setAttribute("class", "card__symbol");
                    if (cardValue == 9 && i === 2) {
                        div.setAttribute("class", "card__symbol card__symbol--rotated");
                    }
                    col1.appendChild(div);
                    i++;
                }
                //middle
                let col3 = document.createElement("div");
                col3.setAttribute("class", "card__column card__column--centered");
                innerCard.appendChild(col3);
                innerCard.appendChild(col2);
                let div = document.createElement("div");
                div.setAttribute("class", "card__symbol card__symbol--big");
                col3.appendChild(div);

                //right
                while (j < (cardValue - 1) / 2) {
                    let div = document.createElement("div");
                    div.setAttribute("class", "card__symbol");
                    if (cardValue == 9 && j === 2) {
                        div.setAttribute("class", "card__symbol card__symbol--rotated");
                    }
                    col2.appendChild(div);
                    j++;
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