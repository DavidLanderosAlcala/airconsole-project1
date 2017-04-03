

var Physics = (function(){

	var engine;

    function init()
    {
        engine = Matter.Engine.create();
        Matter.Engine.run(engine);
    }

    function clear()
    {
        var _bodies = Matter.Composite.allBodies(engine.world);
        Matter.World.remove(engine.world, _bodies);
    }

    function getPosition(body_handler)
    {
    	// matter.js
        return body_handler.position;
    }

    function getAngle(body_handler)
    {
        // matter.js
        return body_handler.angle;
    }

    function getLabel(body_handler)
    {
        return body_handler.label;
    }

    function createBody(options)
    {
    	options.isStatic = options.isStatic == undefined ? false : options.isStatic;
    	options.isSensor = options.isSensor == undefined ? false : options.isSensor;
        options.label = options.label == undefined ? "Body" : options.label;
    	// matter.js
        var body = Matter.Bodies.fromVertices(options.x, options.y, options.vertices, {
        	friction : options.friction,
        	isStatic : options.isStatic,
        	isSensor : options.isSensor,
        	label    : options.label,
        });
        if(body != undefined)
        {
            Matter.World.add(engine.world, [body]);
        }
        return body;
    }

    function preventCollision(bodyA, bodyB)
    {
    	if(!bodyA.__groupAssigned)
    	{
    		bodyA.__groupAssigned = true;
    		bodyA.collisionFilter.group = Matter.Body.nextGroup(true);
    	}
    	bodyB.collisionFilter.group = bodyA.collisionFilter.group;
    	bodyB.__groupAssigned = true;
    }

    function createCircle(options)
    {
        var body = Matter.Bodies.circle( options.x, options.y, options.radio, {
          	isStatic : options.isStatic,
            label : options.label,
        });
        if(body != undefined)
        {
            Matter.World.add(engine.world, [body]);
        }
        return body;
    }

    function createRectangle(options)
    {

    }

    function isStatic(body_handler)
    {
        return body_handler.isStatic;
    }

    function setStatic(body_handler, value)
    {
        Matter.Body.set(body_handler, {isStatic : value });
    }

    function createRevoluteJoint(options)
    {
        var constraint = Matter.Constraint.create({
              bodyA  : options.bodyA,
              pointA : options.pointA,
              bodyB  : options.bodyB,
              pointB : options.pointB,
              stiffness: 0.1,
              length : 5,
         });
        Matter.World.add(engine.world, [constraint]);
        return constraint;
    }

    function remove(bodies)
    {
    	if(!Array.isArray(bodies))
    		bodies = [bodies];
        Matter.World.remove(engine.world, bodies);
    }

    function isSensor(body_handler)
    {
        return body_handler.isSensor;
    }

    function getId(body_handler)
    {
        // matter.js
        return body_handler.id;
    }

    function getAllBodies()
    {
    	// Matter.js 
    	return Matter.Composite.allBodies(engine.world);
    }

    function getCentroid(vertices)
    {
        // Matter.js
        return Matter.Vertices.centre(vertices);
    }

    function getBodiesAtPoint(point)
    {
        var _bodies = Physics.getAllBodies();
        return Matter.Query.point(_bodies, point);
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
                     x : vector_or_polygon[i].x * ConfigOptions.matter_scale,
                     y : vector_or_polygon[i].y * ConfigOptions.matter_scale,
                 });
            }
            return scaled_poly;
       }
       return {
           x : vector_or_polygon.x * ConfigOptions.matter_scale,
           y : vector_or_polygon.y * ConfigOptions.matter_scale,
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
                     x : vector_or_polygon[i].x / ConfigOptions.matter_scale,
                     y : vector_or_polygon[i].y / ConfigOptions.matter_scale,
                 });
            }
            return scaled_poly;
       }
       return {
           x : vector_or_polygon.x / ConfigOptions.matter_scale,
           y : vector_or_polygon.y / ConfigOptions.matter_scale,
       };
    }

    return { init            : init,
    	     clear           : clear,
             getPosition     : getPosition,
             getAngle        : getAngle,
             getLabel        : getLabel,
             createBody      : createBody,
             createRectangle : createRectangle,
             createCircle    : createCircle,
             isStatic        : isStatic,
             setStatic       : setStatic,
             remove          : remove,
             getBodiesAtPoint : getBodiesAtPoint,
             getAllBodies     : getAllBodies,
             preventCollision : preventCollision,
             isSensor : isSensor,
             createRevoluteJoint : createRevoluteJoint,
             getId : getId,
             getCentroid : getCentroid };

})();