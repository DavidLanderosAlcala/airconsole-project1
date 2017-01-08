

var DebugConsole = (function(){
  
  var airConsole = null;
  const SCREEN = 0;
  const CONTROLLER = 1;
  var side;
  
  function init(_airConsole, _side)
  {
      side = _side
      airConsole = _airConsole;
      airConsole.onMessage = function(from, data){
          if(data.indexOf("DEBUG-CONSOLE") == 0)
          {
              log(data.replace("DEBUG-CONSOLE : ",""));
          }
      };
  }
  
  function log(message)
  {
     console.log("ejecutando DebugConsole.log");
      if(side ==  SCREEN)
      {
          console.log("SCREEN : " + message);
      }
      else {
        airConsole.message(AirConsole.SCREEN, "DEBUG-CONSOLE: " + message);
      }
  }
  
  return { init: init,
           log : log,
           SCREEN : SCREEN,
           CONTROLLER : CONTROLLER };
})();