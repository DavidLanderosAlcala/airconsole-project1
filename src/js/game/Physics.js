

var Physics = (function(){

    var world_width = 20;
    var world = null;
    var scale;
    var listeners = [];
    var id_count = 0;
    var timestamp = 0;
    var fps = 0;
    var title_bar = document.getElementsByTagName("title")[0];

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
        world.solver.iterations = 10;
        //world.solver.tolerance = 0.01;
        world.islandSplit = true;
        world.solver.frictionIterations = 5;
        listeners = [];
        console.log(world);

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

       world.on("removeBody",function(event){
           var callbacks = listeners["removeBody"];
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
        var newtimestamp = new Date().getTime();
        var elapsedtime = newtimestamp - timestamp;
        timestamp = newtimestamp;
        if(elapsedtime > 500)
            elapsedtime = 500;
        world.step(elapsedtime/1000);
        var new_fps = 1 / (elapsedtime/1000)|0;
        if(new_fps != fps)
        {
            fps = new_fps;
            title_bar.innerHTML = "fps: " + fps;
        }
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
        return [ body_handler.position[0] * scale,
                 body_handler.position[1] * scale ];
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
        options.position = options.position || new Float32Array(2);

        var poly = [], l = options.vertices.length;
        for(var i = 0; i < l; i++)
        {
            poly.push(options.vertices[i].slice());
        }
        
        decomp.makeCCW(poly);

        var aux_convex = new p2.Convex({ vertices : poly });

        /*
        * Create a static or no-static object
        */
        var body = null;
        var config = { position : [options.position[0] / scale, options.position[1] / scale] };
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
        try
        {
            body.fromPolygon(poly);
        }
        catch(e){
          return undefined;
        }
        if(options.isSensor)
        {
        	var i, l = body.shapes.length;
        	for(i = 0; i < l; i++)
        	{
        		body.shapes[i].sensor = true;
        	}
        }
        world.addBody(body);
        console.log("last object: ");
        console.log(body);

        /*
         * Add centroid
         */
        body.centroid = new Float32Array(2);
        body.centroid[0] = (body.position[0] * scale) - options.position[0];
        body.centroid[1] = (body.position[1] * scale) - options.position[1];

        /*
         * Add label property
         */
        body.label = options.label;
        /*
         * Add id
         */
        body.id = id_count++;
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
        options.position = options.position || new Float32Array(2);
        var body = null;
        var config = { position : [options.position[0] / scale, options.position[1] / scale] };
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
        /*
         * Add id
         */
        body.id = id_count++;
        return body;
    }

    function createWire(options)
    {
        options.label = options.label || "Body";
        options.position = options.position || new Float32Array(2);

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
        try
        {
            for(var i =1 ; i < options.vertices.length; i++)
            {
                var pointA = new Float32Array(2);
                pointA[0] = (options.vertices[i-1][0] + options.position[0]) / scale;
                pointA[1] = (options.vertices[i-1][1] + options.position[1]) / scale;

                var pointB = new Float32Array(2);
                pointB[0] = (options.vertices[i][0] + options.position[0]) / scale;
                pointB[1] = (options.vertices[i][1] + options.position[1]) / scale;

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
        }
        catch(e){
          // only add body when all shapes were succesfully created
          console.log("Error al crear alambre: ");
          console.log(e);
          return undefined;
        }
        if(isNaN(body.position[0]))
        {
            return undefined;
        }
        console.log("position of the last wire: ");
        console.log(body.position);
        world.addBody(body);
        console.log("last object: ");
        console.log(body);
        
        /*
         * Add label property
         */
         body.label = options.label;
        /*
         * Add centroid
         */
         body.centroid = new Float32Array(2);
         body.centroid[0] = body.position[0] * scale;
         body.centroid[1] = body.position[1] * scale;
        /*
         * Add id
         */
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
        var vector = new Float32Array(2);
        vector[0] = pointB[0] - pointA[0];
        vector[1] = pointB[1] - pointA[1];
        var length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        var angle = Math.atan(vector[1] / vector[0]);
        if( vector[0] < 0 )
        	angle += Math.PI;
        var s_angle = Math.sin(angle);
        var c_angle = Math.cos(angle);
        var half_height = 4 / scale;
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
            localPivotA: [options.pointA[0] / scale, options.pointA[1] / scale],
            localPivotB: [options.pointB[0] / scale, options.pointB[1] / scale],
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
        return body_handler.shapes[0].sensor;
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
        return world.hitTest([point[0] / scale, point[1] / scale], world.bodies);
    }

    function translate(body_handler, disp)
    {
        body_handler.position[0] += disp[0] / scale;
        body_handler.position[1] += disp[1] / scale;
    }

    function setVelocity(body_handler, velocity)
    {
        body_handler.velocity[0] = velocity[0] / scale;
        body_handler.velocity[1] = velocity[1] / scale;
    }

    function setPosition(body_handler, pos)
    {
        body_handler.position[0] = pos[0] / scale;
        body_handler.position[1] = pos[1] / scale;
    }

    function setAngle(body_handler, angle)
    {
        body_handler.angle = angle;
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

    function getBodyByLabel(label)
    {
        var bodies = getAllBodies();
        for(var i = 0; i < bodies.length; i++)
        {
            if(getLabel(bodies[i]) == label)
            {
                return bodies[i];
            }
        }
        return null;
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
             getScale        : getScale,
             getBodyByLabel  : getBodyByLabel,
             setAngle        : setAngle };

})();