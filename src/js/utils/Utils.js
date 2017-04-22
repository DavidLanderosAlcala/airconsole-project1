

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

    /*
     * do you want to improve this algo ?
     * use this jsfiddle test:
     *     https://jsfiddle.net/dka92bzb/11/
     */
    function rectFromPoints(pointA, pointB, half_height)
    {
        var vector = new Float32Array(2);
        vector[0] = pointB[0] - pointA[0];
        vector[1] = pointB[1] - pointA[1];
        var length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        var angle = Math.atan(vector[1] / vector[0]);
        if( vector[0] < 0 )
            angle += Math.PI;
        var s_angle = Math.sin(angle);
        var c_angle = Math.cos(angle);
        var vertices = [
            [ - half_height * s_angle + pointA[0],
              half_height * c_angle + pointA[1] ],
            [ (length  * c_angle) - (half_height * s_angle) + pointA[0],
              (half_height * c_angle) + (length * s_angle) + pointA[1] ],
            [ (length * c_angle) - (-half_height * s_angle) + pointA[0],
              (-half_height * c_angle) + (length * s_angle) + pointA[1] ],
            [ half_height * s_angle + pointA[0],
              -half_height * c_angle + pointA[1]],            
        ];
        return vertices;
    }

    /*
     * do you want to improve this algo ?
     * use this jsfiddle test:
     *    https://jsfiddle.net/oyj6uh5n/2/
     */
    function normalizePolyLine(poly, distance)
    {
        var newpoly = [];
        for(var i = 0 ; i < poly.length-1; i++)
        {
            var vec = [poly[i+1][0] - poly[i][0], poly[i+1][1] - poly[i][1] ];
            var length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
            var segments = parseInt(length/distance);
            var step_x = vec[0] / segments;
            var step_y = vec[1] / segments;
            for(var j = 0; j < segments; j++)
            {
                newpoly.push([poly[i][0] + (step_x * j), poly[i][1] + (step_y * j)]);
            }
        }
        newpoly.push([poly[poly.length-1][0], poly[poly.length-1][1]]);
        return newpoly;
    }

	return { isMobileNavigator : isMobileNavigator,
             isRunningOnAirConsole : isRunningOnAirConsole,
             rectFromPoints : rectFromPoints,
             normalizePolyLine : normalizePolyLine,};

})();