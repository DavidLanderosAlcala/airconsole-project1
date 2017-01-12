
/**
  * @module DebugConsole
  */
var DebugConsole = (function(){
  
  var airconsole = null;
  var isScreen;
  
  /** @func init
    * @desc Called from Screen.init and Controller.init.
    * It prepares everything to log events on the screen´s console
    * @param {object} airconsole the AirConsole instance to be used
    * @param {boolean} isScreen must be true for the screen and false for each controller
    */  
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
  
  /** @func log
   * @desc Shows a message on the screen's console
   * @param {string} message The message to be logged
   */  
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
