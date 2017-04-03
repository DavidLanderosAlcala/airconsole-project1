

var Mapping (function(){

	var canvas_translation = null
	var canvas_scale = null;

	function init(canvas_element)
	{
		var rect = canvas_element.getBoundingClientRect();

        canvas_translation = {
            x : -(rect.width >> 1),
            y : -rect.height,
        };

        canvas_scale = {
            x : 1,
            y : 1,
        };
	}

    function engineToCanvas(vector_or_polygon)
    {
       if(Array.isArray(vector_or_polygon))
       {
            var scaled_poly = [];
            var i, l = vector_or_polygon.length;
            for(i = 0; i < l; i++)
            {
                 scaled_poly.push({
                     x : vector_or_polygon[i].x * canvas_scale.x + canvas_translation.x,
                     y : vector_or_polygon[i].y * canvas_scale.y + canvas_translation.y,
                 });
            }
            return scaled_poly;
       }
       return {
           x : vector_or_polygon.x * canvas_scale.x + canvas_translation.x,
           y : vector_or_polygon.y * canvas_scale.y + canvas_translation.y,
       };
    }

    function canvasToEngine(vector_or_polygon)
    {
       if(Array.isArray(vector_or_polygon))
       {
            var scaled_poly = [];
            var i, l = vector_or_polygon.length;
            for(i = 0; i < l; i++)
            {
                 scaled_poly.push({
                     x : vector_or_polygon[i].x / canvas_scale.x - canvas_translation.x,
                     y : vector_or_polygon[i].y / canvas_scale.y - canvas_translation.y,
                 });
            }
            return scaled_poly;
       }
       return {
           x : vector_or_polygon.x / canvas_scale.x - canvas_translation.x,
           y : vector_or_polygon.y / canvas_scale.y - canvas_translation.y,
       };
    }

    return { engineToCanvas : engineToCanvas ,
             canvasToEngine : canvasToEngine }

})();