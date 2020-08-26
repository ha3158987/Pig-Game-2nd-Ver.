/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

//가장 먼저, 게임에서 요구되는 '가장 중요한 변수들'을 선언해준다. 게임에서는 승패를 결정하는 '점수'가 가장 중요하기 떄문에 score를 먼저 만들어준다.
// var score1 = 0;
// var score2 = 0;
// 좀 더 보기에 깔끔하고, 가독성을 높이기 위해 위에서 선언한 변수들을 score라는 하나의 '배열'로 만들어준다.
// 변수들을 한 줄로 한꺼번에 선언해주면 보기에 더 쉽다. (가장 윗줄에 몰아서 선언해주기)
var scores, roundScore, activePlayer, isGamePlaying;
init();

//'Math' object 사용. 다양한 메소드를 가지고 있는 자바스크립트 built-in 객체. 1 ~ 6 사이의 랜덤숫자를 반환해주는 로직.
dice = Math.floor(Math.random() * 6) + 1;

// function btn() {}c
//callback function: 우리가 함수를 실행하는 것이 아니라, eventlister가 btn함수를 실행시키기를 원하는 것이기 떄문에 함수 뒤에 ()를 추가하지 않음.
//anonymous function: 함수에 이름이 없어서 재사용이 어려운 함수. btn이라는 함수명을 인자로 주는 것이라, 두번째 인자의 자리에 함수를 정의해주면 익명함수가 된다.
document.querySelector(".btn-roll").addEventListener("click", function () {
  if (isGamePlaying) {
    // 1. Random number
    //dice 라는 변수는 이 함수 외에 다른 곳에서 쓰일 일이 전혀 없으므로 변수 선언과 할당까지 이 함수 내부에서 진행한다.
    var dice = Math.floor(Math.random() * 6) + 1;

    //2. Display the result
    //전역 스코프에서 보이지 않게 해두었던 dice이미지를 이 함수가 실행됨과 동시에 보이게 바꿔야하기 때문에.
    //변수를 선언해서 중복으로 요소를 DOM에서 선택해 오는 과정을 줄인다. img src="dice-5.png" 형식만 맞추면 작동이 되기 때문에 약간의 trick을 쓰는 것.
    var diceDOM = document.querySelector(".dice");
    diceDOM.style.display = "block";
    diceDOM.src = "dice-" + dice + ".png";

    //3. Update the round score IF the rolled number was NOT a 1
    if (dice !== 1) {
      //1이 아닌경우 - Add score
      roundScore += dice;
      document.querySelector(
        "#current-" + activePlayer
      ).textContent = roundScore;
    } else {
      //1인 경우 - next player
      nextPlayer();
    }
  }
});

//hold 버튼 만들기 - 누르면 점수가 save 되는 로직
document.querySelector(".btn-hold").addEventListener("click", function () {
  if (isGamePlaying) {
    //current score 와 global score 합치기
    scores[activePlayer] += roundScore; //이번 라운드의 점수가 현재 player에 맞는 scores배열 index에 더해질 수 있도록 한다.

    // UI 업데이트하기
    document.querySelector("#score-" + activePlayer).textContent =
      scores[activePlayer];

    //winner가 나왔는지 check하기(rule:The first player to reach 100 points on GLOBAL score wins the game)
    //승자가 가려지면 UI에서 Player1/Player2가 디스플레이 되는 자리에 winner라는 글자를 exchange 한다.
    if (scores[activePlayer] >= 20) {
      //승자가 나오면
      document.querySelector("#name-" + activePlayer).textContent = "Winner!";
      document.querySelector(".dice").style.display = "none";
      //winner class만들기 - 없는 걸 만들어 주는 것이기 때문에 'add' 사용
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
      //avtive class없애기 - 있는 걸 없애주는 것이기 때문에 'remove'사용
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");
      isGamePlaying = false;
    } else {
      //next player - else문 내부에 있어야지만 승자가 가려지면 더 이상 nextPlayer 함수가 실행되지 않게 할 수 있다.
      nextPlayer();
    }
  }
});

//activePlayer가 바뀌어야되는 조건은 여러 개가 있다. hold버튼이 눌렸을 때, 주사위에서 1이 나왔을 때 등..
//DRY principal을 준수하기 위해서 nextPlayer라는 함수를 정의해준다.
function nextPlayer() {
  //player가 0이면 1로, 1이면 0으로 바꿔주기
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
  //set the roundscore back to '0'
  roundScore = 0;
  //주사위에서 1이 나오면 양팀의 현재점수는 모두 1.(설정하지 않을 경우 다시 interface에는 상대편 차례에도 마지막 자신의 점수가 유지되어 보인다.)
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  //who is the "active player"? - player 옆에 빨간 동그라미, bold text, darker-gray background
  //remove & add 'class' of 'active'
  // document.querySelector(".player-0-panel").classList.remove("active");
  // document.querySelector(".player-1-panel").classList.add("active");
  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");

  //1이 나오면 잠시 주사위 그림도 사라짐.
  document.querySelector(".dice").style.display = "none";
}

//new game 버튼 만들기 - 전부 처음과 같은 상태로 세팅
document.querySelector(".btn-new").addEventListener("click", init);

function init() {
  isGamePlaying = true;
  //인덱스 [0]은 player'0', 인덱스 [1]은 player'1'의 점수가 된다.
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;

  //querySelector를 CSS 변경에 사용하는 방법 - 주사위 이미지 숨기기
  //주사위 이미지 in HTML : <img src="dice-5.png" alt="Dice" class="dice" />
  document.querySelector(".dice").style.display = "none";
  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";
  //새로운 게임이 시작되면 winner라고 되어있던 이름도 다시 Player어쩌고 로 setting해줘야함.
  document.getElementById("name-0").textContent = "Player 1";
  document.getElementById("name-1").textContent = "Player 2";
  //remove winner class - 누가 이기든 상관없이 적용되도록 두 player에게 모두 적용
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  //remove active class - css style이 여전히 마지막 winner에게 적용되어 있는 상태를 방지
  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  //remove 한 다음에 다시 active class를 추가.(그렇지않으면 2개의 active class가 동시에 적용될 수 있기 때문에)
  //새로운 게임에서 첫번째 turn은 항상 Player 0.
  document.querySelector(".player-0-panel").classList.add("active");
}

//DOM Manipulation - 나중을 위해 save 해두는 것
//document.querySelector("#current-" + activePlayer).textContent = dice;
// document.querySelector("#current-" + activePlayer).innerHTML =
//   "<em>" + dice + "</em>";
//<em>태그는 italic체로 강조하는 태그. 할당은 무조건 "문자열"로 주어야지만 에러가 나지 않는다.

//변수 x에 global score(score-0)를 담는다.
//var x = document.querySelector("#score-0").textContent;
