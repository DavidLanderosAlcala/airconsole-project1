
/**
  * @module Screen
  */
var Screen = (function(){

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

          console.log(e);

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
