var untangleGame={
  circles : [],
  lines : [],
  thinLineThickness : 1,
  boldLineThickness : 5,
  currentLevel : 0,
  steps : 0
};

//关卡数据
untangleGame.levels = [
  {
    "level" : 0,
    "circles" : [{"x":400, "y":156},
                {"x":381, "y":241},
                {"x":84, "y":233},
                {"x":88, "y":73}],
    "relationship" : {
      "0" : {"connectedPoints" : [1,2]},
      "1" : {"connectedPoints" : [0,3]},
      "2" : {"connectedPoints" : [0,3]},
      "3" : {"connectedPoints" : [1,2]}
    }
  },
  {
    "level" : 1,
    "circles" : [{"x":401, "y":73},
                {"x":400, "y":240},
                {"x":88, "y":241},
                {"x":84, "y":72}],
    "relationship" : {
      "0" : {"connectedPoints" : [1,2,3]},
      "1" : {"connectedPoints" : [0,2,3]},
      "2" : {"connectedPoints" : [0,1,3]},
      "3" : {"connectedPoints" : [0,1,2]}
    }
  },
  {
    "level" : 2,
    "circles" : [{"x":92, "y":85},
                {"x":253, "y":13},
                {"x":393, "y":86},
                {"x":390, "y":214},
                {"x":248, "y":275},
                {"x":95, "y":216}],
    "relationship" : {
      "0" : {"connectedPoints" : [2,3,4]},
      "1" : {"connectedPoints" : [3,5]},
      "2" : {"connectedPoints" : [0,4,5]},
      "3" : {"connectedPoints" : [0,1,5]},
      "4" : {"connectedPoints" : [0,2]},
      "5" : {"connectedPoints" : [1,2,3]}
    }
  }
];

//设置初始关卡数据
function setupCurrentLevel(){
  untangleGame.circles = [];
  untangleGame.steps = 0;
  var level = untangleGame.levels[untangleGame.currentLevel];
  for (var i = 0; i < level.circles.length; i++) {
    untangleGame.circles.push(new Circle(level.circles[i].x, level.circles[i].y, 10)); 
  }
  connectCircles();
  updateLineIntersection();
}

//检测是否通关
function checkLevelCompleteness() {
  if ($("#progress").html() == "100") {
    if (untangleGame.currentLevel+1 < untangleGame.levels.length) {
      untangleGame.currentLevel++;
    } else {
      alert("Game over!!!")
    }
    setupCurrentLevel();
  }
}

//更新游戏进度
function updateLevelProgress(){
  var progress = 0;
  for (var i = 0; i < untangleGame.lines.length; i++) {
    if(untangleGame.lines[i].thickness == untangleGame.thinLineThickness){
      progress++;
    }
  }
  var progressPercentage = Math.floor(progress/untangleGame.lines.length*100);
  $("#progress").html(progressPercentage);
  $("#level").html(untangleGame.currentLevel);
  $("#steps").html(untangleGame.steps);
}

//点对象声明
function Circle(x,y,radius){
  this.x = x;
  this.y = y;
  this.radius = radius;
}
//点对象--描点方法
function drawCircle(ctx,x,y,radius){
  ctx.fillStyle = "rgba(200,200,100,.9)";
  ctx.beginPath();
  ctx.arc(x,y,radius,0,Math.PI*2,true);
  ctx.closePath();
  ctx.fill();
}

//线对象声明
function Line(startPoint,endPoint,thickness){
  this.startPoint = startPoint;
  this.endPoint = endPoint;
  this.thickness = thickness;
}
//线对象--画线方法
function drawLine(ctx,x1,y1,x2,y2,thickness) {
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.lineWidth = thickness;
  ctx.strokeStyle = "#cfc";
  ctx.stroke();
}

//将每个圆用线互相连接
function connectCircles () {
  var level = untangleGame.levels[untangleGame.currentLevel];
  untangleGame.lines.length = 0;
  for (var i in level.relationship) {
    var connectedPoints = level.relationship[i].connectedPoints;
    var startPoint = untangleGame.circles[i];
    for (var j in connectedPoints) {
      var endPoint = untangleGame.circles[connectedPoints[j]];
      untangleGame.lines.push(new Line(startPoint,endPoint,untangleGame.thinLineThickness));
    }
  }
  updateLineIntersection();
}

