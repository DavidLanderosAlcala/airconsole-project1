

var LevelCompleteScreen = (function(){

  function init()
  {
      document.querySelector("#level-complete-continue").addEventListener("click", function(){
          hide();
          LevelSelector.show();
      });
  }

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
      },300);
  }

  function hide()
  {
      document.querySelector("#level-complete-dialog").dataset.state = "0";
      var stars = document.querySelectorAll(".level-complete-star");
      for(var i = 0; i < stars.length; i++)
      {
          stars[i].dataset.filled = "false";
          stars[i].dataset.state = "0";
      }
  }

  return { init       : init,
           showScreen : showScreen };
})();

LevelCompleteScreen.init();
