
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

        airconsole.onConnect = function(device_id) {
            DebugConsole.log("Hola mundo Connected");
        };

        airconsole.onReady = function(code) {
            DebugConsole.log("Hola mundo Ready");
        };

        setTimeout(function(){
            DebugConsole.log("Hola mundo setTimeout");
        }, 1000);
    }

    return { init : init };

})();
Controller.init();
