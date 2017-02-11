
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
        airconsole = new AirConsole({"orientation":"landscape"});
        AirConsoleBus.init(airconsole);
        DebugConsole.init(airconsole, false /* isScreen */);   
        
        AirConsoleBus.on("vibraterequest", onVibrateRequest);
        AirConsoleBus.on("ringrequest", onRingRequest);

        Touchpad.init("#touchpad", onTouchpadEvent);
        Touch.button(".button", onButtonEvent);             
    }

    function onTouchpadEvent(e)
    {
        var packet = {
            header: AirConsoleBus.ON_GAMEPAD_EVENT,
            key : "touchpad",
            value : e, // this is vector (x,y)
        }
        airconsole.message(AirConsole.SCREEN, JSON.stringify(packet));
    }

    function onButtonEvent(e)
    {
        var packet = {
            header: AirConsoleBus.ON_GAMEPAD_EVENT,
            key : "pad_a",
            value : e.isPressed ? 1 : 0,
        }
        airconsole.message(AirConsole.SCREEN, JSON.stringify(packet));

        // ~~~~~~~~ Visual Effect ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
        if(e.isPressed)
            e.sender.className += " pressed";
        else
            e.sender.className = e.sender.className.replace(" pressed","");        
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
