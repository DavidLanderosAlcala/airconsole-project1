

var DirtyLayer = (function(){

    var canvas = null;
    var context = null;
    var pattern = "white";
    const _2PI = Math.PI * 2;

	function init()
	{
        canvas = document.querySelector("#dirty_layer");
        context = canvas.getContext("2d");
        var img = new Image();
        img.src = "./res/img/chalk_pattern.png";
        img.onload = function(){
            pattern = context.createPattern(img, "repeat");
            configureContext();
        };
        window.addEventListener("resize", adjustToViewPort);
        adjustToViewPort();
	}

    function adjustToViewPort()
    {
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        configureContext();
    }

    function configureContext()
    {
        context.lineWidth   = 0.1 * Physics.getScale();
        context.fillStyle   = pattern;
        context.strokeStyle = pattern;
        context.globalAlpha = 0.1;
    }

	function addShape(shape)
	{
        if(!ConfigOptions.use_dirty_layer)
        {
        	return;
        }

        context.save();
        context.translate(shape.position[0], shape.position[1]);
        context.rotate(shape.angle);
        context.translate(-shape.centroid[0], -shape.centroid[1]);
        context.beginPath();
        if(shape.type == "polygon" || shape.type == "wire")
        {
            var i, l = shape.vertices.length;
            context.moveTo(shape.vertices[0][0], shape.vertices[0][1]);
            for(i = 1; i < l; i++)
            {
                 context.lineTo(shape.vertices[i][0], shape.vertices[i][1]);
            }
            if(shape.type == "polygon")
            {
                context.closePath();
                if(shape.fill)
                {
                    context.globalAlpha = 0.05;
                    context.fill();
                    context.globalAlpha = 0.1;
                }
            }
            context.stroke();
        }
        else // circle
        {
            context.arc(0,0, shape.radio, 0, _2PI);
            if(shape.fill)
            {
                context.globalAlpha = 0.05;
                context.fill();
                context.globalAlpha = 0.1;
            }
            context.stroke();
        }
        context.restore();
	}

	function clear()
	{
        context.clearRect(0,0, canvas.width, canvas.height);
	}

	return { init      : init,
	         addShape  : addShape,
	         clear     : clear };
})();