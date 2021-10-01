const FRONT = "card_front";
const BACK = "card_back";
const CARD = "card";
const ICON = "icon";
var BGSON = false;

startGame();

function startGame() {
    initializeCards(game.createCardsFromTechs());
}

function initializeCards(cards) {
    let gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    game.cards.forEach(card => {

        let cardElement = document.createElement('div');
        cardElement.id = card.id;
        cardElement.classList.add(CARD);
        cardElement.dataset.icon = card.icon;

        createCardContent(card, cardElement);

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement)

    });
}

function createCardContent(card, cardElement) {
    createCardFace(FRONT, card, cardElement);
    createCardFace(BACK, card, cardElement);
}

function createCardFace(face, card, element) {

    let cardElementFace = document.createElement('div');
    cardElementFace.classList.add(face);
    if (face === FRONT) {
        let iconElement = document.createElement('img');
        iconElement.classList.add(ICON);
        iconElement.src = "imagens/" + card.icon + ".png";
        cardElementFace.appendChild(iconElement);
    } else {
        cardElementFace.innerHTML = "<div class='egg'>&#129370;</div>";
    }
    element.appendChild(cardElementFace);
}

function restart() {

    game.clearCards();
    startGame();

    let gameOverLayer = document.getElementById('gameOver');
    gameOverLayer.style.display = 'none';

}

function initializeSond() {
    let bgs = document.getElementById('bg-sound');
    bgs.play();
    bgs.volume = 0.1;
    BGSON = true;
    volumeOn();
}

function soundBG() {
    let bgs = document.getElementById('bg-sound');
    if (!bgs.paused) {
        bgs.pause();
        volumeOff();

    } else {
        bgs.play();
        bgs.volume = 0.1;
        volumeOn();
    }
}

function volumeOn() {
    document.getElementById('sound-mute').innerText = 'volume_up';
}
function volumeOff() {
    document.getElementById('sound-mute').innerText = 'volume_off';
}

function eggCracking() {

    //Play egg cracking when flip cards
    let egg = new Audio('sons/egg-cracking.mp3');
    egg.addEventListener('canplaythrough', () => egg.play());
}

function flipCard() {
    //Start BG SOUND FIRST TIME
    if (!BGSON) initializeSond();
    eggCracking();
    if (game.setCard(this.id)) {
        this.classList.add('flip');
        if (game.secondCard) {
            if (game.checkMatch()) {

                //Play roar when match cards
                let roar = new Audio('sons/dino-roar.mp3');
                roar.addEventListener('canplaythrough', () => roar.play());

                game.clearCards();
                if (game.checkGameOver()) {
                    let gameOverLayer = document.getElementById('gameOver');
                    gameOverLayer.style.display = 'flex';
                    soundBG();

                }
            } else {

                setTimeout(() => {
                    let firstCardView = document.getElementById(game.firstCard.id);
                    let secondCardView = document.getElementById(game.secondCard.id);

                    firstCardView.classList.remove('flip');
                    secondCardView.classList.remove('flip');
                    game.unflipCards();

                }, 1000);
            }
        }
    }
}