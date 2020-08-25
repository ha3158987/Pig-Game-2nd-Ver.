/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, gamePlaying;
//여기서 변수들은 declare만 하면 됨. define 할 필요는 없음.
init();

document.querySelector(".btn-roll").addEventListener("click", function () {
  if (gamePlaying) {
    //상태가 playing일때만 아래 코드를 실행할 것이기 때문에 if문 안에 포함!

    //1. Random Number
    var dice = Math.floor(Math.random() * 6) + 1;
    /* dice라는 변수는 여기에서만 쓸 수 있게 여기서 선언해줌. */

    //2. Display the result
    var diceDOM = document.querySelector(".dice");
    diceDOM.style.display = "block";
    diceDOM.src = "dice-" + dice + ".png";

    //3. Update the round score IF the rolled number is NOT '1'
    if (dice !== 1) {
      //add score
      roundScore += dice;
      document.querySelector(
        "#current-" + activePlayer
      ).textContent = roundScore;
      //매 라운드마다 누적 스코어를 업데이트 해서 current 클래스의 콘텐트로 가지게 하는 것
    } else {
      //결과가 1과 같으면 next player's turn
      nextPlayer();
    }
  }
});
//여기서 주의 할 점은, 우리는 함수를 여기서 실행시키는 것이 아니라 eventlistener가 우리를 위해서 btn이라는 함수를 불러오기를 원하기 떄문에 일반적으로 함수 실행 시 쓰이는 괄호()는 쓰지 않는다.

//document.querySelector("#current-" + activePlayer).textContent = dice;
//current-0라는 요소와 current-1이라는 요소가 모두 있으므로 player1과 player2의 요소들이 모두 바뀔 수 있도록 #current-0 대신 위와 같이 바꿔줌.

//document.querySelector("#current-" + activePlayer).innerHTML = "<em>" + dice + "</em>";
//.innerHTML이 있는 자리에 .textContent를 넣지 않는 이유는 dice를 감싸고 있는 <em>까지도 string으로 치부해버리는 것을 방지하기 위함임.

//var x = document.querySelector("#score-0").textContent;

document.querySelector(".btn-hold").addEventListener("click", function () {
  if (gamePlaying) {
    //add CURRENT score to GLOBAL score
    scores[activePlayer] += roundScore;

    //update the UI(user interface)
    document.querySelector("#score-" + activePlayer).textContent =
      scores[activePlayer];
    //hold버튼을 누르면 각각의 array에 점수를 담게끔 하는 것

    //Check if player won the game
    if (scores[activePlayer] >= 100) {
      document.querySelector("#name-" + activePlayer).textContent = "Winner!";
      document.querySelector(".dice").style.display = "none";
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");
      //여기서는 winner 클래스와 active 클래스가 있음을 알고 있기 때문에 toggle 대신 더해주고 빼주는 것으로 대신함.
      gamePlaying = false;
      //winner가 가려지면 게임 진행 상태는 false가 되어야 하기 떄문.
    } else {
      nextPlayer();
    }
  }
});

function nextPlayer() {
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
  /*if (activePlayer === 0) { 
        activePlayer = 1; 
    } else { 
        activePlayer = 0; 
    } 과 똑같은 뜻이지만 삼항조건연산자로 쓴 것!!*/
  roundScore = 0; //상대편 라운드스코어를 다시 '0'으로 리셋할 수 있게 하는 코드

  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");
  //document.querySelector(".player-0-panel").classList.remove("active");
  //document.querySelector(".player-1-panel").classList.add("active");
  //active 클래스를 움직이게 해서 현재 player 의 바탕에 진한 회색으로 변하게하고, 빨강색 dot이 옮겨가게 하는 효과. 다만 이렇게 하면 다시 현재 player의 차례가 바뀌었을때 자동으로 옮겨가지 않으므로, 'toggle'을 사용해줌.
  //toggle은 클래스가 아마 있으면 없애주고, 클래스가 없으면 생기게 해주는 것.

  document.querySelector(".dice").style.display = "none";
}

document.querySelector(".btn-new").addEventListener("click", init);
//새로운 게임을 시작하는 것은 beginning 세팅을 다시 시작하는 것과 같기 때문에...

function init() {
  //init 이라는 초기화 함수를 만들어서 처음 세팅으로 돌려주는 모든 코드들을 묶어줌.
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  gamePlaying = true;
  //state variable; 게임진행상태를 판단해서 게임이 끝났을 경우 더 이상 실행이 되지 않도록 컨트롤 할 수 있음.

  document.querySelector(".dice").style.display = "none";
  //display는 css 프로퍼티와 같고, "none"은 css value랑 같음

  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";
  document.getElementById("name-0").textContent = "Player 1";
  document.getElementById("name-1").textContent = "Player 2";
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");
}
