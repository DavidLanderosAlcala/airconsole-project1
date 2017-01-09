
/**
  * @module Screen
  */
var Screen = (function(){
  
    var airconsole;
    var canvas;
    var context;

    /** @func init
      * @desc Called when the DOM is loaded
      */
    function init()
    {
        airconsole = new AirConsole();
        DebugConsole.init(airconsole, true);
        canvas = document.getElementById("main_canvas");
        context = canvas.getContext("2d");
        Sprite.init(canvas, context);
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
