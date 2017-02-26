

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

    /** @func checkbox
      * @desc converts DOM elements into checkboxes and installs an event listener
      * @param selector {string} the CSS selector to hook the DOM elements
      * @param callback {function} called when the value changes
      */
    function checkbox(selector, callback)
    {
        button(selector, function(e){
            if(!e.isPressed)
            {
                if(e.sender.__checkbox_checked == undefined)
                {
                    e.sender.__checkbox_checked = true;
                    callback({ sender: e.sender, checked : true});
                }
                else
                {
                    e.sender.__checkbox_checked = !e.sender.__checkbox_checked;
                    callback({ sender: e.sender, checked : e.sender.__checkbox_checked});
                }
            }
        });
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
                if(isPressed)
                {
                    event.isPressed = false;
                    callback(event);
                }
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
            var identifier = 0;
            element.addEventListener("touchstart", function(e) {
                e.preventDefault();
                event.type = "touchstart";
                var coords = validateCoords(element, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                identifier = e.changedTouches[0].identifier;
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
                var t = getTouchById(e.changedTouches, identifier);
                var coords = validateCoords(element, t.clientX, t.clientY);
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

    function getTouchById(array, id)
    {
       for(var i = 0; i < array.length; i++)
       {
          if(array[i].identifier == id)
              return array[i];
       }
       return array[0];
    }

    function validateCoords(elem, x, y)
    {
        var rect = elem.getBoundingClientRect();
        x = x -rect.left;
        y = y -rect.top;
        if(x < 0) x = 0;
        if(y < 0) y = 0;
        if(x > rect.width) x =  rect.width;
        if(y > rect.height) y = rect.height;
        return { x : x, y : y };
    }

	return { button   : button,
	         surface  : surface,
             checkbox : checkbox };
})();
