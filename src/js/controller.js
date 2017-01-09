
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

        /* sending the first message after 1 seconds to ensure that
           the websocket is already connected. (looking for a better solution) */
        setInterval(function() {
            DebugConsole.log("Hola mundo");
        }, 1000);

    }

    return { init : init };

})();
Controller.init();


