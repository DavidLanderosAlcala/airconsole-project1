
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
        AirConsoleBus.init(airconsole);
        DebugConsole.init(airconsole, false); // false for controller

        AirConsoleBus.on("connect", function(device_id) {
            DebugConsole.log("Hola mundo Connected");
        });

        setTimeout(function() {
            DebugConsole.log("Hola mundo setTimeout");
        }, 1000);
    }

    return { init : init };

})();
Controller.init();
