

var Utils = (function(){

	function isMobileNavigator()
	{
        if( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i) )
        {
           return true;
        }
        else
        {
           return false;
        }
	}

    function isRunningOnAirConsole()
    {
        try
        {
            return window.self !== window.top;
        } catch (e)
        {
            return true;
        }
    }
	return { isMobileNavigator : isMobileNavigator,
             isRunningOnAirConsole : isRunningOnAirConsole };

})();