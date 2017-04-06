

var Physics = (function(){

   var  b2Vec2 = Box2D.Common.Math.b2Vec2
      , b2BodyDef = Box2D.Dynamics.b2BodyDef
      , b2Body = Box2D.Dynamics.b2Body
      , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
      , b2Fixture = Box2D.Dynamics.b2Fixture
      , b2World = Box2D.Dynamics.b2World
      , b2MassData = Box2D.Collision.Shapes.b2MassData
      , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
      , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
      , b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
      , b2DebugDraw = Box2D.Dynamics.b2DebugDraw; 

    var world;
    var SCALE = 30;
    var count = 0;

    function init()
    {
        console.log("Box2Djs Implementation");
        count = 0;
        world = new b2World( new b2Vec2(0, 10) , true);
    }

    function update()
    {
        world.Step(1/60, 10 ,10);
        world.ClearForces();
    }

    function clear()
    {
        world = null;
        world = new b2World( new b2Vec2(0, 10) , true);
    }

    function getPosition(body_handler)
    {
        var pos = body_handler.GetPosition();
        return {
            x : pos.x * SCALE,
            y : pos.y * SCALE,
        };
    }

    function getAngle(body_handler)
    {
        return body_handler.GetAngle();
    }

    function getLabel(body_handler)
    {
        return body_handler.GetUserData();
    }

    function createBody(options)
    {
        var bodyDef = new b2BodyDef;
        var fixture = new b2FixtureDef;
        if(options.isStatic) bodyDef.type = b2Body.b2_staticBody;
        else bodyDef.type = b2Body.b2_dynamicBody;
        fixture.density = 1.0;
        fixture.friction = 0.5;
        fixture.restitution = 0.2;
        fixture.shape = new b2PolygonShape;

        var centroid = { x : 0, y : 0 };
        for(var i = 0; i < options.vertices.length; i++)
        {
            centroid.x += options.vertices[i].x;
            centroid.y += options.vertices[i].y;
        }
        centroid.x /= options.vertices.length;
        centroid.y /= options.vertices.length;

        bodyDef.position.x = (options.x + centroid.x) / SCALE;
        bodyDef.position.y = (options.y + centroid.y) / SCALE;

        var body = world.CreateBody(bodyDef);
        body.centroid = centroid;

        options.vertices = processVertices(options.vertices);
        
        var concavePolygon = [];
        for(var i = 0; i < options.vertices.length; i++)
        {
            concavePolygon.push([options.vertices[i].x / SCALE, options.vertices[i].y / SCALE ]);
        }
        
        var convexPolygons = decomp.decomp(concavePolygon);
        
        for(var i = 0; i < convexPolygons.length; i++)
        {
            var vertices = convexPolygons[i];
            var points = [];
            for (var j = 0; j < vertices.length; j++) {
                var vec = new b2Vec2();
                vec.Set(vertices[j][0], vertices[j][1]);
                points.push(vec);
            }
            fixture.shape.SetAsArray(points, points.length);
            body.CreateFixture(fixture);  
        }
        body.__id = count++;
        
        return body;
    }

    function preventCollision(bodyA, bodyB)
    {
    	//if(!bodyA.__groupAssigned)
    	//{
    	//	bodyA.__groupAssigned = true;
    	//	bodyA.collisionFilter.group = Matter.Body.nextGroup(true);
    	//}
    	//bodyB.collisionFilter.group = bodyA.collisionFilter.group;
    	//bodyB.__groupAssigned = true;
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

    }

    function setStatic(body_handler, value)
    {

    }

    function createRevoluteJoint(options)
    {
        var joint_def = new b2RevoluteJointDef();
        joint_def.bodyA = options.bodyA;
        joint_def.bodyB = options.bodyB;
        joint_def.localAnchorA = new b2Vec2(options.pointA.x / SCALE, options.pointA.y / SCALE);
        joint_def.localAnchorB = new b2Vec2(options.pointB.x / SCALE, options.pointB.y / SCALE);
        return world.CreateJoint(joint_def);
    }

    function processVertices(vertices)
    {
        var centroid = { x : 0, y : 0 };
        for(var i = 0; i < vertices.length; i++)
        {
            centroid.x += vertices[i].x;
            centroid.y += vertices[i].y;
        }
        centroid.x /= vertices.length;
        centroid.y /= vertices.length;
        for(var i = 0; i < vertices.length; i++)
        {
            vertices[i].x -= centroid.x;
            vertices[i].y -= centroid.y;
        }
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
        return body_handler.__id;
    }

    function getAllBodies()
    {
    	// Matter.js 
    	return Matter.Composite.allBodies(engine.world);
    }

    function getCentroid(body_handler)
    {
        return { x : 0, y : 0 };
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
             update : update };

})();