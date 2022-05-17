'use strict'; 

const blessed = require('blessed');
let gosper = getRandomInt(10000);
const current = '*';


const screen = blessed.screen({
  smartCSR: true
});

const box = blessed.box({
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  content: ' 0 \n  0',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black'
  }
});

screen.append(box);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

let GameBoard = [];
let currentGame;

function getRandomInt(number){
	let arr = new Array();
	for(let x = 0; x < number; x+=1){
		arr[x] = [Math.floor(Math.random()* (99 - 1) + 1), Math.floor(Math.random() * (99 - 1) + 1)]
	}
	return {'current': arr}
}
// Створення ігрового поля
let makeGamebox = () => {
 for (let x = 0; x < 100; x++) {
   let tempArray = [];
   for (let y = 0; y < 100; y++) {
     if (y === 99) {
       tempArray.push('\n');
     } else {
     tempArray.push(' ');
    }
   }
   GameBoard.push(tempArray);
 }
 setBoard(gosper);
};

box.key('enter', function(ch, key) {
  screen.render();
  cleanScreen()
  screen.render();
  
  const fs = require('fs'); 
  let rawdata = fs.readFileSync('points.json'); 
  gosper = JSON.parse(rawdata)
  setBoard(gosper)
  box.setContent(currentGame)
  screen.render();
});

let setBoard = (pattern) => {
  // Добавлення перших точок
  let cells = pattern['current'];
  for (let x = 0; x <cells.length; x++) {
    let postX = cells[x][0];
    let postY = cells[x][1];

    GameBoard[postX][postY] = current;
  }
  currentGame = JSON.parse(JSON.stringify(GameBoard));
  joinArray(currentGame);
}

// Створення самої гри
const changeBoard = (game) => {

  let currentBoard = JSON.parse(JSON.stringify(game));

  for (let x = 1; x < currentBoard.length-1; x++) {
    for ( let y = 1; y < currentBoard.length-1; y++) {
      let total = 0;

      total = total + isAlive(currentBoard[x - 1][y - 1]); // верхній лівий кут
      total = total + isAlive(currentBoard[x - 1][y]); 
      total = total + isAlive(currentBoard[x - 1][y + 1]);

      total = total + isAlive(currentBoard[x + 1][y - 1]); // нижній лівий кут
      total = total + isAlive(currentBoard[x + 1][y]);
      total = total + isAlive(currentBoard[x + 1][y + 1]);

      total = total + isAlive(currentBoard[x][y - 1]); // cередина зліва
      total = total + isAlive(currentBoard[x][y + 1]); // середина справа

      if (currentBoard[x][y] === current) {
        if (total <= 1 || total >= 4) {
          GameBoard[x][y] = ' ';
          /* Якщо має менш ніж двох сусідів то гине від недостачі сусідів, якщо більш ніж 3 гине від перенаселення */
        } else {
          GameBoard[x][y] = current; // Живе до наступного покоління.
        }
      }

      if (total === 3) {
        game[x][y] = current; // Розмноження клітин якщо сусідів рівно три.
      }
    }
  }
}

// Функція очищення екрану
function cleanScreen(){
  for(let i=0; i<99; i++){
    for(let j=0; j<99; j++){
      GameBoard[i][j] = ' '
    }
  }
  currentGame = JSON.parse(JSON.stringify(GameBoard));
  joinArray(currentGame);
}

// З'єднання масивів
const joinArray = (board) => {
  for (let x = 0; x < board.length; x++) {
    board[x] = board[x].join('');
  }
  currentGame = board.join('');
}

// Перевірка чи жива ця клітина
const isAlive = (str) => {
  if (str === current) {
    return 1;
  } else {
    return 0;
  }
}

// Ініціюєм гру
const StartGame = () => {
  makeGamebox();
  box.setContent(currentGame);
  screen.render();
  currentGame = GameBoard.slice(0);
  joinArray(currentGame);
}

StartGame();

setInterval(() => {
  changeBoard(GameBoard);
  currentGame = GameBoard.slice(0);
  joinArray(currentGame);
  box.setContent(currentGame);
  screen.render();
},100)
