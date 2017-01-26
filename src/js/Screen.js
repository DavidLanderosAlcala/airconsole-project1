
/**
  * @module Screen
  */
var Screen = (function(){

    var airconsole;
    var started = false;

    /** @func init
      * @desc Called when the DOM is loaded
      */
    function init()
    {
        airconsole = new AirConsole();
        AirConsoleBus.init(airconsole);
        DebugConsole.init(airconsole, true /* isScreen */);
        PuzzleBobble.init("#canvas1", "#canvas2");
        setLogoVisibility(false);

        AirConsoleBus.on("gamepadevent", function(e) {

          DebugConsole.log("gamepad event: " + JSON.stringify(e));

            if(!started)
            {
                started = true;
                PuzzleBobble.start();
                return;
            }

            PuzzleBobble.handleKeyEvent(e.key, e.value);

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

    return { init : init,
             setLogoVisibility : setLogoVisibility,
             setSubtitleText : setSubtitleText };

})();

Screen.init();
