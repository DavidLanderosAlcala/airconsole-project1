
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

    function f(x)
    {
        var r = 1.0000000000000002e+000 * Math.pow(x,0)
        + -7.4999999999999734e-002 * Math.pow(x,1)
        +  3.7499999999999971e-002 * Math.pow(x,2);
        if(r > 4) return 4;
        return r;
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
            var length = Math.sqrt(disp.x * disp.x + disp.y * disp.y);
            var scale = f(length);
            disp.x *= scale;
            disp.y *= scale;
            onmove_callback(disp);
            last_pos.x = e.x;
            last_pos.y = e.y;
        }
    }
    return { init : init };
})();