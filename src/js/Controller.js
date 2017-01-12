
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
        DebugConsole.init(airconsole, false);
        
        airconsole.onConnect = function() {
            DebugConsole.log("Hola mundo");
        };
    }

    return { init : init };

})();
Controller.init();


