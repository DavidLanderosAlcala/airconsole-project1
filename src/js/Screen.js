
/**
  * @module Screen
  */
var Screen = (function(){

     var cursor = {
       x : 0, y: 0,
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
        AirConsoleBus.on("gamepadevent", function(e){
            if(e.key == "touchpad")
            {
                cursor.x += e.value.x;
                cursor.y += e.value.y;

                if(cursor.x < 0 ) cursor.x = 0;
                if(cursor.y < 0 ) cursor.y = 0;
                if(cursor.x > 800 ) cursor.x = 800;
                if(cursor.y > 600 ) cursor.y = 600;


                CrayonPhysics.onMouseMove({clientX : cursor.x, clientY : cursor.y });
                if(cursor.isPressed)
                {
                  CrayonPhysics.onTouchEvent({
                      type :  "touchmove",
                      x : cursor.x,
                      y : cursor.y
                  });
                }
            }
            else if(e.key == "pad_a") {

              cursor.isPressed = e.value == 1 ? true : false;

              CrayonPhysics.onTouchEvent({
                  type :  e.value == 1 ? "touchstart" : "touchend",
                  x : cursor.x,
                  y : cursor.y
              });
            }


        });

        var canvas = document.querySelector("canvas");
        var context = canvas.getContext("2d");

        CrayonPhysics.init({
          canvas : canvas,
          context : context,
        });
        //setLogoVisibility(false);
        setSubtitleText("");
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
