
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
    var subtitle_interval = null;

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
                    if(cursor.isPressed) { Game.lineTo( cursor ); }
                    else { Game.moveTo( cursor ); }
                }
                else if(e.key == "pad_a")
                {
                    cursor.isPressed = e.value == 1 ? true : false;
                    if(!e.value) { Game.closePath(); }
                }
                else if(e.key == "pad_b")
                {
                    if(!e.value) { Game.erease(); }
                }
                else if(e.key == "pad_select")
                {
                    if(e.value == 0) { Game.changeTool(); }
                }
            });
        }

        Game.init({
            canvas : document.querySelector("#main_canvas"),
            width  : width,
            height : height,
        });

        //setLogoVisibility(false);

    }

    ///** @func setLogoVisibility
    //  * @desc show/hide the logo using a CSS3 transition
    //  * @param visible {boolean} send true for show the logo or false to hide it
    //  */
    //function setLogoVisibility(visible)
    //{
    //    document.getElementById("main_logo")
    //    .style.opacity = visible ? 1.0 : 0.0;
    //}

    /** @func setTitleText
      * @desc It sets the title
      * @param text {string} the text to be shown
      */
    function setTitleText(text)
    {
        document.getElementById("title_label")
        .innerHTML = text;
    }

    /** @func setSubtitleText
      * @desc It sets the Subtitle
      * @param text {string} the text to be shown
      */
    function setSubtitleText(text, preventAnimation)
    {
        var elem = document.getElementById("subtitle_label");
        if(subtitle_interval != null)
        {
            clearInterval(subtitle_interval);
            subtitle_interval = null;
            elem.innerHTML = "";
        }
        if(preventAnimation)
        {
            elem.innerHTML = text;
        }
        else
        {
            var current_length = 0;
            subtitle_interval = setInterval(function(){
                elem.innerHTML = text.substring(0, current_length++);
                if(current_length > text.length)
                {
                    clearInterval(subtitle_interval);
                    subtitle_interval = null;
                }
            }, 50);
        }
    }

    /** @func requestFullscreen
      * @desc requests fullscreen
      */
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

    /** @func exitFullscreen
      * @desc exits fullscreen
      */
    function exitFullscreen()
    {
        document.exitFullscreen = document.exitFullscreen ||
                                  document.mozCancelFullScreen ||
                                  document.webkitExitFullscreen ||
                                  document.msExitFullscreen;
        document.exitFullscreen();
    }

    /** @func isInFullscreen
      */
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
        Game.adjustToViewPort();
    }

    /** @func disableContextMenu
      * @desc It disables the default context menu
      */
    function disableContextMenu()
    {
        document.addEventListener('contextmenu', function(event){ event.preventDefault()});
    }

    /** @func getWidth
      * @desc Returns the current game width
      */
    function getWidth()
    {
        return width;
    }

    /** @func getHeight
      * @desc Returns the current game height
      */
    function getHeight()
    {
        return height;
    }

    function onResize()
    {
        adjustToViewPort();
        Game.restartLevel();
    }

    return { init              : init,
             setTitleText      : setTitleText,
             setTitle          : setTitleText,
             setSubtitleText   : setSubtitleText,
             setSubtitle       : setSubtitleText,
             getWidth          : getWidth,
             getHeight         : getHeight,
             isInFullscreen    : isInFullscreen,
             exitFullscreen    : exitFullscreen,
             requestFullscreen : requestFullscreen };

})();

