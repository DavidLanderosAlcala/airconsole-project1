
/**
  * @Module Touchpad
  */
var Touchpad = (function(){

    var last_pos = null;
    var onmove_callback = null;

    /** @func surface
      * @desc converts DOM elements into touchpad and installs an event listener
      * @param selector {string} the CSS selector to hook the DOM elements
      * @param callback {function} called for each event ocurred in the touchpad
      */
    function init(selector, callback)
    {
        onmove_callback = callback;
        Touch.surface(selector, onTouchEvent);
    }

    function normalize(value)
    {
        var max = 100;
        if(value > max) return 1.0;
        if(value < -max) return -1.0;
        return value / max;
    }

    function onTouchEvent(e)
    {
        if(e.type == "touchend")
        {
            last_pos = null;
            return;
        }
        if(last_pos == null)
        {
            last_pos = {
                x : e.x,
                y : e.y
            };
        }
        else
        {
            var disp = {
               x : (e.x - last_pos.x),
               y : (e.y - last_pos.y)
            };
            disp.x = normalize(disp.x);
            disp.y = normalize(disp.y);
            onmove_callback(disp);
            last_pos.x = e.x;
            last_pos.y = e.y;
        }
    }
    return { init : init };
})();
