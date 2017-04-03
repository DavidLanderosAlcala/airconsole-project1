

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
                    background: 'rgba(0,0,0,0)',
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
        return Mapping.engineToCanvas(body_handler.position);
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
        var mapped_pos = Mapping.canvasToEngine(options);
        var mapped_vertices = Mapping.canvasToEngine(options.vertices);
        var body = Matter.Bodies.fromVertices(mapped_pos.x, mapped_pos.y, mapped_vertices, {
        	friction : options.friction,
        	isStatic : options.isStatic,
        	isSensor : options.isSensor,
        	label    : options.label,
            render : { fillStyle: "#0a0", visible : true },
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
        var mapped_pos = Mapping.canvasToEngine(options);
        var mapped_radio = options.radio / Mapping.getCanvasScale().x;
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
              pointA : Mapping.canvasToEngine(options.pointA),
              bodyB  : options.bodyB,
              pointB : Mapping.canvasToEngine(options.pointB),
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
        // Maybe this is an exception, this function does not need mapping
        return Matter.Vertices.centre(vertices);
    }

    function getBodiesAtPoint(point)
    {
        var mapped_point = Mapping.canvasToEngine(point);
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
             isSensor : isSensor,
             createRevoluteJoint : createRevoluteJoint,
             getId : getId,
             getCentroid : getCentroid };

})();