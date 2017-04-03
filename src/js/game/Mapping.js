

var Mapping = (function(){

	  var canvas_translation = null
	  var canvas_scale = null;

	  function init(canvas_element)
	  {
	  	    var rect = canvas_element.getBoundingClientRect();
          canvas_translation = {
              x : 0,//-(rect.width >> 1),
              y : 0//-rect.height,
          };
          canvas_scale = {
              x : 1,
              y : 1,
          };
	  }

    function getCanvasScale()
    {
        return canvas_scale;
    }

    function engineToCanvas(vector_polygon)
    {
       if(Array.isArray(vector_polygon))
       {
            var scaled_poly = [];
            var i, l = vector_polygon.length;
            for(i = 0; i < l; i++)
            {
                 scaled_poly.push({
                     x : vector_polygon[i].x * canvas_scale.x + canvas_translation.x,
                     y : vector_polygon[i].y * canvas_scale.y + canvas_translation.y,
                 });
            }
            return scaled_poly;
       }
       return {
           x : vector_polygon.x * canvas_scale.x + canvas_translation.x,
           y : vector_polygon.y * canvas_scale.y + canvas_translation.y,
       };
    }

    function canvasToEngine(vector_polygon)
    {
       if(Array.isArray(vector_polygon))
       {
            var scaled_poly = [];
            var i, l = vector_polygon.length;
            for(i = 0; i < l; i++)
            {
                 scaled_poly.push({
                     x : vector_polygon[i].x / canvas_scale.x - canvas_translation.x,
                     y : vector_polygon[i].y / canvas_scale.y - canvas_translation.y,
                 });
            }
            return scaled_poly;
       }
       return {
           x : vector_polygon.x / canvas_scale.x - canvas_translation.x,
           y : vector_polygon.y / canvas_scale.y - canvas_translation.y,
       };
    }

    return { init           : init,
             getCanvasScale : getCanvasScale,
             engineToCanvas : engineToCanvas,
             canvasToEngine : canvasToEngine, }

})();