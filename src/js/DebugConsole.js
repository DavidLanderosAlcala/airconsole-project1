
/**
  * @module DebugConsole
  */
var DebugConsole = (function(){

  var airconsole;
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
      AirConsoleBus.on("debug", function(info) {
          console.log("CONTROLLER : " + info.message);
      });
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
           var packet = { header: AirConsoleBus.ON_DEBUG, message : message };
           airconsole.message(AirConsole.SCREEN, JSON.stringify(packet));
      }
  }

  return { init : init,
           log  : log   };
})();
