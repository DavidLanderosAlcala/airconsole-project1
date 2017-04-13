

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

    function removeCollinearPoints(polygon, umbral)
    {
        umbral = umbral || 0.1;
        var polydecomp_flavor = [];
        for(var i = 0; i < polygon.length; i++)
        {
            polydecomp_flavor.push([polygon[i].x, polygon[i].y]);
        }
        var matter_flavor = [];
        decomp.removeCollinearPoints(polydecomp_flavor, umbral);
        for(var i = 0; i < polydecomp_flavor.length; i++)
        {
            matter_flavor.push({
                x : polydecomp_flavor[i][0],
                y : polydecomp_flavor[i][1],
            });
        }
        return matter_flavor;
    }

    function matterToP2Flavor(vertices)
    {
        var poly = [];
        for(var i = 0; i < vertices.length; i++)
        {
            poly.push([vertices[i].x, vertices[i].y]);
        }
        return poly;
    }

    function p2ToMatterFlavor(vertices)
    {
        var poly = [];
        for(var i = 0; i < vertices.length; i++)
        {
            poly.push({x : vertices[i][0], y : vertices[i][1]});
        }
        return poly;
    }

	return { isMobileNavigator : isMobileNavigator,
             isRunningOnAirConsole : isRunningOnAirConsole,
             removeCollinearPoints : removeCollinearPoints,
             matterToP2Flavor      : matterToP2Flavor,
             p2ToMatterFlavor      : p2ToMatterFlavor };

})();