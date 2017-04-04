// En este link se puede ver como hacer juntas revolutas
// view-source:https://box2d-javascript-fun.appspot.com/09/index.html


var g_body = {
           body_handler : null,
           vertices : [
               {x : -2, y: -1},
               {x : 2, y: -1},
               {x : 2, y: 5},
               {x : 1.5, y: 5},
               {x :  1, y: 0},
               {x :  -1, y: 0},
               {x : -1.5, y: 5},
               {x : -2, y: 5},
           ],
}

for(var i = 0; i < g_body.vertices.length; i++)
{
    g_body.vertices[i].x += 900;
    g_body.vertices[i].y += -400;
}


var canvas2 = document.querySelector("#d");

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
    var canvas = document.getElementById("c");
    var ctx = canvas.getContext("2d");
    var world;
    var SCALE = 30;
    
    
    
    function init() {
    
       world = new b2World( new b2Vec2(0, 10) , true);
     
       createBox({
           width: 20,
           height: 1,
           x : 10.5,
           y : 15,
           isStatic:true,
       });
       
       var poly = createBody({
           x : canvas.width/2/SCALE,
           y : 0,
           isStatic:false,
           vertices : [
               {x : -1, y: -1},
               {x : 1, y: -1},
               {x : 1, y: 1},
               {x : -1, y: 1},
           ],
       });
       
       g_body.body_handler = createBody({
           x : canvas.width/2/SCALE + 1,
           y : -5,
           isStatic:false,
           vertices : g_body.vertices,
       });
       console.log(g_body.body_handler);
       enableRenderer();
       window.requestAnimationFrame(update);
    };
  
    function update() {
       world.Step(1/60, 10 ,10);
       world.DrawDebugData();
       world.ClearForces();
       window.requestAnimationFrame(update);
    };
  
    init();
    
    function createBox(options)
    {
        var bodyDef = new b2BodyDef;
        var fixture = new b2FixtureDef;
        if(options.isStatic) bodyDef.type = b2Body.b2_staticBody;
        else bodyDef.type = b2Body.b2_dynamicBody;
        fixture.density = 1.0;
        fixture.friction = 0.5;
        fixture.restitution = 0.2;
        fixture.shape = new b2PolygonShape;
        bodyDef.position.x = options.x;
        bodyDef.position.y = options.y;
        fixture.shape.SetAsBox(options.width/2, options.height/2);
        var body = world.CreateBody(bodyDef);
        body.CreateFixture(fixture);
        return body;
    }
    
    function createJoint(options)
    {
        var joint_def = new b2RevoluteJointDef();
        joint_def.bodyA = options.bodyA;
        joint_def.bodyB = options.bodyB;
        joint_def.localAnchorA = new b2Vec2(-4, -4);
        joint_def.localAnchorB = new b2Vec2(-7, 0);
        return world.CreateJoint(joint_def);
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
        bodyDef.position.x = options.x;
        bodyDef.position.y = options.y;
        var body = world.CreateBody(bodyDef);

        //  Fix position to prevent centroid usage
        var centroid = { x : 0, y : 0 };
        for(var i = 0; i < options.vertices.length; i++)
        {
            centroid.x += options.vertices[i].x;
            centroid.y += options.vertices[i].y;
        }
        centroid.x /= options.vertices.length;
        centroid.y /= options.vertices.length;
        for(var i = 0; i < options.vertices.length; i++)
        {
            options.vertices[i].x -= centroid.x;
            options.vertices[i].y -= centroid.y;
        }
        // ----------------------------------------
        
        var concavePolygon = [];
        for(var i = 0; i < options.vertices.length; i++)
        {
            concavePolygon.push([options.vertices[i].x, options.vertices[i].y]);
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
        // hack to do not change code that works in matter.js
        body.centroid = {x : 0, y : 0};
        return body;
    }
    
    function enableRenderer()
    {
       var debugDraw = new b2DebugDraw();
       debugDraw.SetSprite(document.getElementById("c").getContext("2d"));
       debugDraw.SetDrawScale(SCALE);
       debugDraw.SetFillAlpha(0.3);
       debugDraw.SetLineThickness(1.0);
       debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
       world.SetDebugDraw(debugDraw);
    }
    
    
    var context = canvas2.getContext("2d");
    function render()
    {
        context.clearRect(0,0,canvas.width, canvas.height);
        
        context.save();
            var pos =  g_body.body_handler.GetPosition();
            var centroid =  g_body.body_handler.centroid;
            var angle = g_body.body_handler.GetAngle();
            context.translate(pos.x * 30, pos.y * 30);
            context.rotate(angle);
            context.translate(centroid.x * 30, centroid.y * 30);
            context.beginPath();

            context.moveTo(g_body.vertices[0].x* 30,g_body.vertices[0].y* 30);
            for(var i = 0; i < g_body.vertices.length; i++)
            {
                context.lineTo(g_body.vertices[i].x* 30,g_body.vertices[i].y* 30);
            }
            context.strokeStyle = "red";
            context.closePath();
            context.stroke();
        context.restore();
        window.requestAnimationFrame(render);
    }
    window.requestAnimationFrame(render);