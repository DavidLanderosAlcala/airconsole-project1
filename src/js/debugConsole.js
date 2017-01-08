

var DebugConsole = (function(){
  
  var airconsole = null;
  var isScreen;
  
  function init(_airconsole, _isScreen)
  {
      isScreen = _isScreen;
      airconsole = _airconsole;
      airconsole.onMessage = function(from, data)
      {

          if(data.indexOf("DEBUG-CONSOLE") == 0)
          {
              var message = data.replace("DEBUG-CONSOLE: ","");
              console.log("CONTROLLER : " + message);
          }
      };
  }
  
  function log(message)
  {
      if(isScreen)
      {
          console.log("SCREEN : " + message);
      }
      else
      {
           document.getElementById("debug").innerHTML = "<br><br>Usando DebugConsole.log(...)";
           airconsole.message(AirConsole.SCREEN, "DEBUG-CONSOLE: " + message);
      }
  }
  
  return { init : init,
           log  : log   };
})();