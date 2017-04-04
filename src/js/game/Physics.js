

var Physics = (function(){

	var engine;

    function init()
    {
        engine = Matter.Engine.create();
        Matter.Engine.run(engine);
        var debug_canvas = document.querySelector("#debug_render");
        if(ConfigOptions.use_debug_render)
        {
            var render = Matter.Render.create({
                element : debug_canvas,
                engine  : engine,
                    options: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    wireframeBackground : "#00000000",
                }
            });
            Matter.Render.run(render);
            debug_canvas.style.width = (window.innerWidth) + "px";
            debug_canvas.style.height = (window.innerHeight) + "px";
            debug_canvas.style.background = "rgba(0,0,0,0)"
            debug_canvas.style.alpha = "0.2";
        }
        else
        {
            debug_canvas.style.zIndex = -1;
        }
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

        var mapped_pos = options;
        var mapped_vertices = options.vertices;

        var body = Matter.Bodies.fromVertices(mapped_pos.x, mapped_pos.y, mapped_vertices, {
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
        var mapped_pos = options;
        var mapped_radio = options.radio;
        var body = Matter.Bodies.circle( mapped_pos.x, mapped_pos.y, mapped_radio, {
          	isStatic : options.isStatic,
            label : options.label,
        });
        if(body != undefined)
        {
            Matter.World.add(engine.world, [body]);
        }
        return body;
    }

    function createWire(vertices)
    {
        var parts = [];
        var i, l = vertices.length;
        for(var i = 1 ; i < l; i++)
        {
            parts.push(createStick(vertices[i-1], vertices[i]));
        }
        var body = Matter.Body.create( {parts: parts} );
        Matter.Body.setInertia(body, body.inertia * 5);
        Matter.World.add(engine.world, [body]);
        return body;
    }

    function createStick(pos1, pos2)
    {
        var pos = {
            x : ((pos1.x + pos2.x) / 2),
            y : ((pos1.y + pos2.y) / 2)
        };
        var height = 8;
        var vector_x = pos2.x - pos1.x;
        var vector_y = pos2.y - pos1.y;
        var width = Math.sqrt( (vector_x * vector_x) + (vector_y * vector_y) );
        var angle = Math.atan(vector_y / vector_x);
        // this is a exception, createStick receive scaled vectors 
        return Matter.Bodies.rectangle(pos.x, pos.y, width, height, {friction: 1.0, angle : angle});
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

    function processVertices(vertices)
    {
        return vertices;
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
        var mapped_point = point;
        var _bodies = Physics.getAllBodies();
        return Matter.Query.point(_bodies, mapped_point);
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
             isSensor         : isSensor,
             createRevoluteJoint : createRevoluteJoint,
             getId           : getId,
             getCentroid     : getCentroid,
             createWire      : createWire,
             processVertices : processVertices };

})();