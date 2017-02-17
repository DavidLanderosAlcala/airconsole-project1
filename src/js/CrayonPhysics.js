
var CrayonPhysics = (function(){

  /* constants */
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
  var current_color_index = -1;
  var ground_info;
  var ground;

  function init(options)
  {
      canvas = options.canvas;
      canvas.width = options.width == undefined ? default_canvas_width : options.width;
      canvas.height = options.height == undefined ? default_canvas_height : options.height;
      canvas_left = canvas.getBoundingClientRect().left;
      canvas_top = canvas.getBoundingClientRect().top;
      context = canvas.getContext("2d");

      ColorManager.init(context);

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
          context.strokeStyle = ColorManager.getColorAt(current_color_index);
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
      context.fillStyle = ColorManager.getColorAt(0);
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
          context.strokeStyle = ColorManager.getColorAt(bodies[i].color_index);
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
      var pos = { x : e.clientX - canvas_left, y: e.clientY - canvas_top};
      moveTo(pos);
  }

  function onTouchEvent(e)
  {
      if(e.type == "touchmove")
      {
          lineTo(e);
      }
      else if(e.type == "touchend")
      {
          closePath();
      }
  }

  function moveTo(pos)
  {
      crayon_pos.x = pos.x;
      crayon_pos.y = pos.y;
  }

  function lineTo(pos)
  {
      if(current_color_index == -1)
      {
          current_color_index = ColorManager.getRandomColorIndex();
      }
      current_polygon.push({
          x : pos.x,
          y : pos.y,
      });
      moveTo(pos);
  }

  function closePath()
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
          color_index : current_color_index,
      });
      Matter.World.add(engine.world, [body]);
      current_polygon = [];
      current_color_index = -1;
  }

  function tack()
  {
    
  }

  function erease()
  {

  }

  return {  init         : init,
            onTouchEvent : onTouchEvent,
            moveTo       : moveTo,
            lineTo       : lineTo,
            closePath    : closePath,
            tack         : tack,
            erease       : erease };

})();
