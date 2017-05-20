

var Physics = (function(){

    var world_width = 20;
    var world = null;
    var scale;
    var listeners = [];
    var id_count = 0;
    var timestamp = 0;
    var fps = 0;
    var title_bar = document.getElementsByTagName("title")[0];
    var newtimestamp = 0;
    var elapsedtime = 0;
    var new_fps = 0;
    var filteredListenersForBeginContact = [];
    var filteredListenersForEndContact = [];


    function init()
    {
        var w = Screen.getWidth();
        var h = Screen.getHeight();
        if(h < w)
        {
            w = h * 1.618;
        }
        scale = (w / world_width)|0;
    	console.log("P2.js Implementation");
    	if(world == null)
    	{
            world = new p2.World();
            world.on("beginContact", onBeginContact);
            world.on("endContact", onEndContact);
            world.on("addBody", onAddBody );
            world.on("removeBody", onRemoveBody);
    	}
    	world.clear();
        world.gravity = [0,10];
        world.setGlobalStiffness(1e6);
        world.setGlobalRelaxation ( 10 );
        world.solver.iterations = 5;
        //world.solver.tolerance = 0.01;
        world.islandSplit = true;
        world.solver.frictionIterations = 5;

        listeners = [];
        filteredListenersForBeginContact = [];
        filteredListenersForEndContact = [];

       //var app = new p2.WebGLRenderer(function(){
       //     this.setWorld(world);
       //     this.setState(p2.Renderer.DRAWPOLYGON);
       //     this.frame(0, 1, 6, 8);
       //});

    }

    function update()
    {
        newtimestamp = new Date().getTime();
        elapsedtime = newtimestamp - timestamp;
        timestamp = newtimestamp;
        
        if(elapsedtime > 20)
            elapsedtime = 20;

        if(!LevelManager.isVisible())
            world.step(elapsedtime/1700);
        
        new_fps = 1000 / elapsedtime;
        if(new_fps != fps)
        {
            fps = new_fps;
            title_bar.innerHTML = "fps: " + fps;
        }
    }

    function on(type, arg1, arg2, arg3)
    {
        if(type == "beginContactBetween")
        {
            filteredListenersForBeginContact.push({
                body1 : arg1,
                body2 : arg2,
                callback : arg3,
            });
        }
        else if(type == "endContactBetween")
        {
            filteredListenersForEndContact.push({
                body1 : arg1,
                body2 : arg2,
                callback : arg3,
            });
        }   
        else
        {
            // So arg1 is the callback;
            if(!listeners[type])
            {
                listeners[type] = [];
            }
            listeners[type].push(arg1);
        }
    }

    function onBeginContact(event)
    {
         /* It calls targered listeners */
         for(var i = 0; i < filteredListenersForBeginContact.length; i++)
         {
             if(event.bodyA.label == filteredListenersForBeginContact[i].body1 || event.bodyB.label == filteredListenersForBeginContact[i].body1)
             {
                 if(event.bodyA.label == filteredListenersForBeginContact[i].body2 || event.bodyB.label == filteredListenersForBeginContact[i].body2)
                 {
                     filteredListenersForBeginContact[i].callback(event);
                 }
             }
         }

        /* Then it calls normal listeners */
         var callbacks = listeners["beginContact"];
         if(callbacks)
         {
             for(var i = 0; i < callbacks.length; i++)
             {
                  callbacks[i](event);
             }
         }
    }

    function onEndContact(event)
    {
         /* It calls targered listeners */
         for(var i = 0; i < filteredListenersForEndContact.length; i++)
         {
             if(event.bodyA.label == filteredListenersForEndContact[i].body1 || event.bodyB.label == filteredListenersForEndContact[i].body1)
             {
                 if(event.bodyA.label == filteredListenersForEndContact[i].body2 || event.bodyB.label == filteredListenersForEndContact[i].body2)
                 {
                     filteredListenersForEndContact[i].callback(event);
                 }
             }
         }

         /* Then it calls normal listeners */
         var callbacks = listeners["endContact"];
         if(callbacks)
         {
             for(var i = 0; i < callbacks.length; i++)
             {
                  callbacks[i](event);
             }
         }
    }

    function onAddBody(event)
    {
         var callbacks = listeners["addBody"];
         if(callbacks)
         {
             for(var i = 0; i < callbacks.length; i++)
             {
                  callbacks[i](event);
             }
         }
    }

    function onRemoveBody(event)
    {
         var callbacks = listeners["removeBody"];
         if(callbacks)
         {
             for(var i = 0; i < callbacks.length; i++)
             {
                  callbacks[i](event);
             }
         }
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
        options.massScale = options.massScale || 1;
    	options.isSensor = options.isSensor || false;
        options.label = options.label || "Body";
        options.position = options.position || new Float32Array(2);

        /*
         * Build a compatible array from the game polygon
         */
        var poly = [], l = options.vertices.length;
        for(var i = 0; i < l; i++)
        {
            poly.push([options.vertices[i][0]/scale, options.vertices[i][1]/scale]);
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
            config.mass = aux_convex.area * 0.001 * options.massScale;
        }

        if(config.mass > 0.07)
        {
            setTimeout(function(){
                AchievementManager.unlock("massive-rock");
            }, 1000);
        }

        if(options.isKinematic)
        {
            config.type = p2.Body.KINEMATIC;
        }
        
        body = new p2.Body(config);
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
        var circle = new p2.Circle({
            radius  : options.radio / scale,
        });
        if(options.isStatic)
        {
            config.mass = 0; // static
        }
        else
        {
            config.mass = circle.area * 0.001;
        }
        body = new p2.Body(config);
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
            config.mass = 0.001; // non-static
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
                var vertices = Utils.rectFromPoints(pointA, pointB, 0.05);
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
          console.log(e);
          return undefined;
        }
        if(isNaN(body.position[0]))
        {
            return undefined;
        }
        world.addBody(body);
        
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
        //constraint.setStiffness(2000000);
        //constraint.maxForce *= 3;
        world.addConstraint(constraint);
        return constraint;
    }

    function removeBody(bodies)
    {
        if(!Array.isArray(bodies))
            bodies = [bodies];
        for(var i = 0; i < bodies.length; i++)
        {
            removeContraintRelatedToBody(bodies[i]);
            world.removeBody(bodies[i]);
        }
    }

    function removeContraintRelatedToBody(body)
    {
        for(var i = world.constraints.length -1; i >= 0; i--)
        {
            if(body.id == world.constraints[i].bodyA.id || body.id == world.constraints[i].bodyB.id)
            {
                removeConstraint(world.constraints[i]);
            }
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

    function addCollisionGroup(body_handler, group)
    {
        var s, sl = body_handler.shapes.length;
        for(s = 0; s < sl; s++)
        {
            body_handler.shapes[s].collisionGroup = 0;
            body_handler.shapes[s].collisionGroups = body_handler.shapes[0].collisionGroups || [];
            body_handler.shapes[s].collisionGroups.push(group);
        }
    }

    function removeCollisionGroup(body_handler, group)
    {
        var s, sl = body_handler.shapes.length;
        for(s = 0; s < sl; s++)
        {
            if(body_handler.shapes[s].collisionGroups)
            {
                for(var i = body_handler.shapes[s].collisionGroups.length - 1; i >=0; i--)
                {
                    if(body_handler.shapes[s].collisionGroups[i] == group)
                    {
                        body_handler.shapes[s].collisionGroups.splice(i,1);
                        return;
                    }
                }
            }
        }
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
             setAngle        : setAngle,
             addCollisionGroup : addCollisionGroup,
             removeCollisionGroup : removeCollisionGroup };
})();

/* Define an alias name for the Physics module */
var Phy = Physics;