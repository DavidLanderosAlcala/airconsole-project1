

var LevelCompleteScreen = (function(){

  function showScreen(starscount)
  {
      document.querySelector("#level-complete-dialog").dataset.state = "1";
      var stars = document.querySelectorAll(".level-complete-star");
      for(var i = 0; i < starscount; i++)
      {
          stars[i].dataset.filled = "true";
      }
      var count = 0;
      var interval = setInterval(function(){
        count++;
        if(count < 4)
        {
             document.querySelector(".level-complete-star:nth-child(" + count + ")").dataset.state = "1";
        }
        else
        {
            document.querySelector(".level-complete-star:nth-child(3)").dataset.state = "2";
            clearInterval(interval);
        }
        if(count > 1)
        {
            document.querySelector(".level-complete-star:nth-child(" + (count-1) + ")").dataset.state = "2";
        }
      },500);
  }

  return { showScreen : showScreen };
})();


setTimeout(function(){
  LevelCompleteScreen.showScreen(2);
},1000);
