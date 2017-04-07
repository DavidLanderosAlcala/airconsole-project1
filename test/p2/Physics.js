

var Physics = (function(){

    var world;
    var scale = 200;

    function init()
    {
    	console.log("P2.js Implementation");
        world = new p2.World({ gravity : [0,10]});
        world.setGlobalStiffness(1e6);
        world.solver.iterations = 20;
        world.solver.tolerance = 0.01;
        world.islandSplit = true;
        world.solver.frictionIterations = 10;

       //var app = new p2.WebGLRenderer(function(){
       //     this.setWorld(world);
       //     this.setState(p2.Renderer.DRAWPOLYGON);
       //     this.frame(0, 1, 6, 8);
       //});
    }

    function update()
    {
        world.step(1/60);
    }

    function clear()
    {
        var constraints = world.constraints;
        for(var i = 0; i < constraints.length; i++)
        {
            world.removeBody(constraints[i]);
        }
        var bodies = world.bodies;
        for(var i = 0; i < bodies.length; i++)
        {
            world.removeBody(bodies[i]);
        }
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
        var vertices = options.vertices;
        options.label = options.label == undefined ? "Body" : options.label;
        var poly = [];

        for(var i = 0; i < vertices.length; i++)
        { poly.push([vertices[i].x, vertices[i].y]); }
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
        body = new p2.Body(config);

        /*
         * Build a compatible array from the game polygon
         */
        for(var i = 0; i < poly.length; i++)
        {
            //poly.push([vertices[i].x / scale, vertices[i].y / scale]);
            poly[i][0] /= scale;
            poly[i][1] /= scale;
        }
        body.fromPolygon(poly);
        world.addBody(body);

        /*
         * Add label property
         */
        body.label = options.label;
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
        return body;
    }

    function createWire(options)
    {
        options.x = options.x == undefined ? 0 : options.x;
        options.y = options.y == undefined ? 0 : options.y;
        options.label = options.label == undefined ? "Body" : options.label;

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
        var total_area = 0;
        for(var i =1 ; i < options.vertices.length; i++)
        {
            var pointA = { x : (options.vertices[i-1].x + options.x) / scale, y : (options.vertices[i-1].y + options.y) / scale };
            var pointB = { x : (options.vertices[i].x + options.x) / scale, y : (options.vertices[i].y + options.y) / scale };
            var vertices = buildRect(pointA, pointB);
            var c = new p2.Convex({vertices: vertices});
            for(var j=0; j!==c.vertices.length; j++){
                var v = c.vertices[j];
                p2.vec2.sub(v,v,c.centerOfMass);
            }
            p2.vec2.copy(cm,c.centerOfMass);
            c = new p2.Convex({ vertices: c.vertices });
            total_area += c.area;
            body.addShape(c,cm);
        }
        body.mass = total_area * 0.001;
        body.adjustCenterOfMass();
        body.aabbNeedsUpdate = true;
        world.addBody(body);
        console.log("Position of wire: " + body.position[0] + "," + body.position[1]);
        /*
         * Add label property
         */
         body.centroid = {
            x : body.position[0] * scale,
            y : body.position[1] * scale
         };
         body.label = options.label;
        return body;
    }

    function buildRect(pointA, pointB)
    {
        var vertices = [];
        var vector = {
            x : pointB.x - pointA.x,
            y : pointB.y - pointA.y,
        };
        var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        var angle = Math.atan(vector.y / vector.x);
        vertices.push({ x : 0, y : 3 / scale });
        vertices.push({ x : length, y : 3 / scale });
        vertices.push({ x : length, y : -3 / scale });
        vertices.push({ x : 0, y : -3 / scale });
        var rotated_vertices = [];
        for(var i = 0; i < vertices.length; i++)
        {
            rotated_vertices.push(
              [(vertices[i].x  * Math.cos(angle)) - (vertices[i].y * Math.sin(angle)) + pointA.x,
              (vertices[i].y * Math.cos(angle)) + (vertices[i].x * Math.sin(angle)) + pointA.y]
            );
        }
        decomp.makeCCW(rotated_vertices);
        return rotated_vertices;
    }

    function createRectangle(options)
    {

    }

    function isStatic(body_handler)
    {
        return body_handler.mass == 0;
    }

    function setStatic(body_handler, value)
    {
        console.log("Este metodo esta obsoleto");
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
             translate : translate };

})();