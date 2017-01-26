
/**
  * @module Controller
  */
var Controller = (function(){

    var airconsole;
    var clicked = false;

    /** @func init
      * @desc Called when the DOM is loaded
      */
    function init()
    {
        airconsole = new AirConsole({"orientation":"landscape"});
        AirConsoleBus.init(airconsole);
        DebugConsole.init(airconsole, false /* isScreen */);
        
        AirConsoleBus.on("vibraterequest", onVibrateRequest);
        AirConsoleBus.on("ringrequest", onRingRequest);
        setupButtons();
    }

    function setupButtons()
    {
        Touch.button(".button", function(e) {

            DebugConsole.log("Button: " + e.sender.id + " has been " + (e.isPressed ? "pressed" : "released") );

            if(e.isPressed)
            {
                navigator.vibrate(100);
                e.sender.className += " pressed";
            }
            else
            {
                e.sender.className = e.sender.className.replace(" pressed","");
            }

        });
    }

    function onVibrateRequest(data)
    {
        navigator.vibrate(data.pattern);
    }

    function onRingRequest(data)
    {
        // TODO
        DebugConsole.log("Sonando.. beeep!!");
    }    

    return { init : init };

})();
Controller.init();
