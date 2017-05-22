var matchingGame={};
matchingGame.deck = ['AJ','AQ','AK','BJ','BQ','BK','CJ','CQ','CK','DJ','DQ','DK'];
matchingGame.cards = [];
var steps = 0;

function shuffleCards(){
  matchingGame.deck.sort(shuffle);  //先洗一次所有牌，洗乱
  for (var i = 0; i < 6; i++) {
    matchingGame.cards.push(matchingGame.deck[i]);  //从洗过的所有牌里抽出前6个不同的牌，每个放2张到cards牌组里
    matchingGame.cards.push(matchingGame.deck[i]);
  }
  for (var i = 0; i < 11; i++) {
    matchingGame.cards.sort(shuffle);  //再洗十次cards牌组，保证充分洗乱
  }
}

function shuffle(){
  return 0.5 - Math.random();
}

function selectCard(){
  if ($(".card-flipped").size()>1) {
    return;
  }
  $(this).toggleClass('card-flipped');
  $("#steps").text(++steps);
  if ($(".card-flipped").size()==2) {
    setTimeout(checkPattern,700);
  }
}

function checkPattern(){
  if (isMatchedPattern()) {
    $(".card-flipped").removeClass('card-flipped').addClass('card-removed');
    $(".card-removed").bind('webkitTransitionEnd', removeTookCards);
  }else{
    $(".card-flipped").removeClass('card-flipped');
  }
}

function isMatchedPattern(){
  var cards = $(".card-flipped");
  var pattern = $(cards[0]).data('pattern');
  var another = $(cards[1]).data('pattern');
  return (pattern == another);
}

function removeTookCards(){
  $(".card-removed").remove();
  endGame();
}

function endGame(){
  console.log($("#cards").children().size());
  if ($("#cards").children().size()==0) {
    alert("游戏结束！总共用了"+steps+"步！");
    location.reload();
  }
}

$(function(){
  shuffleCards(); //洗牌

  for (var i = 0; i < 11; i++) {
    $(".card:first-child").clone().appendTo('#cards');
  }
  $("#cards").children().each(function(index, el) {
    $(this).css({
      left: ($(this).width()+50) * (index%4),
      top: ($(this).height()+30) * Math.floor(index/4)
    }); 
    var pattern = matchingGame.cards.pop();
    $(this).find('.back').addClass(pattern);
    $(this).attr('data-pattern', pattern);
    $(this).click(selectCard);
  });
});
