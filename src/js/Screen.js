
/**
  * @module Screen
  */
var Screen = (function(){

     var cursor = {
       x : 400, y: 300,
       isPressed : false,
     }

    var airconsole;

    /** @func init
      * @desc Called when the DOM is loaded
      */
    function init()
    {
        airconsole = new AirConsole();
        AirConsoleBus.init(airconsole);
        DebugConsole.init(airconsole, true /* isScreen */);

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
            canvas : document.querySelector("canvas"),
            width  : 800,
            height : 600,
        });

        setSubtitleText("Hola mundo");
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

    /** @func setSubtitleText
      * @desc It sets the subtitles
      * @param text {string} the text to be shown
      */
    function setSubtitleText(text)
    {
        document.getElementById("subtitles_label")
        .innerHTML = text;
    }

    return { init : init,
             setLogoVisibility : setLogoVisibility,
             setSubtitleText : setSubtitleText };

})();

Screen.init();
