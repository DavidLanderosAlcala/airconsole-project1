
/**
  * @module Controller
  */
var Controller = (function(){

    var airconsole;
    var current_tool_index;
    var tools = [];

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

        current_tool_index = 0;
        tools.push("pencil");
        tools.push("ereaser");
        tools.push("tack");
    }

    /** @func onTouchpadEvent
      */
    function onTouchpadEvent(e)
    {
        var packet = {
            header: AirConsoleBus.ON_GAMEPAD_EVENT,
            key : "touchpad",
            value : e, // this is vector (x,y)
        }
        var packet2 =  GamepadEventCompressor.compress(packet);
        airconsole.message(AirConsole.SCREEN, packet2);
    }

    /** @func onButtonEvent
      */
    function onButtonEvent(e)
    {
        var key;
        if(e.sender.className.indexOf("selectButton") == 0)
        {
            key = "pad_select";
            if(e.isPressed)
            {
                changeTool();
                vibrate(50);
            }
        }
        else
        {
            key = "pad_a";
            if(current_tool_index != 0)
                key = "pad_b";
        }

        var packet =
        {
            header: AirConsoleBus.ON_GAMEPAD_EVENT,
            key : key,
            value : e.isPressed ? 1 : 0,
        }
        var compressed = GamepadEventCompressor.compress(packet);
        airconsole.message(AirConsole.SCREEN, compressed);
        if(e.isPressed) e.sender.className += " pressed";
        else e.sender.className = e.sender.className.replace(" pressed","");
    }

    /** @func onVibrateRequest
      * @desc Called when the screen requests a vibration
      */
    function onVibrateRequest(data)
    {
        vibrate(data);
    }

    /** @func vibrate
      * @desc cause a vibration pattern on the device
      * @param pattern {array} yeap, the pattern...
      */
    function vibrate(pattern)
    {
        if(Utils.isMobileNavigator())
        {
            navigator.vibrate(data.pattern);
        }
    }

    /** @func changeTool
      * @desc Selects the next tool
      */
    function changeTool()
    {
        current_tool_index++;
        if(current_tool_index >= tools.length)
        {
            current_tool_index = 0;
        }
        document.querySelector(".actionHint")
        .dataset.tool = tools[current_tool_index];
    }

    /** @func onRingRequest
      * @desc Called when the screen requests a ring event
      */
    function onRingRequest(data)
    {
        // TODO
        DebugConsole.log("Sonando.. beeep!!");
    }    

    return { init : init };

})();
Controller.init();
