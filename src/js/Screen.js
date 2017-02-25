
/**
  * @module Screen
  */
var Screen = (function(){

     var cursor = {
       x : 400, y: 300,
       isPressed : false,
     }

    var airconsole;
    var width;
    var height;

    /** @func init
      * @desc Called when the DOM is loaded
      */
    function init()
    {
        adjustToViewPort();
        disableContextMenu();
        airconsole = new AirConsole();
        AirConsoleBus.init(airconsole);
        DebugConsole.init(airconsole, true /* isScreen */);
        if(isInFullScreen())
        {
            DebugConsole.log("Fullscreen!!!!");
        }
        else
        {
            DebugConsole.log("Normal screen");
        }

        if(Utils.isRunningOnAirConsole())
        {
            DebugConsole.log("running on airconsole");
        }
        else
        {
            DebugConsole.log("running as normal webapp");
        }

        AirConsoleBus.on("gamepadevent", function(e){
            if(e.key == "touchpad")
            {
                cursor.x += e.value.x * 100;
                cursor.y += e.value.y * 100;

                if(cursor.x < 0 ) cursor.x = 0;
                if(cursor.y < 0 ) cursor.y = 0;
                if(cursor.x > 800 ) cursor.x = 800;
                if(cursor.y > 600 ) cursor.y = 600;

                if(cursor.isPressed)
                {
                    CrayonPhysics.lineTo( cursor );
                }
                else
                {
                    CrayonPhysics.moveTo( cursor );
                }

            }
            else if(e.key == "pad_a")
            {
                cursor.isPressed = e.value == 1 ? true : false;
                if(!e.value)
                {
                    CrayonPhysics.closePath();
                }
            }
            else if(e.key == "pad_b")
            {
                if(!e.value)
                {
                    CrayonPhysics.erease();
                }
            }
            else if(e.key == "pad_select")
            {
                if(!e.value)
                {
                    CrayonPhysics.changeTool();
                }
            }

        });

        CrayonPhysics.init({
            canvas : document.querySelector("#main_canvas"),
            width  : width,
            height : height,
        });

        setTitleText("Your text goes here");
        setLogoVisibility(false);

    }

    /** @func setLogoVisibility
      * @desc show/hide the logo using a CSS3 transition
      * @param visible {boolean} send true for show the logo or false to hide it
      */
    function setLogoVisibility(visible)
    {
        document.getElementById("main_logo")
        .style.opacity = visible ? 1.0 : 0.0;
    }

    /** @func setTitleText
      * @desc It sets the title
      * @param text {string} the text to be shown
      */
    function setTitleText(text)
    {
        document.getElementById("title_label")
        .innerHTML = text;
    }

    function requestFullScreen()
    {
        var el = document.documentElement,
          rfs = el.requestFullscreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            || el.msRequestFullscreen;
        rfs.call(el);
    }

    function isInFullScreen()
    {
        return (window.fullScreen) ||
               (window.innerWidth == screen.width &&
               window.innerHeight == screen.height);
    }


    function adjustToViewPort()
    {
        var canvas = document.querySelector("#main_canvas");
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        width = rect.width;
        height = rect.height;
    }

    function disableContextMenu()
    {
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    function getWidth()
    {
        return width;
    }

    function getHeight()
    {
        return height;
    }

    return { init              : init,
             setLogoVisibility : setLogoVisibility,
             setTitleText      : setTitleText,
             getWidth          : getWidth,
             getHeight         : getHeight,
             isInFullScreen    : isInFullScreen };

})();

Screen.init();
