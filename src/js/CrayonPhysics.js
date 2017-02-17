
var CrayonPhysics = (function(){

  /* constants */
  const blue_crayon_url       = "http://oi68.tinypic.com/2zyftwh.jpg";
  const pencil_image_url      = "http://oi65.tinypic.com/122jamb.jpg";
  const default_canvas_width  = 640;
  const default_canvas_height = 480;  

  /* variables */
  var canvas;
  var context;
  var canvas_left;
  var canvas_top;
  var crayon_pos;
  var crayon_img;
  var engine;
  var bodies = [];
  var current_polygon = [];
  var ground_info;
  var ground;

  var blue_crayon_pattern =
  {
      img     : null,
      pattern : "black"
  }

  function init(options)
  {
      canvas = options.canvas;
      canvas.width = options.width == undefined ? default_canvas_width : options.width;
      canvas.height = options.height == undefined ? default_canvas_height : options.height;
      canvas_left = canvas.getBoundingClientRect().left;
      canvas_top = canvas.getBoundingClientRect().top;
      context = canvas.getContext("2d");

      blue_crayon_pattern.img = new Image();
      blue_crayon_pattern.img.onload = function(){
        blue_crayon_pattern.pattern =
            context.createPattern(blue_crayon_pattern.img, "repeat");
      };
      blue_crayon_pattern.img.src =  blue_crayon_url;

      crayon_img = new Image();
      crayon_img.src = pencil_image_url;

      crayon_pos = {
          x : canvas.width>>1,
          y : canvas.height>>1
      };

      canvas.addEventListener("mousemove", onMouseMove);
      engine = Matter.Engine.create();
      Matter.Engine.run(engine);
      ground_info = {
          x : canvas.width>>1,
          y : canvas.height - 25,
          width  : canvas.width,
          height : 50,
      };
      ground = Matter.Bodies.rectangle(
          ground_info.x,
          ground_info.y,
          ground_info.width,
          ground_info.height,
          { isStatic : true }
      )
      Matter.World.add(engine.world, [ground]);
      Touch.surface("canvas", onTouchEvent);

      window.requestAnimationFrame(render);
  }

  function render()
  {
      // clearing the screen
      context.clearRect(0,0, canvas.width, canvas.height);

      // drawing the current polygon
      context.save();
      if(current_polygon.length > 1)
      {
          context.strokeStyle = blue_crayon_pattern.pattern;
          context.lineWidth = 5;
          context.beginPath();
          context.moveTo(current_polygon[0].x, current_polygon[0].y);
          for(var i = 0; i < current_polygon.length; i++)
          {
            context.lineTo(current_polygon[i].x, current_polygon[i].y);
          }
          context.stroke();
      }
      context.restore();

      // drawing the floor
      context.save();
      context.translate(ground.position.x, ground.position.y);
      context.lineWidth = 5;
      context.fillStyle = blue_crayon_pattern.pattern;
      context.fillRect(
          -ground_info.width>>1,
          -ground_info.height>>1,
          ground_info.width,
          ground_info.height
      );
      context.restore();

      // drawing polygons
      var i, l = bodies.length;
      for(i = 0; i < l; i++)
      {
          context.save();
          context.translate(bodies[i].body.position.x, bodies[i].body.position.y);
          context.rotate(bodies[i].body.angle);
          context.translate(-bodies[i].centroid.x, -bodies[i].centroid.y);
          context.strokeStyle = blue_crayon_pattern.pattern;
          context.beginPath();
          context.moveTo(bodies[i].vertices[0].x, bodies[i].vertices[0].y);
          for(var j = 1; j < bodies[i].vertices.length; j++)
          {
              context.lineTo(bodies[i].vertices[j].x, bodies[i].vertices[j].y);
          }
          context.closePath();
          context.lineWidth = 5;
          context.stroke();
          context.restore();
      }

      // drawing the cursor
      context.drawImage(crayon_img, crayon_pos.x - 2, crayon_pos.y - 95, 100,100);
      window.requestAnimationFrame(render);
  }

  function onMouseMove(e)
  {
      updateCursorPosition(e.clientX - canvas_left, e.clientY - canvas_top);
  }

  function updateCursorPosition(x, y)
  {
       crayon_pos.x = x;
       crayon_pos.y = y;
  }

  function onTouchEvent(e)
  {
      if(e.type == "touchmove")
      {
           current_polygon.push({
               x : e.x,
               y : e.y,
           });
      }
      else if(e.type == "touchend")
      {
          if(current_polygon.length == 0)
              return;
          console.log(current_polygon.length + " vertices");
          current_polygon = PolyCompressor.compress(current_polygon);
          console.log(current_polygon.length + " vertices - compressed");
          var centroid = Matter.Vertices.centre(current_polygon);
          var body = Matter.Bodies.fromVertices(centroid.x, centroid.y, current_polygon);
          if(body == undefined)
          {
              current_polygon = [];
              return;
          };
          var diff = {
              x : body.vertices[0].x - current_polygon[0].x,
              y : body.vertices[0].y - current_polygon[0].y,
          };
          bodies.push({
              body : body,
              vertices : current_polygon,
              centroid: centroid,
          });
          Matter.World.add(engine.world, [body]);
          current_polygon = [];
      }
  }

  function moveTo(pos)
  {
    
  }

  function lineTo()
  {
    
  }

  function tack()
  {
    
  }

  function erease()
  {

  }

  return {  init : init,
            onTouchEvent : onTouchEvent,
            updateCursorPosition : updateCursorPosition };

})();
