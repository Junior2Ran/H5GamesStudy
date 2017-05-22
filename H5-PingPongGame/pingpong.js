var KEY = {
  UP : 38,
  DOWN : 40,
  W : 87,
  S : 83
}
var pingpong = {
  scoreA : 0,
  scoreB : 0
}
pingpong.ball = {
  speed : 2,
  x : 150,
  y : 100,
  directionX : 1,
  directionY : 1,
  radius : 10
}
pingpong.pressedKeys = [];
pingpong.paddleA = {
  x:parseInt($("#paddleA").css('left'))+parseInt($("#paddleB").css('width')),
  top:parseInt($("#paddleA").css('top')),
  height:parseInt($("#paddleA").css('height')),
  width:parseInt($("#paddleA").css('width')),
  speed:2
}
pingpong.paddleB = {
  x:parseInt($("#paddleB").css('left')),
  top:parseInt($("#paddleB").css('top')),
  height:parseInt($("#paddleB").css('height')),
  width:parseInt($("#paddleB").css('width')),
  speed:2
}

var playgroundHeight = parseInt($("#playground").height());
var playgroundWidth = parseInt($("#playground").width());

function gameloop(){
  moveBall();
  movePaddles();
  checkWin();
}

function movePaddles(){
  var paddleA = pingpong.paddleA;
  var paddleB = pingpong.paddleB;

  //上下，WS控制球拍
  if (pingpong.pressedKeys[KEY.UP]) {
    var top = paddleB.top;
    if (top > 0) {
      paddleB.top -= paddleB.speed;
    }
  }
  if (pingpong.pressedKeys[KEY.DOWN]) {
    var top = paddleB.top;
    if (top < playgroundHeight - paddleB.height) {
      paddleB.top += paddleB.speed;
    }
  }
  if (pingpong.pressedKeys[KEY.W]) {
    var top = paddleA.top;
    if (top > 0) {
      paddleA.top -= paddleA.speed;
    }
  }
  if (pingpong.pressedKeys[KEY.S]) {
    var top = paddleA.top;
    if (top < playgroundHeight - paddleA.height) {
      paddleA.top += paddleA.speed;
    }
  }

  $("#paddleA").css('top', paddleA.top);
  $("#paddleB").css('top', paddleB.top);
}

function moveBall(){
  var ball = pingpong.ball;
  var paddleA = pingpong.paddleA;
  var paddleB = pingpong.paddleB;

  //球碰到台子边上
  if (ball.y + ball.speed*ball.directionY > playgroundHeight - ball.radius*2) {ball.directionY = -1}
  if (ball.y + ball.speed*ball.directionY < 0) {ball.directionY = 1}
  if (ball.x + ball.speed*ball.directionX > playgroundWidth - ball.radius*2) {ball.directionX = -1}
  if (ball.x + ball.speed*ball.directionX < 0) {ball.directionX = 1}  
  ball.x += ball.speed*ball.directionX;
  ball.y += ball.speed*ball.directionY;

  //碰到左边球拍
  if (ball.x+ball.speed*ball.directionX <= paddleA.x && ball.x+ball.speed*ball.directionX >= paddleA.x-paddleA.width-2*ball.radius) {
    if (ball.y+ball.speed*ball.directionY >= paddleA.top-ball.radius*2 && ball.y+ball.speed*ball.directionY <= paddleA.top+paddleA.height) {
      ball.directionX = 1;
      //console.log("paddleAX:"+paddleA.x,"ballX:"+ball.x);
    }
  }

  //碰到右边球拍
  if (ball.x+ball.speed*ball.directionX >= paddleB.x-ball.radius*2 && ball.x+ball.speed*ball.directionX <= paddleB.x+paddleB.width) {
    if (ball.y+ball.speed*ball.directionY >= paddleB.top-ball.radius*2 && ball.y+ball.speed*ball.directionY <= paddleB.top+paddleB.height) {
      ball.directionX = -1;
      //console.log("paddleBX:"+paddleB.x,"ballX:"+ball.x);
    }
  }

  if (ball.x + ball.speed*ball.directionX >= playgroundWidth-ball.radius*2) {
    console.log("right dead");
    pingpong.scoreA++;
    $("#scoreA").text(pingpong.scoreA);
    ball.x = 300;
    ball.y = paddleB.top+paddleB.height/2-ball.radius;
    $('#ball').css({
      left: ball.x,
      top: ball.y
    });
    ball.directionX = -1;
    clearInterval(pingpong.timer);
    setTimeout('pingpong.timer = setInterval(gameloop,10);',1000);
    ball.speed=2;
  }
  if (ball.x + ball.speed*ball.directionX <= 0) {
    console.log("left dead");
    pingpong.scoreB++;
    $("#scoreB").text(pingpong.scoreB);
    ball.x = 80;
    ball.y = paddleA.top+paddleA.height/2-ball.radius;
    $('#ball').css({
      left: ball.x,
      top: ball.y
    });
    ball.directionX = 1;
    clearInterval(pingpong.timer);
    setTimeout('pingpong.timer = setInterval(gameloop,10);',1000);
    ball.speed=2;
  }

  //移动小球
  $('#ball').css({
    left: ball.x,
    top: ball.y
  });
}

function checkWin(){
  if (pingpong.scoreA == 3) {
    clearInterval(pingpong.timer);
    alert("Player A won the game!!");
    location.reload();
  }
  if (pingpong.scoreB == 3) {
    clearInterval(pingpong.timer);
    alert("Player B won the game!!");
    location.reload();
  }
}

function speedUp(){
  var ball = pingpong.ball;
  ball.speed += 0.01;
  //console.log(ball.speed);
}

$(function(){
  $("#start").click(function(event) {
    pingpong.timer = setInterval(gameloop,10);
    pingpong.speedTimer = setInterval(speedUp,200);
  });

  $(document).keydown(function(event) {
    pingpong.pressedKeys[event.which] = true;
    //console.log(pingpong);
  });
  $(document).keyup(function(event) {
    pingpong.pressedKeys[event.which] = false;
    //console.log(pingpong);
  });
});
