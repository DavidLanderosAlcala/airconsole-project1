
var Game = (function(){

  /* module/local variables */
  var canvas;
  var context;
  var canvas_rect;
  var objects;
  var drawing_data;
  var level_data;
  var listeners = [];

  function init(options)
  {
      MenuManager.init();
      canvas = options.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      objects = {
          shapes : [],
          tacks  : [],
      };

      level_data = {
          id          : 0,
          game_over   : false,
          update_fnc  : null,
          setup_fnc   : null,
          title       : "",
          description : "",
          context     : { },
          hints       : [],
      };

      drawing_data = {
          current_polygon     : [],
          current_color_index : -1,
          is_linto_locked     : false,
          clear : function() {
              drawing_data.current_polygon = [];
              drawing_data.current_color_index = -1;
              drawing_data.is_linto_locked = false;
          }
      };

      canvas_rect = canvas.getBoundingClientRect();
      context = canvas.getContext("2d");
      ColorManager.init(context);
      PlayerCursor.init({ canvas : canvas, context : context });
      window.addEventListener("mousemove", onMouseMove);
      Touch.surface("div.main_container", onTouchEvent);

      Physics.init();

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.requestAnimationFrame(update);
      LevelSelector.show();
  }

  function restartEngine()
  {
      // remove all objects.shapes
      Physics.clear();
      listeners = [];

      // Reset some variables
      objects.shapes = [];
      objects.tacks  = [];

      level_data.hints = [];

      drawing_data.clear();

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
  }

  function update()
  {
      Physics.update();
      if(!level_data.game_over && level_data.update_fnc != null)
      {
          level_data.game_over = level_data.update_fnc(level_data.context);
          if(level_data.game_over)
          {
              setTimeout(function(){
                LevelSelector.show();
              }, 1000);
          }
      }
      render();
      window.requestAnimationFrame(update);
  }

  function render()
  {
      context.lineWidth = (8 / 96) * Physics.getScale();

      /* Clearing the screen */
      context.clearRect(0,0, canvas.width, canvas.height);
      context.save();

      /* Drawing the current polygon */
      context.save();
      if(drawing_data.current_polygon.length > 1)
      {
          context.strokeStyle = ColorManager.getColorAt(drawing_data.current_color_index);
          context.beginPath();
          context.moveTo(drawing_data.current_polygon[0].x, drawing_data.current_polygon[0].y);
          for(var i = 0; i < drawing_data.current_polygon.length; i++)
          {
              context.lineTo(drawing_data.current_polygon[i].x, drawing_data.current_polygon[i].y);
          }
          context.stroke();
      }
      context.restore();

      /* Drawing polygons */
      var i, l = objects.shapes.length;
      for(i = 0; i < l; i++)
      {
          if(objects.shapes[i].isSensor)
          {
              continue;
          }
          context.strokeStyle = ColorManager.getColorAt(objects.shapes[i].color_index);
          context.fillStyle = ColorManager.getColorAt(objects.shapes[i].color_index);
          /* Drawing polygons */
          context.save();
              context.globalAlpha = objects.shapes[i].deleted ? 0.1 : 1.0;
              var position = Physics.getPosition(objects.shapes[i].body);
              context.translate(position.x, position.y);
              context.rotate(Physics.getAngle(objects.shapes[i].body));
              context.translate(-objects.shapes[i].centroid.x, -objects.shapes[i].centroid.y);
              context.beginPath();
              if(objects.shapes[i].type == "polygon" || objects.shapes[i].type == "wire" ) {
                  context.moveTo(objects.shapes[i].vertices[0].x, objects.shapes[i].vertices[0].y);
                  for(var j = 1; j < objects.shapes[i].vertices.length; j++) {
                      context.lineTo(objects.shapes[i].vertices[j].x, objects.shapes[i].vertices[j].y);
                  }
                  if(objects.shapes[i].type == "polygon")
                      context.closePath();
              }
              else if(objects.shapes[i].type == "circle" ) {
                  context.arc(0,0, objects.shapes[i].radio, 0, Math.PI * 2);
              }
              if(objects.shapes[i].type == "wire")
              {
                  context.stroke();
              }
              else
              {
                  context.globalAlpha = objects.shapes[i].deleted ? 0.05 : 0.2;
                  context.fill();
                  context.globalAlpha = objects.shapes[i].deleted ? 0.1 : 1.0;
                  context.stroke(); 
              }
          context.restore();
          /* Drawing polygons (ghost mode) */
          if( Physics.getLabel( objects.shapes[i].body) == "Body" ) {
              context.save();
                  context.beginPath();
                  context.moveTo(objects.shapes[i].vertices[0].x, objects.shapes[i].vertices[0].y);
                  for(var j = 1; j < objects.shapes[i].vertices.length; j++) {
                      context.lineTo(objects.shapes[i].vertices[j].x, objects.shapes[i].vertices[j].y);
                  }

                  if(objects.shapes[i].type == "polygon")
                      context.closePath();
                  context.globalAlpha = 0.1;
                  context.stroke();
              context.restore();
          }
      }

      /* Drawing objects.tacks */
      context.strokeStyle = ColorManager.getColorAt(0);
      var tack_radius = (10 / 96) * Physics.getScale();
      for(var i = 0; i < objects.tacks.length; i++)
      {
          context.save();
          context.beginPath();
          var pos = calcTackAbsPos(i);
          context.translate(pos.x,pos.y);
          context.arc(0, 0, tack_radius, 0, Math.PI * 2);
          context.globalAlpha = objects.tacks[i].deleted ? 0.1 : 1.0;
          context.stroke();
          context.restore();
      }

      /* Drawing level.hints (ghost mode) */
      var i, l = level_data.hints.length;
      for(var i = 0; i < l; i++)
      {
          context.save();
            context.translate(level_data.hints[i].position.x, level_data.hints[i].position.y);
            context.beginPath();
            var j, l2 = level_data.hints[i].vertices.length;
            if(l2 > 1)
            {
                context.moveTo(level_data.hints[i].vertices[0].x, level_data.hints[i].vertices[0].y);
                for(j = 0; j < l2; j++)
                {
                    context.lineTo(level_data.hints[i].vertices[j].x, level_data.hints[i].vertices[j].y);
                }
                context.globalAlpha = level_data.hints[i].opacity;
                context.stroke();
            }
          context.restore();
      }

      context.restore();
  }

  function onKeyDown(e)
  {
      
  }

  function onKeyUp(e)
  {
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
      var pos = { x : e.clientX - canvas_rect.left, y: e.clientY - canvas_rect.top };
      moveTo(pos);
  }

  function onTouchEvent(e)
  {
      if(e.type == "touchstart")
      {
        drawing_data.clear();
      }
      if(e.button == 2 && e.type == "touchstart")
      {
          erease();
          return;
      }
      if(e.type == "touchmove")
      {
          if(e.button == 2)
          {
              erease();
          }
          else
          {
              lineTo(e);
          }
      }
      else if(e.type == "touchend")
      {
          if(PlayerCursor.getCurrentToolName() == "ereaser")
          {
              erease();
          }
          if(PlayerCursor.getCurrentToolName() == "tack" || (drawing_data.current_polygon.length < 2))
          {
              if(e.button != 2)
              {
                  if(!drawing_data.is_linto_locked)
                  {
                      tack();
                  }
                  drawing_data.clear();
              }
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
      if(drawing_data.is_linto_locked)
      {
          return;
      }
      if(PlayerCursor.getCurrentToolName() == "chalk")
      {
          var new_pos = {
            x : pos.x,
            y : pos.y,
          };
          if(drawing_data.current_polygon.length > 0){
            var old_pos = drawing_data.current_polygon[drawing_data.current_polygon.length - 1];
            distance = Math.sqrt((new_pos.x - old_pos.x) * (new_pos.x - old_pos.x) + (new_pos.y - old_pos.y) * (new_pos.y - old_pos.y));
            if(distance < ConfigOptions.min_vertex_distance * Physics.getScale())
            {
              return; 
            }
          }
          if(drawing_data.current_color_index == -1)
          {
            drawing_data.current_color_index = ColorManager.getRandomColorIndex();
          }     
          drawing_data.current_polygon.push(new_pos);
          if(drawing_data.current_polygon.length > 20)
          {
              var tail = drawing_data.current_polygon[drawing_data.current_polygon.length -1];
              var head = drawing_data.current_polygon[0];
              var vec = {
                  x : tail.x - head.x,
                  y : tail.y - head.y,
              };
              var distance = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
              if(distance < (Physics.getScale() * ConfigOptions.polygon_autoclose_distance))
              {
                  var poly = Utils.matterToP2Flavor(drawing_data.current_polygon);
                  if(decomp.isSimple(poly))
                  {
                      closePath();
                      drawing_data.is_linto_locked = true;
                  }
              }
          }
      }
      moveTo(pos);
  }

  function closePath()
  {
      var type = evalCurrentShape();
      console.log("Last evaluation: " + type);
      console.log(JSON.stringify(drawing_data.current_polygon));

      if(type == "invalid")
      {
          drawing_data.clear();
          return;
      }

      if(type == "polygon")
      {
          closeAsPolygon();
          return;
      }

      if(type == "wire")
      {
          closeAsWire();
          return;
      }
  }

  /*
   * return "polygon", "wire", "chain" or "invalid"
   */
  function evalCurrentShape()
  {
      if(drawing_data.current_polygon.length < ConfigOptions.min_vertices_per_polygon)
      {
          return "invalid";
      }

      drawing_data.current_polygon = Utils.removeCollinearPoints(drawing_data.current_polygon, 0.2);

      var h2t_vector = {
          x : drawing_data.current_polygon[0].x - drawing_data.current_polygon[drawing_data.current_polygon.length-1].x,
          y : drawing_data.current_polygon[0].y - drawing_data.current_polygon[drawing_data.current_polygon.length-1].y
      };

      var h2t_distance = Math.sqrt(h2t_vector.x * h2t_vector.x + h2t_vector.y * h2t_vector.y);
      var h2t_angle = Math.atan( h2t_vector.y / h2t_vector.x );
      if(h2t_vector.x < 0)
        h2t_angle += Math.PI;

      var tail_vector = {
          x : drawing_data.current_polygon[drawing_data.current_polygon.length-1].x - drawing_data.current_polygon[drawing_data.current_polygon.length-3].x,
          y : drawing_data.current_polygon[drawing_data.current_polygon.length-1].y - drawing_data.current_polygon[drawing_data.current_polygon.length-3].y
      };

      var tail_angle = Math.atan(tail_vector.y / tail_vector.x );
      if(tail_vector.x < 0)
        tail_angle += Math.PI;

      if(Math.abs(tail_angle - h2t_angle) <= 0.7)
      {
          h2t_distance *= 0.5;
      }


      if(h2t_distance > Physics.getScale() * ConfigOptions.polygon_autoclose_distance * 3)
      {
          return "wire";
      }

      var poly = Utils.matterToP2Flavor(drawing_data.current_polygon);
      if(!decomp.isSimple(poly))
      {
          return "wire";
      }

      return "polygon";
  }

  function closeAsPolygon()
  {
      var body = undefined;

      body = Physics.createBody({
          x : 0, y : 0,
          vertices : drawing_data.current_polygon,
      });

      if(body == undefined) {
          drawing_data.clear();
          return;
      };
      var group = null;
      var tack_indices = [];
      var i, l = objects.tacks.length;
      for(i = 0; i < l; i++)
      {
          if(objects.tacks[i].bodyB == null)
          {
              if(itsInsideOf(calcTackAbsPos(i), drawing_data.current_polygon ))
              {
                  tack_indices.push(i);
              }
          }
      }

      objects.shapes.push({
          body : body,
          type : "polygon",
          vertices : drawing_data.current_polygon,
          centroid: Physics.getCentroid(body),
          color_index : drawing_data.current_color_index,
      });

      l = tack_indices.length;
      var static_connections = 0;
      for(i = 0; i < l; i++)
      {
          objects.tacks[tack_indices[i]].bodyB = body;
          objects.tacks[tack_indices[i]].offsetB = calcTackOffset(calcTackAbsPos(tack_indices[i]), body);

          objects.tacks[tack_indices[i]].contraint = Physics.createRevoluteJoint({
              bodyA  : objects.tacks[tack_indices[i]].bodyA,
              pointA : objects.tacks[tack_indices[i]].offsetA,
              bodyB  : objects.tacks[tack_indices[i]].bodyB,
              pointB : objects.tacks[tack_indices[i]].offsetB,
          });

          if(Physics.isStatic(objects.tacks[tack_indices[i]].bodyA))
          {
              static_connections++;
          }
          onTackConnected();
      }
      drawing_data.clear();
  }

  function closeAsWire()
  {
      var body = Physics.createWire({vertices:drawing_data.current_polygon});
      if(body == undefined)
      {
          drawing_data.clear();
          return;
      }
      var tack_indices = [];
      var i, l = objects.tacks.length;
      for(i = 0; i < l; i++)
      {
          if(objects.tacks[i].bodyB == null)
          {
              if(itsInsideOf(calcTackAbsPos(i), drawing_data.current_polygon ))
              {
                  tack_indices.push(i);
              }
          }
      }

      objects.shapes.push({
          body : body,
          type : "wire",
          vertices : drawing_data.current_polygon,
          centroid : Physics.getCentroid(body),
          color_index : drawing_data.current_color_index,
      });

      l = tack_indices.length;
      var static_connections = 0;
      for(i = 0; i < l; i++)
      {
          objects.tacks[tack_indices[i]].bodyB = body;
          objects.tacks[tack_indices[i]].offsetB = calcTackOffset(calcTackAbsPos(tack_indices[i]), body);

          objects.tacks[tack_indices[i]].contraint = Physics.createRevoluteJoint({
              bodyA  : objects.tacks[tack_indices[i]].bodyA,
              pointA : objects.tacks[tack_indices[i]].offsetA,
              bodyB  : objects.tacks[tack_indices[i]].bodyB,
              pointB : objects.tacks[tack_indices[i]].offsetB,
          });

          if(objects.tacks[tack_indices[i]].bodyA.isStatic)
          {
              static_connections++;
          }
          onTackConnected();
      }

      drawing_data.clear();
  }

  function tack()
  {
      var cur_pos = PlayerCursor.getPosition();

      var tack = {
          bodyA     : null,
          offsetA   : null,
          bodyB     : null,
          offsetB   : null,
          contraint : null,
      };

      var _bodies = Physics.getBodiesAtPoint(cur_pos);
      
      for(var i = 0; i < _bodies.length; i++)
      {
          if(!Physics.isSensor(_bodies[i]))
          {
              tack.bodyA = _bodies[i];
              break;
          }
      }

      if(tack.bodyA == null)
      {
          console.log("You cannot put tacks in the air");
          return;
      }

      tack.offsetA = calcTackOffset(cur_pos, tack.bodyA);
      objects.tacks.push(tack);
      onTackAdded();
  }

  function erease()
  {
      /* AQUI VOY */
      // obtener la posicion del cursor
      var cur_pos = PlayerCursor.getPosition();

      // buscar tacks para elminarlas
      var i, l = objects.tacks.length;
      for(i = 0 ; i < l; i ++)
      {
          if(!objects.tacks[i].deleted)
          {
              var tack_pos = calcTackAbsPos(i)
              var diff_x = cur_pos.x - tack_pos.x;
              var diff_y = cur_pos.y - tack_pos.y;
              var distance = Math.sqrt((diff_x * diff_x) + (diff_y * diff_y));
              if(distance < 20)
              {
                 // si se encuentra un tack, borrarla y terminar
                  if(objects.tacks[i].contraint != null)
                  {
                      Physics.removeConstraint(objects.tacks[i].contraint);
                  }
                  objects.tacks[i].contraint = null;
                  objects.tacks[i].deleted = true;
                  drawing_data.clear();
                  return;
              }
          }
      }

      // si no se encuentra tack, eliminar una figura que se encuentre bajo el cursor
      var _bodies = Physics.getBodiesAtPoint(cur_pos);

      l = _bodies.length;
      for(i = 0; i < l; i++)
      {
          if( Physics.isSensor(_bodies[i]) || Physics.getLabel(_bodies[i]) != "Body")
              continue;
          removeBody(_bodies[i]);
          break;
      }
      drawing_data.clear();
  }

  function removeBody(body)
  {
      if(body.label != "Body")
        return;
      Physics.removeBody(body);
      removeTacksConnectedTo(body.id);
      var i, l = objects.shapes.length;
      for(i = 0; i < l; i++)
      {
          if(body == objects.shapes[i].body)
          {
              objects.shapes[i].deleted = true;
              return;
          }
      }      
  }

  function calcTackAbsPos(index)
  {
      var tack = objects.tacks[index];
      var scaled_offsetA = tack.offsetA;
      var x = scaled_offsetA.x;
      var y = scaled_offsetA.y;
      var r = Physics.getAngle(tack.bodyA);

      // 2D Rotation 
      var pos = {
          x : (x  * Math.cos(r)) - (y * Math.sin(r)),
          y : (y * Math.cos(r)) + (x * Math.sin(r)),
      };
      
      var body_pos = Physics.getPosition(tack.bodyA);
      pos.x += body_pos.x;
      pos.y += body_pos.y;
      return pos;
  }

  function calcTackOffset(pos, body)
  {
      var body_pos = Physics.getPosition(body);
      var x = pos.x - body_pos.x;
      var y = pos.y - body_pos.y;
      var angle = -Physics.getAngle(body);

      // 2D Rotation 
      offset = {
          x : (x  * Math.cos(angle)) - (y * Math.sin(angle)),
          y : (y * Math.cos(angle)) + (x * Math.sin(angle)),
      };
      return offset;
  }

  function removeTacksConnectedTo(body_id)
  {
      for(var i = objects.tacks.length-1; i >= 0; i--)
      {
          if(!objects.tacks[i].deleted)
          {
              if( Physics.getId(objects.tacks[i].bodyA) == body_id)
              {
                   if(objects.tacks[i].contraint != null)
                   {
                       Physics.removeConstraint(objects.tacks[i].contraint);
                   }
                   objects.tacks[i].contraint = null;
                   objects.tacks[i].deleted = true;
              }
              if(objects.tacks[i].bodyB != null &&  Physics.getId(objects.tacks[i].bodyB) ==  body_id)
              {
                   Physics.removeConstraint(objects.tacks[i].contraint);
                   objects.tacks[i].contraint = null;
                   objects.tacks[i].deleted = true;
              }
          }
      }
  }

  function changeTool()
  {
      PlayerCursor.changeTool();
  }

  function loadLevel(level_index)
  {
      restartEngine();
      level_data.game_over = false;
      level_data.context = {};
      level_data.id = level_index;
      var level = LevelSelector.getLevels()[level_index];
      level_data.update_fnc = level.update;
      var _bodies = [];
      level.hints = level.hints || [];
      level_data.hints = [];
      for(var i = 0; i < level.hints.length;i++)
      {
          level_data.hints.push(prepareLevelShapes(level.hints[i]));
      }
      for(var i = 0; i < level.bodies.length; i++)
      {
          var type = level.bodies[i].type == "circle" ? "circle" : "polygon";
          var scaledBody = prepareLevelShapes(level.bodies[i]);
          if(type == "polygon")
          {
              var body = Physics.createBody({
                  x : scaledBody.position.x,
                  y : scaledBody.position.y,
                  vertices : scaledBody.vertices,
                  label : level.bodies[i].label,
                  isKinematic : level.bodies[i].isKinematic || false,
                  isStatic : level.bodies[i].isStatic,
                  friction : 0.5,
                  isSensor: level.bodies[i].isSensor,
              });
              var centroid = Physics.getCentroid(body);
          }
          else if(type == "circle")
          {
              var centroid = { x : 0, y: 0 };
              var body = Physics.createCircle({
                  x : scaledBody.position.x,
                  y : scaledBody.position.y,
                  radio    : scaledBody.radio,
                  label    : level.bodies[i].label,
                  isStatic : level.bodies[i].isStatic,
                  friction : 0.5,
              });
          }
          objects.shapes.push({
              body        : body,
              deleted     : false,
              isSensor    : level.bodies[i].isSensor,
              type        : type,
              vertices    : scaledBody.vertices,
              radio       : scaledBody.radio,
              centroid    : centroid,
              color_index : ColorManager.getRandomColorIndex(),
          });
          _bodies.push(body);
      }

      level_data.title       = level.title;
      level_data.description = level.description;
      level_data.setup_fnc   = level.setup;

      Screen.setTitleText(level.description);
      if(level_data.setup_fnc != undefined)
          level_data.setup_fnc(level_data.context);
  }

  function restartLevel()
  {
      loadLevel(level_data.id);
  }

  function itsInsideOf(pos, polygon)
  {
      var sides = polygon.length - 1;
      var j = sides - 1;
      var pointStatus = false;
      for (var i = 0; i < sides; i++)
      {
          if (polygon[i].y < pos.y && polygon[j].y >= pos.y || polygon[j].y < pos.y && polygon[i].y >= pos.y)
          {
              if (polygon[i].x + (pos.y - polygon[i].y) /  (polygon[j].y - polygon[i].y) * (polygon[j].x - polygon[i].x) < pos.x)
              {
                  pointStatus = !pointStatus ;                        
              }
          }
          j = i;
      }
      return pointStatus;
  }

  function prepareLevelShapes(const_shape)
  {
      /* Fixme: improve this coping technique */
      var shape = JSON.parse(JSON.stringify(const_shape));
      
      shape.position.x *= Physics.getScale();
      shape.position.y *= Physics.getScale();

      shape.position.y = -shape.position.y;
      shape.position.x += Screen.getWidth()>>1;
      shape.position.y += Screen.getHeight();
      if(shape.vertices)
      {
          var v, l = shape.vertices.length;
          for(v = 0; v < l; v++)
          {
              shape.vertices[v].x *= Physics.getScale();
              shape.vertices[v].y *= Physics.getScale();

              shape.vertices[v].y = -shape.vertices[v].y;
          }
      }
      if(shape.radio)
      {
          shape.radio *= Physics.getScale();
      }
      
      if(shape.opacity != 0.0)
      {
          shape.opacity = shape.opacity || 0.1;
      }
      
      return shape;
  }

  function getHints()
  {
      return level_data.hints;
  }

  function on(type, callback)
  {
      if(!listeners[type])
      {
          listeners[type] = [];
      }
      listeners[type].push(callback);
  }

  function onTackAdded()
  {
      var callbacks = listeners["addTack"];
      if(callbacks)
      {
          for(var i = 0; i < callbacks.length; i++)
          {
               callbacks[i](event);
          }
      }
  }

  function onTackConnected()
  {
      var callbacks = listeners["connectTack"];
      if(callbacks)
      {
          for(var i = 0; i < callbacks.length; i++)
          {
               callbacks[i](event);
          }
      }
  }

  function DrawEvilShape(shape)
  {
      // No se puede crear alambre con este dibujo
      //drawing_data.current_polygon = [{"x":212,"y":475},{"x":209,"y":477},{"x":204,"y":481},{"x":198,"y":484},{"x":190,"y":486},{"x":180,"y":489},{"x":173,"y":489},{"x":168,"y":489},{"x":164,"y":489},{"x":158,"y":488},{"x":157,"y":488},{"x":151,"y":485},{"x":150,"y":483},{"x":146,"y":478},{"x":143,"y":474},{"x":140,"y":467},{"x":138,"y":458},{"x":132,"y":448},{"x":126,"y":440},{"x":123,"y":426},{"x":120,"y":415},{"x":114,"y":404},{"x":110,"y":395},{"x":108,"y":389},{"x":106,"y":379},{"x":105,"y":375},{"x":105,"y":367},{"x":105,"y":365},{"x":105,"y":356},{"x":105,"y":347},{"x":105,"y":339},{"x":106,"y":331},{"x":110,"y":324},{"x":113,"y":318},{"x":118,"y":312},{"x":125,"y":306},{"x":130,"y":304},{"x":137,"y":301},{"x":144,"y":300},{"x":150,"y":299},{"x":156,"y":298},{"x":163,"y":298},{"x":166,"y":298},{"x":170,"y":298},{"x":171,"y":298},{"x":176,"y":298},{"x":179,"y":301},{"x":186,"y":304},{"x":191,"y":308},{"x":197,"y":313},{"x":204,"y":317},{"x":209,"y":323},{"x":212,"y":326},{"x":215,"y":330},{"x":217,"y":334},{"x":217,"y":334},{"x":217,"y":334},{"x":217,"y":334},{"x":217,"y":334},{"x":217,"y":334},{"x":217,"y":334},{"x":217,"y":334},{"x":220,"y":338},{"x":220,"y":338},{"x":220,"y":338},{"x":220,"y":338},{"x":220,"y":338},{"x":220,"y":338},{"x":220,"y":338},{"x":220,"y":338},{"x":221,"y":341},{"x":224,"y":349},{"x":225,"y":352},{"x":225,"y":352},{"x":225,"y":352},{"x":225,"y":352},{"x":225,"y":352},{"x":225,"y":352},{"x":225,"y":356},{"x":227,"y":363},{"x":227,"y":367},{"x":227,"y":375},{"x":227,"y":380},{"x":227,"y":386},{"x":227,"y":389},{"x":227,"y":392},{"x":227,"y":392},{"x":227,"y":392},{"x":227,"y":396},{"x":227,"y":399},{"x":224,"y":402},{"x":224,"y":405},{"x":223,"y":410},{"x":220,"y":414},{"x":219,"y":419},{"x":217,"y":423},{"x":216,"y":425},{"x":216,"y":428},{"x":214,"y":431},{"x":213,"y":434},{"x":212,"y":438},{"x":211,"y":440},{"x":209,"y":443},{"x":207,"y":446},{"x":206,"y":449},{"x":205,"y":451},{"x":204,"y":453},{"x":204,"y":454},{"x":203,"y":457},{"x":202,"y":459},{"x":201,"y":461},{"x":200,"y":463},{"x":199,"y":464},{"x":198,"y":467},{"x":197,"y":468},{"x":197,"y":470},{"x":196,"y":471},{"x":196,"y":473},{"x":195,"y":476},{"x":194,"y":478},{"x":194,"y":478},{"x":194,"y":478},{"x":194,"y":478},{"x":194,"y":478},{"x":194,"y":478},{"x":194,"y":480},{"x":194,"y":480},{"x":194,"y":480},{"x":194,"y":480},{"x":194,"y":480},{"x":194,"y":480},{"x":194,"y":480},{"x":194,"y":480},{"x":194,"y":481},{"x":194,"y":483},{"x":194,"y":483},{"x":194,"y":483},{"x":194,"y":486},{"x":194,"y":488},{"x":194,"y":491},{"x":194,"y":495},{"x":196,"y":497},{"x":198,"y":499},{"x":200,"y":500},{"x":202,"y":501},{"x":204,"y":501},{"x":206,"y":501},{"x":207,"y":501},{"x":208,"y":501}];
      // Este dibujo viaja hacia el origen
      //drawing_data.current_polygon = [{"x":244,"y":599},{"x":245,"y":603},{"x":251,"y":611},{"x":265,"y":619},{"x":280,"y":622},{"x":288,"y":625},{"x":335,"y":619},{"x":344,"y":614},{"x":351,"y":612},{"x":355,"y":608},{"x":362,"y":597},{"x":362,"y":544},{"x":357,"y":527},{"x":345,"y":510},{"x":337,"y":498},{"x":332,"y":493},{"x":308,"y":478},{"x":299,"y":477},{"x":282,"y":471},{"x":274,"y":471},{"x":264,"y":468},{"x":196,"y":468},{"x":189,"y":470},{"x":187,"y":472},{"x":179,"y":477},{"x":177,"y":480},{"x":174,"y":481},{"x":172,"y":484},{"x":171,"y":484},{"x":171,"y":487},{"x":169,"y":489},{"x":169,"y":501},{"x":168,"y":505},{"x":168,"y":522},{"x":169,"y":526},{"x":170,"y":528},{"x":170,"y":529},{"x":174,"y":539},{"x":174,"y":541},{"x":177,"y":544},{"x":177,"y":547},{"x":178,"y":551},{"x":180,"y":555},{"x":182,"y":557},{"x":188,"y":567},{"x":191,"y":575},{"x":192,"y":576},{"x":193,"y":579},{"x":195,"y":579},{"x":197,"y":582},{"x":198,"y":582},{"x":200,"y":584},{"x":200,"y":585},{"x":202,"y":587},{"x":203,"y":587},{"x":203,"y":588},{"x":205,"y":589},{"x":206,"y":591},{"x":207,"y":591},{"x":208,"y":592},{"x":209,"y":594},{"x":210,"y":594},{"x":212,"y":596},{"x":214,"y":596},{"x":219,"y":598},{"x":222,"y":598},{"x":224,"y":599},{"x":227,"y":599},{"x":229,"y":600},{"x":245,"y":600},{"x":251,"y":597},{"x":252,"y":597},{"x":254,"y":596},{"x":255,"y":596},{"x":259,"y":592},{"x":260,"y":592},{"x":262,"y":590},{"x":263,"y":590},{"x":264,"y":588},{"x":265,"y":588},{"x":267,"y":587},{"x":268,"y":585},{"x":270,"y":584}];
      // Esto es un fantasma
      drawing_data.current_polygon = [{"x":581,"y":472},{"x":578,"y":475},{"x":577,"y":477},{"x":577,"y":481},{"x":576,"y":484},{"x":573,"y":487},{"x":574,"y":508},{"x":585,"y":538},{"x":588,"y":541},{"x":591,"y":546},{"x":597,"y":552},{"x":598,"y":552},{"x":602,"y":555},{"x":605,"y":556},{"x":647,"y":556},{"x":650,"y":555},{"x":651,"y":552},{"x":654,"y":547},{"x":656,"y":541},{"x":659,"y":536},{"x":660,"y":532},{"x":663,"y":528},{"x":663,"y":526},{"x":664,"y":523},{"x":665,"y":523},{"x":667,"y":518},{"x":667,"y":516},{"x":668,"y":513},{"x":670,"y":510},{"x":671,"y":507},{"x":671,"y":504},{"x":672,"y":500},{"x":672,"y":494},{"x":673,"y":492},{"x":674,"y":491},{"x":674,"y":488},{"x":675,"y":488},{"x":675,"y":484},{"x":678,"y":477},{"x":678,"y":465},{"x":677,"y":462},{"x":677,"y":460},{"x":675,"y":460},{"x":674,"y":459},{"x":665,"y":456},{"x":642,"y":454},{"x":636,"y":451},{"x":592,"y":454}];
      closePath();
  }

  return {  init          : init,
            moveTo        : moveTo,
            lineTo        : lineTo,
            closePath     : closePath,
            tack          : tack,
            erease        : erease,
            changeTool    : changeTool,
            loadLevel     : loadLevel,
            restartLevel  : restartLevel,
            getHints      : getHints,
            on            : on,
            DrawEvilShape : DrawEvilShape };
})();
