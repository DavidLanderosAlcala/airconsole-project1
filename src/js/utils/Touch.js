

/**
  * @Module Touch
  */
var Touch = (function() {

    /** @func button
      * @desc converts DOM elements into buttons and installs an event listener
      * @param selector {string} the CSS selector to hook the DOM elements
      * @param callback {function} called for each event ocurred with the buttons
      * @example
      * Touch.button(".my-button", function(e) {
      *     console.log("the button %s has been %s", e.sender.id, e.isPressed ? "pressed" : "released" );
      * });
      */
    function button(selector, callback)
    {
        var selection = document.querySelectorAll(selector);
        var i = 0, l = selection.length;
        for(i = 0; i < l; i++)
        {
            hookAllEventsForButton(selection[i], callback);
        }
    }

    /** @func surface
      * @desc converts DOM elements into touch surfaces such as virtual sticks, touchpads etc, and installs an event listener
      * @param selector {string} the CSS selector to hook the DOM elements
      * @param callback {function} called for each event ocurred with the surfaces
      */
    function surface(selector, callback)
    {
        var selection = document.querySelectorAll(selector);
        var i = 0, l = selection.length;
        for(i = 0; i < l; i++)
        {
            hookAllEventsForSurface(selection[i], callback);
        }
    }

    function hookAllEventsForButton(element, callback)
    {
        var event = {
            sender : element,
            isPressed : false,
        };
        if(Utils.isMobileNavigator())
        {
            element.addEventListener("touchstart", function(e) {
                event.isPressed = true;
                callback(event);
            });
            element.addEventListener("touchend", function(e) {
                event.isPressed = false;
                callback(event);
            });
            element.addEventListener("touchcancel", function(e) {
                event.isPressed = false;
                callback(event);
            });
        }
        else
        {
            element.addEventListener("mousedown", function(e) {
                event.isPressed = true;
                callback(event);
            });
            element.addEventListener("mouseup", function(e) {
                event.isPressed = false;
                callback(event);
            });
            element.addEventListener("mouseleave", function(e) {
                event.isPressed = false;
                callback(event);
            });
        }
    }

    function hookAllEventsForSurface(element, callback)
    {
        var event = {
            sender : element,
            type : "none",
            x : 0,
            y : 0,
        }

        if(Utils.isMobileNavigator())
        {
            element.addEventListener("touchstart", function(e) {
                e.preventDefault();
                event.type = "touchstart";
                var coords = validateCoords(element, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                event.x = coords.x;
                event.y = coords.y;
                callback(event);
            }, false);
            element.addEventListener("touchend", function(e) {
                e.preventDefault();
                event.type = "touchend";
                var coords = validateCoords(element, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                event.x = coords.x;
                event.y = coords.y;
                callback(event);
            }, false);
            element.addEventListener("touchmove", function(e) {
                e.preventDefault();
                event.type = "touchmove";
                var coords = validateCoords(element, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                event.x = coords.x;
                event.y = coords.y;
                callback(event);
            }, false);
        }
        else
        {
            var __isPressed = false;
            element.addEventListener("mousedown", function(e) {
                e.preventDefault();
                __isPressed = true;
                event.type = "touchstart";
                var coords = validateCoords(element, e.clientX, e.clientY);
                event.x = coords.x;
                event.y = coords.y;
                callback(event);
            });
            element.addEventListener("mouseup", function(e) {
                e.preventDefault();
                __isPressed = false;
                event.type = "touchend";
                var coords = validateCoords(element, e.clientX, e.clientY);
                event.x = coords.x;
                event.y = coords.y;
                callback(event);
            });
            element.addEventListener("mouseleave", function(e) {
                e.preventDefault();
                if(__isPressed)
                {
                    __isPressed = false;
                    event.type = "touchend";
                    var coords = validateCoords(element, e.clientX, e.clientY);
                    event.x = coords.x;
                    event.y = coords.y;
                    callback(event);
                }
            });
            element.addEventListener("mousemove", function(e) {
                e.preventDefault();
                if(__isPressed)
                {
                    event.type = "touchmove";
                    var coords = validateCoords(element, e.clientX, e.clientY);
                    event.x = coords.x;
                    event.y = coords.y;
                    callback(event);
                }
            });
        }
    }

    function validateCoords(elem, x, y)
    {
        var rect = elem.getBoundingClientRect();
        x = x -rect.x;
        y = x -rect.y;
        if(x < 0) x = 0;
        if(y < 0) y = 0;
        if(x > rect.width) x =  rect.width;
        if(y > rect.height) y = rect.height;
        return { x : x, y : y };
    }

	return { button  : button,
	         surface : surface };
})();
