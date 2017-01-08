
/**
  * @module Controller
  */
var Controller = (function(){
  
    var airConsole;
  
    /** @func init
      * @desc Called when the DOM is loaded
      */
    function init()
    {
        airConsole = new AirConsole();
        DebugConsole.init(airConsole, DebugConsole.CONTROLLER);
        DebugConsole.log("Hola mundo");
    }

    return { init : init };

})();

Controller.init();
