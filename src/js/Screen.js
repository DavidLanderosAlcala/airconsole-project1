
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
        AirConsoleBus.init(airconsole);
        DebugConsole.init(airconsole, true /* isScreen */);
        canvas = document.getElementById("main_canvas");
        context = canvas.getContext("2d");
        Sprite.init(canvas, context);

        // example of vibrate request
        var contador = 0;
        setInterval(function(){
          setSubtitleText("contador: " + contador % 5);
          if(contador++ % 5 == 0)
          {
              var packet = { header : AirConsoleBus.ON_VIBRATE_REQUEST, pattern: [50, 10, 50, 10, 50] };
              airconsole.broadcast(JSON.stringify(packet));

              packet = { header : AirConsoleBus.ON_RING_REQUEST, pattern: [50, 10, 50, 10, 50] };
              airconsole.broadcast(JSON.stringify(packet));
          }
        }, 1000);
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
