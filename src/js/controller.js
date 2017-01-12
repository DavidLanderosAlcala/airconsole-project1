
/**
  * @module Controller
  */
var Controller = (function(){
  
    var airconsole;
  
    /** @func init
      * @desc Called when the DOM is loaded
      */
    function init()
    {
        airconsole = new AirConsole();
        airconsole.onReady = function() {
            DebugConsole.init(airconsole, false);
            DebugConsole.log("Hola mundo");
        };
    }

    return { init : init };

})();
Controller.init();


