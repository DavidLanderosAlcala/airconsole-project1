
var CrayonPhysics = (function(){

  /* variables */
  var canvas;
  var context;
  var canvas_left;
  var canvas_top;
  var engine;
  var bodies = [];
  var current_polygon = [];
  var current_color_index = -1;
  var useDebugRenderer = false;

  var global_x_offset = 0;
  var global_y_offset = 0;

  // Level related
  var current_level_index = 0;
  var current_update_function = null;
  var current_level_context = {};
  var game_over = false;


  // testing
  var tacks = [];

  function init(options)
  {
      MenuManager.init();
      canvas = options.canvas;
      canvas_left = canvas.getBoundingClientRect().left;
      canvas_top = canvas.getBoundingClientRect().top;
      global_x_offset = canvas.width >> 1;
      global_y_offset = canvas.height;
      context = canvas.getContext("2d");
      ColorManager.init(context);
      PlayerCursor.init({ canvas : canvas, context : context });
      window.addEventListener("mousemove", onMouseMove);
      Touch.surface("div.main_container", onTouchEvent);
      engine = Matter.Engine.create();
      Matter.Engine.run(engine);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.requestAnimationFrame(render);
      LevelSelector.show();
  }

  function restartEngine()
  {
      // remove all bodies
      var _bodies = Matter.Composite.allBodies(engine.world);
      Matter.World.remove(engine.world, _bodies);

      // Reset some variables
      bodies = [];
      current_polygon = [];
      current_color_index = -1;

      // testing
      tacks = [];
  }

  function render()
  {
      if(!game_over && current_update_function != null)
      {
          game_over = current_update_function(current_level_context, engine);
          if(game_over)
            Screen.setTitleText("You won!!");
      }

      // clearing the screen
      context.clearRect(0,0, canvas.width, canvas.height);
      context.save();
      context.translate(global_x_offset, global_y_offset);

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

      // drawing tacks
      context.strokeStyle = ColorManager.getColorAt(0);
      context.lineWidth = 8;
      for(var i = 0; i < tacks.length; i++)
      {
          context.beginPath();
          context.arc(tacks[i].x, tacks[i].y, 10, 0, Math.PI * 2);
          context.stroke();
      }

          context.beginPath();
          context.arc(0, 0, 10, 0, Math.PI * 2);
          context.stroke();

      if(useDebugRenderer)
      {
          debugRender();
      }

      context.restore();
      window.requestAnimationFrame(render);
  }

  function debugRender()
  {
      context.save();
      var bodies = Matter.Composite.allBodies(engine.world);
      context.beginPath();
      for (var i = 0; i < bodies.length; i += 1) {
          var vertices = bodies[i].vertices;
          context.moveTo(vertices[0].x, vertices[0].y);
          for (var j = 1; j < vertices.length; j += 1) {
              context.lineTo(vertices[j].x, vertices[j].y);
          }
          context.lineTo(vertices[0].x, vertices[0].y);
      }
      context.lineWidth = 3;
      context.strokeStyle = '#0f0';
      context.stroke();
      context.restore();
  }

  function onKeyDown(e)
  {
      
  }

  function onKeyUp(e)
  {
      console.log(e.keyCode);
      if(e.keyCode == 80) // P key
      {
          if(MenuSettings.isVisible())
          {
              MenuSettings.hide();
          }
          else
          {
              MenuSettings.show();
          }
      }
      if(e.keyCode == 76) // L key
      {
          if(LevelSelector.isVisible())
          {
              LevelSelector.hide();
          }
          else
          {
              LevelSelector.show();
          }
      }
      if(e.keyCode == 84) // T key
      {
          PlayerCursor.changeTool();
      }
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
          if(PlayerCursor.getCurrentToolName() == "ereaser")
          {
              erease();
          }
          if(PlayerCursor.getCurrentToolName() == "tack")
          {
              tack();
          }
          else
          {
              closePath();
          }
      }
  }

  function moveTo(pos)
  {
      PlayerCursor.moveTo(pos);
  }

  function lineTo(pos)
  {
      if(PlayerCursor.getCurrentToolName() == "chalk")
      {
          var new_pos = {
            x : pos.x - global_x_offset,
            y : pos.y - global_y_offset,
          };
          if(current_polygon.length > 0){
            var old_pos = current_polygon[current_polygon.length - 1];
            distance = Math.sqrt((new_pos.x - old_pos.x) * (new_pos.x - old_pos.x) + (new_pos.y - old_pos.y) * (new_pos.y - old_pos.y));
            if(distance < 10)
            {
              return; 
            }
          }
          if(current_color_index == -1)
          {
            current_color_index = ColorManager.getRandomColorIndex();
          }     
          current_polygon.push(new_pos);



          // El siguiente codigo podria ser el inicio para detectar
          // cuando el dibujo debe ser un cuerpo solido o un "alambre"
          // cuando hay mas de 5 vertices
          // calculamos la distancia entre el primero y el ultimo
          if(current_polygon.length >= 5)
          {
              var diff_x = current_polygon[0].x - current_polygon[current_polygon.length-1].x;
              var diff_y = current_polygon[0].y - current_polygon[current_polygon.length-1].y;
              var head_to_tail_distance = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

              // si la distancia es menor a 30 pixeles damos por terminada la figura
              // Esto es un cuerpo solido.
              if(head_to_tail_distance < 30)
              {
                  closePath();
              }
          }

      }
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
      checkForTacks(bodies[bodies.length-1]);
      current_polygon = [];
      current_color_index = -1;
  }

  function checkForTacks(my_body)
  {
      var count = 0;
      var _bodies = null;
      for(var tack_i = 0; tack_i < tacks.length; tack_i++)
      {
          _bodies = Matter.Composite.allBodies(engine.world);
          _bodies = Matter.Query.point(_bodies, {x : tacks[tack_i].x, y : tacks[tack_i].y} );
          var i, l = _bodies.length;
          for(i = 0; i < l; i++)
          {
              if(my_body.body.id == _bodies[i].id)
              {
                  var diff = {
                      x : tacks[tack_i].x - my_body.body.position.x,
                      y : tacks[tack_i].y - my_body.body.position.y,
                  };
                  // agregar restriccion
                  var constraint = Matter.Constraint.create({
                      bodyA  : my_body.body,
                      pointA : diff,
                      pointB :  tacks[tack_i],
                      stiffness: 0.1,
                      length : 1,
                  });
                  count++;
                  Matter.World.add(engine.world, [constraint]);
              }
          }
      }
      if(count > 1)
      {
          // si tiene 2 tacks entonces debe quedar completamente estatica
          Matter.Body.setStatic(my_body.body,true);
      }
  }

  function tack()
  {
      var cur_pos = PlayerCursor.getPosition();
      cur_pos.x -= global_x_offset;
      cur_pos.y -= global_y_offset; 
      tacks.push({ x : cur_pos.x, y: cur_pos.y });
  }

  function erease()
  {
      var _bodies = Matter.Composite.allBodies(engine.world);
      var cur_pos = PlayerCursor.getPosition();
      cur_pos.x -= global_x_offset;
      cur_pos.y -= global_y_offset;
      var _bodies = Matter.Query.point(_bodies, cur_pos);
      var i, l = _bodies.length;
      for(i = 0; i < l; i++)
      {
          removeBody(_bodies[i]);
      }
      current_polygon = [];
      current_color_index = -1;
  }

  function changeTool()
  {
      PlayerCursor.changeTool();
  }

  function removeBody(body)
  {
      if(body.label != "Body")
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

  function enableDebugRenderer()
  {
      useDebugRenderer = true;
  }

  function disableDebugRenderer()
  {
      useDebugRenderer = false;
  }

  function isDebugRendererEnabled()
  {
      return useDebugRenderer;
  }

  function loadLevel(level_index)
  {
      restartEngine();
      game_over = false;
      current_level_context = {};
      current_level_index = level_index;
      var level_data = LevelSelector.getLevels()[level_index];
      current_update_function = level_data.update;
      var _bodies = [];
      for(var i = 0; i < level_data.bodies.length; i++)
      {
          if(level_data.bodies[i].mapped == undefined)
          {
              level_data.bodies[i].position.y = -level_data.bodies[i].position.y;
              for(var v = 0; v < level_data.bodies[i].vertices.length; v++)
              {
                  level_data.bodies[i].vertices[v].y = -level_data.bodies[i].vertices[v].y;
              }
              level_data.bodies[i].mapped = true;
          }
          var centroid = Matter.Vertices.centre(level_data.bodies[i].vertices);
          var body = Matter.Bodies.fromVertices(level_data.bodies[i].position.x,
                                                level_data.bodies[i].position.y,
                                                level_data.bodies[i].vertices,
                                                { isStatic : level_data.bodies[i].isStatic, label : level_data.bodies[i].label });
          bodies.push({
              body : body,
              vertices : level_data.bodies[i].vertices,
              centroid: centroid,
              color_index : ColorManager.getRandomColorIndex(),
          });
          _bodies.push(body);
      }
      Matter.World.add(engine.world, _bodies);
      Screen.setTitleText(level_data.description);
      if(level_data.setup != undefined)
          level_data.setup(current_level_context, engine);
  }

  function restartLevel()
  {
      loadLevel(current_level_index);
  }

  return {  init          : init,
            onTouchEvent  : onTouchEvent,
            moveTo        : moveTo,
            lineTo        : lineTo,
            closePath     : closePath,
            tack          : tack,
            erease        : erease,
            changeTool    : changeTool,
            enableDebugRenderer    : enableDebugRenderer,
            disableDebugRenderer   : disableDebugRenderer,
            isDebugRendererEnabled : isDebugRendererEnabled,
            loadLevel     : loadLevel,
            restartLevel  : restartLevel };

})();
