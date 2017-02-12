
/**
  * @module AirConsoleBus
  * @desc since airconsole only allows to set one single listener for each event
  * i decided to make a simple hub for event broadcasting.
  */
var AirConsoleBus = (function(){

    // airconsole raw events
    const ON_MESSAGE = 0;
    const ON_CONNECT = 1;
    const ON_DISCONNECT = 2;
    const ON_READY = 3;

    // standar events
    const ON_DEBUG = 4;
    const ON_GAMEPAD_EVENT = 5;
    const ON_VIBRATE_REQUEST = 6;
    const ON_RING_REQUEST = 7;

    // game specific events
    // TBD

    var airconsole;
    var callbacks = [ [], [], [], [], [], [], [], [] ];

    /**
      * @func init
      * @param {object} airconsole_instance the airConsole's instance
      * @desc must be called after creating the airConsole object
      */
    function init(airconsole_instance)
    {
        airconsole = airconsole_instance;
        airconsole.onMessage = triggerOnMessage;
        airconsole.onConnect = triggerOnConnect;
        airconsole.onDisconnect = triggerOnDisconnect;
        on("message", inner_OnMessage);
    }

    /**
      * @func on
      * @param {string} event "message", "connect", "disconnect", "ready"
      * @param {function} callback the callback to be executed
      * @desc It adds a new event listener
      */
    function on(evt, callback)
    {
        var e;
        switch(evt)
        {
            case "message"        : e = ON_MESSAGE; break;
            case "connect"        : e = ON_CONNECT; break;
            case "disconnect"     : e = ON_DISCONNECT; break;
            case "ready"          : e = ON_READY; break;
            case "debug"          : e = ON_DEBUG; break;
            case "gamepadevent"   : e = ON_GAMEPAD_EVENT; break;
            case "vibraterequest" : e = ON_VIBRATE_REQUEST; break;
            case "ringrequest"    : e = ON_RING_REQUEST; break;
        }
        addEventListener(e, callback);
    }

    /**
      * @func addEventListener
      * @param {eventType} event ON_MESSAGE, ON_CONNECT or ON_DISCONNECT
      * @param {function} callback the callback to be executed
      * @desc It adds a new event listener
      */
    function addEventListener(event, callback)
    {
    	callbacks[event].push(callback);
    }

    /**
      * @func removeEventListener
      * @param {eventType} event ON_MESSAGE, ON_CONNECT, ON_DISCONNECT
      * @param {function} callback the callback to be removed
      * @desc It removes an event listener
      */
    function removeEventListener(event, callback)
    {
    	var i, l = callbacks[event].length;
    	for(i = 0; i < l; i++)
    	{
            if(callbacks[event] == callback)
            {
                callbacks[event].slice(i, 1);
            }
    	}
    }

    function triggerOnMessage(from, message)
    {
        var i, l = callbacks[ON_MESSAGE].length;
        for(i = 0; i < l; i++)
        {
        	callbacks[ON_MESSAGE][i](from, message);
        }
    }

    function triggerOnConnect(device_id)
    {
        var i, l = callbacks[ON_CONNECT].length;
        for(i = 0; i < l; i++)
        {
        	callbacks[ON_CONNECT][i](device_id);
        }
    }

    function triggerOnDisconnect(device_id)
    {
        var i, l = callbacks[ON_DISCONNECT].length;
        for(i = 0; i < l; i++)
        {
        	callbacks[ON_DISCONNECT][i](device_id);
        }
    }

    function triggerCustomEvent(event, params)
    {
        var i, l = callbacks[event].length;
        for(i = 0; i < l; i++)
        {
          callbacks[event][i](params);
        }
    }

    function inner_OnMessage(from, message)
    {
        var packet = { };
        try
        {
            if(message[0] == '{') // is it a JSON ?
            {
                packet = JSON.parse(message); 
            }
            else
            {
                DebugConsole.log(message);
                packet = GamepadEventCompressor.uncompress(message);
            }
            triggerCustomEvent(packet.header, packet);
        } catch(e) { }
    }

    return { init                : init,
             on                  : on,
             addEventListener    : addEventListener,
             removeEventListener : removeEventListener,
             ON_MESSAGE          : ON_MESSAGE,
             ON_CONNECT          : ON_CONNECT,
             ON_DISCONNECT       : ON_DISCONNECT,
             ON_DEBUG            : ON_DEBUG,
             ON_GAMEPAD_EVENT    : ON_GAMEPAD_EVENT,
             ON_VIBRATE_REQUEST  : ON_VIBRATE_REQUEST,
             ON_RING_REQUEST     : ON_RING_REQUEST };
})();
