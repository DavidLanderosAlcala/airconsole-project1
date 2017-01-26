
/**
  * @module Screen
  */
var Screen = (function(){

    var airconsole;
    var canvas;
    var context;

    var spaceInvadersInstance = null;

    /** @func init
      * @desc Called when the DOM is loaded
      */
    function init()
    {
        airconsole = new AirConsole();
        AirConsoleBus.init(airconsole);
        DebugConsole.init(airconsole, true /* isScreen */);
        canvas = document.getElementById("main_canvas");
        context = canvas.getContext("2d");
        Sprite.init(canvas, context);

        // Space invaders
        new mygame.SpaceInvaders({
            modal : true,
            open : function() {
              setLogoVisibility(false);
              setSubtitleText("");
            }, 
            close : function() {}
        });

        AirConsoleBus.on("gamepadevent", function(e){
            switch(e.key)
            {
                case "right" : mygame.SpaceInvadersSingleton.keys.right = e.value == 1; break;
                case "left" : mygame.SpaceInvadersSingleton.keys.left = e.value == 1; break;
                case "pad_a" : mygame.SpaceInvadersSingleton.keys.down = e.value == 1; break;
            }
            DebugConsole.log("gamepadevent: " + e.key + " = " + e.value);
        });
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

    /** @func render
      * @desc It renders the scene, called from Screen.update
      */
    function render()
    {

    }

    /** @func update
      * @desc called before each frame to update the scene
      */
    function update()
    {
        render();
    }

    return { init : init,
             setLogoVisibility : setLogoVisibility,
             setSubtitleText : setSubtitleText };

})();

Screen.init();
