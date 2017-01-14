
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
                navigator.vibrate(15);
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

    return { init : init };

})();
Controller.init();
