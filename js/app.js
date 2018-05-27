/*
 * Create a list that holds all of your cards
 */

const cardList = [
  "fa-diamond",
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-anchor",
  "fa-bolt",
  "fa-bolt",
  "fa-cube",
  "fa-cube",
  "fa-leaf",
  "fa-leaf",
  "fa-bicycle",
  "fa-bicycle",
  "fa-bomb",
  "fa-bomb"
];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method belowS
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const deck = document.querySelector('.deck');
const restart = document.querySelector('.restart');
let openCards = [];
let move = 0;
let seconds = 0;
let minutes = 0;
let card = document.querySelectorAll('.card');
const moves = document.querySelector('.moves');
const star = document.querySelectorAll('.fa-star');
const stars = document.querySelectorAll('.stars');
const timerCount = document.querySelector('.timer');
let matchedCards = [];
let interval;
let clicked = false;
const modal = document.querySelector('.modal');
const content = document.querySelector('.modal-content');
const btn = document.querySelector('.btn');


//create the cards and shuffle the deck
function init() {
  shuffle(cardList);
  for (const cards of cardList) {
    card = document.createElement('li');
    card.classList.add('card');
    card.innerHTML = `<i class = "fa ${cards}"></i>`;
    deck.appendChild(card);
  }
  modal.style.display = 'none';

  return card;
}

//initialize game
init();

//add an event listener for reshuffle
restart.addEventListener('click', function() {
  gameRestart();
});

//reset game at win or restart click
function gameRestart() {
  console.log("clicked");
  //removes exsisting deck
  while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
  }
  //empty open card array
  openCards = [];

  //reset moves
  move = 0;
  moves.innerHTML = `Moves ${move}`;
  matchedCards = [];

  //add stars back when empty
  if (move === 0) {
    star[0].classList.add('fa-star');
    star[1].classList.add('fa-star');
    star[2].classList.add('fa-star');
  }

  //reset timer
  resetTimer();
  //reset modal
  modalReset();
  //create new deck
  init();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

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

// show cards
function show(e) {
  if (e.target.nodeName == 'LI' && !e.target.classList.contains('open')) {
    e.target.classList.toggle('open');
    e.target.classList.toggle('show');
    addCard(e);
  }

}

//add cards to the array
function addCard(e) {
  if (e.target.classList.contains('open')) {
    let name = e.target.innerHTML;
    openCards.push(name);
    console.log(openCards);
  }
  return openCards;
}

//count number of moves and display moves on score panel
function count(e) {
  if (clicked === true) {
    move += 1;
    moves.innerHTML = `Moves  ${move}`;
  }
  return move;
}

//start timer on first card clicked and display on score panel
function startTimer() {
  interval = setInterval(function() {
    seconds++;
    if (seconds === 60) {
      minutes++;
      seconds = "0" + 0;
    }
    timerCount.innerHTML = `Time  ${minutes}:${seconds}`;
  }, 1000);
  return minutes;
}

//remove a star after a certain number of moves
function starCount(e) {
  if (move === 1) {
    resetTimer();
    startTimer();
  }
  if (move === 20) {
    star[0].classList.remove('fa-star');
  } else if (move === 40) {
    star[1].classList.remove('fa-star');
  } else if (move === 60) {
    star[2].classList.remove('fa-star');
  }
}

//reset timer at game restart
function resetTimer() {
  clearInterval(interval);
  seconds = 0;
  minutes = 0;
  timerCount.innerHTML = `Time ${minutes}:${seconds}`;
}

//assign first and second card classes, check for matches, match cards, clear array, and remove class
function compare(e) {
  if (openCards.length === 1 && clicked === true) {
    e.target.classList.add('firstCard');

  } else if (openCards.length === 2 && clicked === true) {
    e.target.classList.add('secondCard');
  }

  if (openCards.length === 2 && openCards[0] === openCards[1]) {
    match(e);
    clicked = false;
  }

  if (openCards.length === 2 && !e.target.classList.contains('match')) {
    clicked = true;
    cardClose(e);
  }

  if (openCards.length > 2) {
    clicked = true;
    e.target.classList.remove('open');
    e.target.classList.remove('show');
    openCards = [];
  }

  if (matchedCards.length === cardList.length) 
    win();
  }
}

//match cards and add to matchedCard Array
function match(e) {
  let first = document.querySelector('.firstCard');
  let second = document.querySelector('.secondCard');

  first.classList.add('match');
  second.classList.add('match');
  first.classList.add('pulse');
  matchedCards.push(first.innerHTML);
  matchedCards.push(second.innerHTML);
  first.classList.remove('firstCard');
  second.classList.remove('secondCard');

  openCards = [];
  return matchedCards;
}

//close cards and remove classes
function cardClose(e) {
  let first = document.querySelector('.firstCard');
  let second = document.querySelector('.secondCard');
  setTimeout(function(e) {
    first.classList.remove('open');
    first.classList.remove('show');
    second.classList.remove('open');
    second.classList.remove('show');
    first.classList.remove('flipInY');
    first.classList.remove('flipOutY');
    second.classList.remove('flipInY');
    second.classList.remove('flipOutY');
    openCards = [];
  }, 800);
  first.classList.remove('firstCard');
  second.classList.remove('secondCard');

}

//Game won pop up modal
function win() {
  modal.style.display = 'flex';
  modal.classList.add('zoomIn');
  clearInterval(interval);
  let title = document.createElement('h1');
  let score = document.createElement('ul');
  let time = document.createElement('p');
  let ask = document.createElement('p');
  title.innerHTML = `You win!!!`;
  score.innerHTML = stars[0].innerHTML;
  time.innerHTML = `Your  ${timerCount.innerHTML}`;
  ask.innerHTML = `Would you like to play again?`;
  score.classList.add('stars');
  content.appendChild(title);
  content.appendChild(score);
  content.appendChild(time);
  content.appendChild(ask);
  content.appendChild(btn);

}

// reset modal content to empty
function modalReset() {
  modal.style.display = 'none';
  content.innerHTML = '';
}

//add event listener for "play again" button
btn.addEventListener('click', function() {
  console.log(clicked);
  gameRestart();
});

//assign event listener to cards, show cards, compare cards, start count on click, count stars, add animation
document.body.addEventListener('click', function(e) {
  if (e.target.nodeName == 'LI' && openCards.length < 2) {
    clicked = true;
    e.target.classList.add('flipInY');
    e.target.classList.remove('flipInX');
    show(e);
    compare(e);
    count(e);
    starCount(e);
  }
});