//判断线段是否相交
function isIntersect(line1, line2) {
  //转换line1成一般式 Ax+By=C
  var a1 = line1.endPoint.y - line1.startPoint.y;
  var b1 = line1.startPoint.x - line1.endPoint.x;
  var c1 = a1*line1.startPoint.x + b1*line1.startPoint.y;

  //转换line2成一般式 Ax+By=C
  var a2 = line2.endPoint.y - line2.startPoint.y;
  var b2 = line2.startPoint.x - line2.endPoint.x;
  var c2 = a2*line2.startPoint.x + b2*line2.startPoint.y;

  //计算交点
  var d = a1*b2 - a2*b1;
  //当d=0时，两线平行
  if (d == 0) {
    return false;
  } else {
    var x = (b2*c1 - b1*c2)/d;
    var y = (a1*c2 - a2*c1)/d;
    //检测交点是否在两条线段之上
    if ((isBetween(line1.startPoint.x,x,line1.endPoint.x)||isBetween(line1.startPoint.y,y,line1.endPoint.y)) && (isBetween(line2.startPoint.x,x,line2.endPoint.x)||isBetween(line2.startPoint.y,y,line2.endPoint.y))) {
      return true;
    }
  }
  return false;
}

//当b在a和c之间时，返回true，
//当a==b或b==c时，都返回false
function isBetween(a, b, c) {
  //为了避免浮点数运算两值几乎相等，只相差0.000001这种情况，用这种方式避免
  if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001) {
    return false;
  }
  return (a<b && b<c) || (a>b && b>c);
}

//把相交的线加粗
function updateLineIntersection() {
  for (var i = 0; i < untangleGame.lines.length; i++) {
    for (var j = 0; j < i; j++) {
      var line1 = untangleGame.lines[i];
      var line2 = untangleGame.lines[j];
      if (isIntersect(line1,line2)) {
        line1.thickness = untangleGame.boldLineThickness;
        line2.thickness = untangleGame.boldLineThickness;
      }
    }
  }
}

//主循环
function gameloop() {
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext("2d");

  //清空画布
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for (var i = 0; i < untangleGame.lines.length; i++) {
    var line = untangleGame.lines[i];
    var startPoint = line.startPoint;
    var endPoint = line.endPoint;
    var thickness = line.thickness;
    drawLine(ctx,startPoint.x,startPoint.y,endPoint.x,endPoint.y,thickness);
  }
  for (var i = 0; i < untangleGame.circles.length; i++) {
    var circle = untangleGame.circles[i];
    drawCircle(ctx,circle.x,circle.y,circle.radius);
  }
}

$(function(){
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  
  // var circleRadius = 10;
  // var circleCount = 5;
  // for (var i = 0; i < circleCount; i++) {
  //   var x = Math.random()*width;
  //   var y = Math.random()*height;
  //   drawCircle(ctx,x,y,circleRadius);
  //   untangleGame.circles.push(new Circle(x,y,circleRadius));
  // }
  setupCurrentLevel();
  connectCircles();

  //鼠标监听事件，检查按下鼠标的位置是否在圆点上，并设置该圆可拖动
  $("#game").mousedown(function(event) {
    var canvasPosition = $(this).offset();
    var mouseX = (event.pageX - canvasPosition.left) || 0;
    var mouseY = (event.pageY - canvasPosition.top) || 0;
    for (var i = 0; i < untangleGame.circles.length; i++) {
      var circleX = untangleGame.circles[i].x;
      var circleY = untangleGame.circles[i].y;
      var radius = untangleGame.circles[i].radius;

      if (Math.pow(mouseX-circleX,2) + Math.pow(mouseY-circleY,2) < Math.pow(radius,2)) {
        untangleGame.targetCircle = i;
        break;
      }
    }
  });

  //监听鼠标移动事件，拖拽圆点
  $("#game").mousemove(function(event) {
    if (untangleGame.targetCircle != undefined) {
      var canvasPosition = $(this).offset();
      var mouseX = (event.pageX - canvasPosition.left) || 0;
      var mouseY = (event.pageY - canvasPosition.top) || 0;
      var radius = untangleGame.circles[untangleGame.targetCircle].radius;
      untangleGame.circles[untangleGame.targetCircle] = new Circle(mouseX,mouseY,radius);
    }
    connectCircles();
    updateLineIntersection();
    updateLevelProgress();
  });

  //监听鼠标松开事件
  $("#game").mouseup(function(event) {
    untangleGame.targetCircle = undefined;
    ++untangleGame.steps;
    //放开鼠标检查是否通关
    checkLevelCompleteness();
  });

  //设置主循环
  setInterval(gameloop, 30);
});
