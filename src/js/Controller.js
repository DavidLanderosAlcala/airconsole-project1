
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
        setupButtons();
        airconsole = new AirConsole({"orientation":"landscape"});
        AirConsoleBus.init(airconsole);
        DebugConsole.init(airconsole, false); // false for controller

        AirConsoleBus.on("connect", function(device_id) {
            DebugConsole.log("Hola mundo Connected");
        });

        setTimeout(function() {
            DebugConsole.log("Hola mundo setTimeout");
        }, 1000);

        AirConsoleBus.on("vibraterequest", onVibrateRequest);
        AirConsoleBus.on("ringrequest", onRingRequest);
    }

    function setupButtons()
    {
        var buttons = document.getElementsByClassName("button");
        var i, l = buttons.length;
        for(i = 0; i < l; i++)
        {
            buttons[i].addEventListener("touchstart", function() {
                //cleanUpAllButtons();
                this.className += " pressed";
                clicked = true;
                var pattern = 500;
                switch(this.id)
                {
                    case "buttonA1" : pattern = 10; break;
                    case "buttonA2" : pattern = 20; break;
                    case "buttonB1" : pattern = 30; break;
                    case "buttonB2" : pattern = 40; break;
                }
                navigator.vibrate(pattern);
                DebugConsole.log("Pressed: " + this.id);
            });
            buttons[i].addEventListener("mousedown", function() {
                //cleanUpAllButtons();
                this.className += " pressed";
                clicked = true;
            });
            buttons[i].addEventListener("mouseup", function(){
                this.className = this.className.replace(" pressed","");
                clicked = false;
            });
            buttons[i].addEventListener("touchend", function(){
                this.className = this.className.replace(" pressed","");
                clicked = false;
                DebugConsole.log("Released: " + this.id);
            });

            buttons[i].addEventListener("mouseenter", function() {
                if(clicked)
                {
                    cleanUpAllButtons();
                    this.className += " pressed";
                }
            });
            buttons[i].addEventListener("mouseleave", function(){
                this.className = this.className.replace(" pressed","");
            });
        }
    }

    function cleanUpAllButtons()
    {
        var buttons = document.getElementsByClassName("button");
        var i, l = buttons.length;
        for(i = 0; i < l; i++)
        {
            buttons[i].className = buttons[i].className.replace("pressed","");
        }
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
