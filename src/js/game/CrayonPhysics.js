
var CrayonPhysics = (function(){

  /* constants */
  const default_canvas_width  = 640;
  const default_canvas_height = 480;  

  /* variables */
  var canvas;
  var context;
  var canvas_left;
  var canvas_top;
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
      PlayerCursor.init({ canvas : canvas, context : context });

      document.querySelector(".main_container").addEventListener("mousemove", onMouseMove);
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
      Touch.surface("div.main_container", onTouchEvent);

      if(Utils.isRunningOnAirConsole())
      {
          // AirConsole Mode
          document.querySelector("#fullscreen_option").style.position = "absolute";
          document.querySelector("#fullscreen_option").style.top = "-500px";
      }
      else
      {
          // Normal web browser mode
          Touch.checkbox("#fullscreen_checkbox", function(e){
              e.sender.dataset.checked = e.checked ? "true" : "false";
              if(e.checked)
              {
                  Screen.requestFullscreen();
              }
              else
              {
                  Screen.exitFullscreen();
              }
          });
      }

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
          context.lineWidth = 8;
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
      context.lineWidth = 8;
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
          context.lineWidth = 8;
          context.stroke();
          context.restore();
      }

      PlayerCursor.draw();
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
      PlayerCursor.moveTo(pos);
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
      var body = Matter.Bodies.fromVertices(centroid.x, centroid.y, current_polygon, {friction: 0.5});
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
       var _bodies = Matter.Composite.allBodies(engine.world);
       var _bodies = Matter.Query.point(_bodies, crayon_pos);
       var i, l = _bodies.length;
       for(i = 0; i < l; i++)
       {
           removeBody(_bodies[i]);
       }
  }

  function changeTool()
  {
      PlayerCursor.changeTool();
  }

  function removeBody(body)
  {
  	  if(body.id == ground.id)
  	      return;
      Matter.World.remove(engine.world, [body]);
      var i, l = bodies.length;
      for(i = 0; i < l; i++)
      {
          if(body.id == bodies[i].body.id)
          {
              bodies.splice(i,1);
              return;
          }
      }      
  }

  return {  init         : init,
            onTouchEvent : onTouchEvent,
            moveTo       : moveTo,
            lineTo       : lineTo,
            closePath    : closePath,
            tack         : tack,
            erease       : erease,
            changeTool   : changeTool };

})();
