
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

            var packet = {
                header : AirConsoleBus.ON_GAMEPAD_EVENT,
                key : e.sender.id,
                value : e.isPressed,
            };
            airconsole.message(AirConsole.SCREEN, JSON.stringify(packet));
            if(e.isPressed)
            {
                e.sender.className += " pressed";
            }
            else
            {
                e.sender.className = e.sender.className.replace(" pressed","");
            }
            DebugConsole.log(e.sender.id + "pressed: " + e.isPressed);
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
