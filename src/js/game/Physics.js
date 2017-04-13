

var Physics = (function(){

    var world_width = 20;
    var world = null;
    var scale;

    var listeners = [];
    var id_count = 0;

    function init()
    {
        scale = (Screen.getWidth() / world_width)|0;
    	console.log("P2.js Implementation");
    	if(world == null)
    	{
            world = new p2.World();
    	}
    	world.clear();
        world.gravity = [0,10];
        world.setGlobalStiffness(1e6);
        world.setGlobalRelaxation ( 10 );
        world.solver.iterations = 20;
        world.solver.tolerance = 0.01;
        world.islandSplit = true;
        world.solver.frictionIterations = 10;
        listeners = [];

       //var app = new p2.WebGLRenderer(function(){
       //     this.setWorld(world);
       //     this.setState(p2.Renderer.DRAWPOLYGON);
       //     this.frame(0, 1, 6, 8);
       //});

       world.on("beginContact", function(event){
           var callbacks = listeners["beginContact"];
           if(callbacks)
           {
               for(var i = 0; i < callbacks.length; i++)
               {
                    callbacks[i](event);
               }
           }
       });

       world.on("endContact",function(event){
           var callbacks = listeners["endContact"];
           if(callbacks)
           {
               for(var i = 0; i < callbacks.length; i++)
               {
                    callbacks[i](event);
               }
           }
       });

       world.on("addBody",function(event){
           var callbacks = listeners["addBody"];
           if(callbacks)
           {
               for(var i = 0; i < callbacks.length; i++)
               {
                    callbacks[i](event);
               }
           }
       });

    }

    function update()
    {
        world.step(1/60);
    }

    function on(type, callback)
    {
        if(!listeners[type])
        {
            listeners[type] = [];
        }
        listeners[type].push(callback);
    }

    function clear()
    {
        init();
    }

    function getPosition(body_handler)
    {
        return {
            x: body_handler.position[0] * scale,
            y: body_handler.position[1] * scale,
        };
    }

    function getAngle(body_handler)
    {
        return body_handler.angle;
    }

    function getLabel(body_handler)
    {
        return body_handler.label;
    }

    function createBody(options)
    {
    	options.isSensor = options.isSensor || false;
        options.label = options.label || "Body";
        options.x = options.x || 0;
        options.y = options.y || 0;

        var poly = [];

        for(var i = 0; i < options.vertices.length; i++)
        { poly.push([options.vertices[i].x, options.vertices[i].y]); }
        decomp.makeCCW(poly);

        var aux_convex = new p2.Convex({ vertices : poly });
        centroid_obj = { x : aux_convex.centerOfMass[0], y : aux_convex.centerOfMass[1] };

        /*
        * Create a static or no-static object
        */
        var body = null;
        var config = { position : [options.x / scale, options.y / scale] };
        if(options.isStatic)
        {
            config.mass = 0; // static
        }
        else
        {
            config.mass = aux_convex.area * 0.001;
        }

        if(options.isKinematic)
        {
            config.type = p2.Body.KINEMATIC;
        }
        
        body = new p2.Body(config);
        /*
         * Build a compatible array from the game polygon
         */
        for(var i = 0; i < poly.length; i++)
        {
            poly[i][0] /= scale;
            poly[i][1] /= scale;
        }
        body.fromPolygon(poly);
        if(options.isSensor)
        {
        	var i, l = body.shapes.length;
        	for(i = 0; i < l; i++)
        	{
        		body.shapes[i].sensor = true;
        	}
        }
        world.addBody(body);
        if(!body)
        {
            console.log("Wow! body is invalid");
        }

        /*
         * Add label property
         */
        body.label = options.label;
        body.id = id_count++;
        body.centroid = centroid_obj;
        return body;
    }

    function preventCollision(bodyA, bodyB)
    {

    }

    function createCircle(options)
    {
        /*
        * Create a static or no-static object
        */
        var body = null;
        var config = { position : [options.x / scale, options.y / scale] };
        if(options.isStatic)
        {
            config.mass = 0; // static
        }
        else
        {
            config.mass = 1; // non-static
        }
        body = new p2.Body(config);
        var circle = new p2.Circle({
            radius  : options.radio / scale,
        });
        body.addShape(circle);
        world.addBody(body);

        /*
         * Add label property
         */
        body.label = options.label;
        body.id = id_count++;
        return body;
    }

    function createWire(options)
    {
        options.label = options.label || "Body";
        options.x = options.x || 0;
        options.y = options.y || 0;

        /*
        * Create a static or no-static object
        */
        var body = null;
        var config = {};
        if(options.isStatic)
        {
            config.mass = 0; // static
        }
        else
        {
            config.mass = 1; // non-static
        }
        body = new p2.Body(config);
        var cm = p2.vec2.create();
        for(var i =1 ; i < options.vertices.length; i++)
        {
            var pointA = { x : (options.vertices[i-1].x + options.x) / scale, y : (options.vertices[i-1].y + options.y) / scale };
            var pointB = { x : (options.vertices[i].x + options.x) / scale, y : (options.vertices[i].y + options.y) / scale };
            var vertices = buildRect(pointA, pointB);
            decomp.makeCCW(vertices);
            var c = new p2.Convex({vertices: vertices});
            for(var j=0; j!==c.vertices.length; j++){
                var v = c.vertices[j];
                p2.vec2.sub(v,v,c.centerOfMass);
            }
            p2.vec2.copy(cm,c.centerOfMass);
            c = new p2.Convex({ vertices: c.vertices });
            body.addShape(c,cm);
        }
        body.adjustCenterOfMass();
        body.aabbNeedsUpdate = true;
        world.addBody(body);

        if(!body)
        {
            console.log("Wow! body is invalid");
        }        
        
        /*
         * Add label property
         */
         body.centroid = {
            x : body.position[0] * scale,
            y : body.position[1] * scale
         };
         body.label = options.label;
         body.id = id_count++;
        return body;
    }


    /*
     * do you want to improve this algo ?
     * use this jsfiddle test:
     *     https://jsfiddle.net/dka92bzb/11/
     */
    function buildRect(pointA, pointB)
    {
        var vector = {
            x : pointB.x - pointA.x,
            y : pointB.y - pointA.y,
        };
        var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        var angle = Math.atan(vector.y / vector.x);
        if( vector.x < 0 )
        	angle += Math.PI;
        var s_angle = Math.sin(angle);
        var c_angle = Math.cos(angle);
        var half_height = 3 / scale;
        var vertices = [
            [ - half_height * s_angle + pointA.x,
              half_height * c_angle + pointA.y ],
            [ (length  * c_angle) - (half_height * s_angle) + pointA.x,
              (half_height * c_angle) + (length * s_angle) + pointA.y ],
            [ (length * c_angle) - (-half_height * s_angle) + pointA.x,
              (-half_height * c_angle) + (length * s_angle) + pointA.y ],
            [ half_height * s_angle + pointA.x,
              -half_height * c_angle + pointA.y],            
        ];
        return vertices;
    }

    function createRectangle(options)
    {

    }

    function isStatic(body_handler)
    {
        return body_handler.mass == 0;
    }

    function createRevoluteJoint(options)
    {
        var constraint = new p2.RevoluteConstraint(options.bodyA, options.bodyB, {
            localPivotA: [options.pointA.x / scale, options.pointA.y / scale],
            localPivotB: [options.pointB.x / scale, options.pointB.y / scale],
            collideConnected : false,
        });
        world.addConstraint(constraint);
        return constraint;
    }

    function removeBody(bodies)
    {
        if(!Array.isArray(bodies))
            bodies = [bodies];
        for(var i = 0; i < bodies.length; i++)
        {
            world.removeBody(bodies[i]);
        }
    }

    function removeConstraint(bodies)
    {
        if(!Array.isArray(bodies))
            bodies = [bodies];
        for(var i = 0; i < bodies.length; i++)
        {
            world.removeConstraint(bodies[i]);
        }
    }

    function isSensor(body_handler)
    {
        return body_handler.isSensor;
    }

    function getId(body_handler)
    {
        return body_handler.id;
    }

    function getAllBodies()
    {
    	return world.bodies;
    }

    function getCentroid(body_handler)
    {
        return body_handler.centroid;
    }

    function getBodiesAtPoint(point)
    {
        return world.hitTest([point.x / scale, point.y / scale], world.bodies);
    }

    function translate(body_handler, disp)
    {
        body_handler.position[0] += disp.x / scale;
        body_handler.position[1] += disp.y / scale;
    }

    function setVelocity(body_handler, velocity)
    {
        body_handler.velocity[0] = velocity.x / scale;
        body_handler.velocity[1] = velocity.y / scale;
    }

    function setPosition(body_handler, pos)
    {
        body_handler.position[0] = pos.x / scale;
        body_handler.position[1] = pos.y / scale;
    }

    function clearForces(body_handler)
    {
        body_handler.velocity[0] = 0;
        body_handler.velocity[1] = 0;
        body_handler.angularVelocity = 0;
        console.log(body_handler);
    }

    function getScale()
    {
        return scale;
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
             removeBody      : removeBody,
             removeConstraint : removeConstraint,
             getBodiesAtPoint : getBodiesAtPoint,
             getAllBodies     : getAllBodies,
             preventCollision : preventCollision,
             isSensor         : isSensor,
             createRevoluteJoint : createRevoluteJoint,
             getId           : getId,
             getCentroid     : getCentroid,
             createWire      : createWire,
             update          : update,
             on              : on,
             translate       : translate,
             setPosition     : setPosition,
             setVelocity     : setVelocity,
             clearForces     : clearForces,
             getScale        : getScale };

})();