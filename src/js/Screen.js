
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
        window.addEventListener("resize", onResize);
        adjustToViewPort();
        disableContextMenu();
        if(Utils.isRunningOnAirConsole())
        {
            airconsole = new AirConsole();
            AirConsoleBus.init(airconsole);
            DebugConsole.init(airconsole, true /* isScreen */);
            AirConsoleBus.on("gamepadevent", function(e) {
                if(e.key == "touchpad")
                {
                    cursor.x += e.value.x * 100;
                    cursor.y += e.value.y * 100;
                    if(cursor.x < 0 ) cursor.x = 0;
                    if(cursor.y < 0 ) cursor.y = 0;
                    if(cursor.x > width ) cursor.x = width;
                    if(cursor.y > height ) cursor.y = height;
                    if(cursor.isPressed) { CrayonPhysics.lineTo( cursor ); }
                    else { CrayonPhysics.moveTo( cursor ); }
                }
                else if(e.key == "pad_a")
                {
                    cursor.isPressed = e.value == 1 ? true : false;
                    if(!e.value) { CrayonPhysics.closePath(); }
                }
                else if(e.key == "pad_b")
                {
                    if(!e.value) { CrayonPhysics.erease(); }
                }
                else if(e.key == "pad_select")
                {
                    if(e.value == 0) { CrayonPhysics.changeTool(); }
                }
            });
        }

        CrayonPhysics.init({
            canvas : document.querySelector("#main_canvas"),
            width  : width,
            height : height,
        });

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

    function requestFullscreen()
    {
        var el = document.documentElement,
          rfs = el.requestFullscreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            || el.msRequestFullscreen;
        rfs.call(el);
        onResize();
    }

    function exitFullscreen()
    {
        document.exitFullscreen = document.exitFullscreen ||
                                  document.mozCancelFullScreen ||
                                  document.webkitExitFullscreen ||
                                  document.msExitFullscreen;
        document.exitFullscreen();
    }

    function isInFullscreen()
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

    function onResize()
    {
        adjustToViewPort();
        CrayonPhysics.restartLevel();
    }

    return { init              : init,
             setLogoVisibility : setLogoVisibility,
             setTitleText      : setTitleText,
             getWidth          : getWidth,
             getHeight         : getHeight,
             isInFullscreen    : isInFullscreen,
             exitFullscreen    : exitFullscreen,
             requestFullscreen : requestFullscreen };

})();

Screen.init();
