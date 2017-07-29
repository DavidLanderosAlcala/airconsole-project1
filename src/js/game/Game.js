

/**
  * @module Game
  */
var Game = (function(){

  var camera = [0,0];
  var canvas;
  var context;
  var canvasRect;
  var objects;
  var drawingData;
  var levelData;
  var listeners = [];
  var chainIdCount = 0;
  var collisionGroupCount = 1;
  var tackFrameCount = 0;
  var candidateTacksForNewWire = [];
  var hudTimerTextElem = null;

  /** @func init
    * @desc Called from Screen.init(...)
    */
  function init(options)
  {
      var runInTesterMode = false;
      if(window.location.href.indexOf("#") > 0)
      {
          runInTesterMode = true;
          var encodedLvl = window.location.href.split("#")[1];
          var decodedLvl = atob(encodedLvl);
          eval(decodedLvl);
      }

      DirtyLayer.init();
      MenuManager.init();
      canvas = options.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      objects = {
          shapes : [],
          tacks  : [],
          chains : [],
      };

      levelData = {
          id          : 0,
          earnedStars : 0,
          updateFnc  : null,
          setupFnc   : null,
          title       : "",
          description : "",
          context     : { },
          hints       : [],
          startTime  : 0,
          respawnableBodies : [],
          spawners    : [],
          drawnObjectsCount : 0,
      };

      drawingData = {
          currentPolygon     : [],
          currentColorIndex : -1,
          isLineToLocked     : false,
          candidateTackIndexA : 0,
          candidateTackIndexB : 0,
          clear : function() {
              drawingData.currentPolygon = [];
              drawingData.currentColorIndex = -1;
              drawingData.isLineToLocked = false;
              drawingData.candidateTackIndexA = 0;
              drawingData.candidateTackIndexB = 0;
          }
      };

      canvasRect = canvas.getBoundingClientRect();
      context = canvas.getContext("2d");
      ColorManager.init(context);
      PlayerCursor.init({ canvas : canvas, context : context });
      window.addEventListener("mousemove", onMouseMove);
      Touch.surface("div.main_container", onTouchEvent);

      Physics.init();

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.requestAnimationFrame(update);

      if(runInTesterMode)
      {
          /* Execute the last level (which was included from the URL) */
          var testingLevel = LevelManager.getLevels().length -1;
          setTimeout(function() { loadLevel(testingLevel); }, 500);
          LevelManager.hide();
      }
      else
      {
          LevelManager.show();
      }

      hudTimerTextElem = document.querySelector("#hud-timer-text");
  }

  function showTooltip(star_index)
  {
     var tt = document.querySelector("#tooltip");
     tt.innerHTML = levelData.descriptions[star_index];
     tt.style.zIndex = 10;
  }

  function hideTooltip()
  {
     var tt = document.querySelector("#tooltip");
     tt.innerHTML = "";
     tt.style.zIndex = -10;
  }

  /** @func restartEngine
    * @desc Destroys everything and clears the blackboard
    */
  function restartEngine()
  {
      // remove all objects.shapes
      Physics.clear();
      DirtyLayer.clear();
      drawingData.clear();

      listeners = [];

      // Reset some variables
      objects.shapes = [];
      objects.tacks  = [];
      objects.chains  = [];
      chainIdCount = 0;
      tackIdCount = 0;
      collisionGroupCount = 0;

      levelData.hints = [];
      levelData.respawnableBodies = [];
      levelData.spawners = [];
      levelData.drawnObjectsCount = 0;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  }

  /** @func update
    * @desc Update the game 1 step
    */
  function update()
  {
      preprocessBodies();
      Physics.update();
      if(levelData.earnedStars == 0 && levelData.updateFnc != null)
      {
          levelData.earnedStars = levelData.updateFnc(levelData.context);

          if(levelData.earnedStars > 0)
          {
              LevelManager.updateLevelStars(levelData.id, levelData.earnedStars);
              LevelManager.unlockLevel(levelData.id + 1);
              setTimeout(function(){
                LevelCompleteScreen.showScreen(LevelManager.getEarnedStarsCount(levelData.id));
                document.querySelector(".hud-timer-hand").dataset.rotate = "false";
              }, 800);
          }
      }
      render();
      if(levelData.earnedStars == 0 && getDrawnObjectsCount() > 0)
      {
          hudTimerTextElem.innerHTML = getElapsedTime_str();
      }
      window.requestAnimationFrame(update);
  }

  /** @func preprocessBodies
    * @desc Removes objects from the world if they are off the screen
    *       respawn objects if needed; called from Update
    */
  function preprocessBodies()
  {
      var bodies = Physics.getAllBodies();
      var i;

      for(i = 0; i < levelData.respawnableBodies.length; i++)
      {
          if(Physics.getPosition(levelData.respawnableBodies[i])[1] > 100)
          {
              Physics.setPosition(levelData.respawnableBodies[i], levelData.spawners[i]);
              Physics.clearForces(levelData.respawnableBodies[i]);
          }
      }

      for(i = bodies.length -1 ; i >= 0; i--)
      {        
          if(Physics.getPosition(bodies[i])[1] > Screen.getHeight())
          {
              removeBody(bodies[i], true);
          }
      }
  }

  /** @func render
    * @desc Draws the blackboard, called from Update
    */
  function render()
  {
      context.lineWidth = 0.09 * Physics.getScale();

      /* Clearing the screen */
      context.clearRect(0,0, canvas.width, canvas.height);
      context.save();
      context.translate(-camera[0], -camera[1]);

      /* Drawing the current polygon */
      context.save();
      if(drawingData.currentPolygon.length > 1)
      {
          context.strokeStyle = ColorManager.getColorAt(drawingData.currentColorIndex);
          context.beginPath();
          context.moveTo(drawingData.currentPolygon[0][0], drawingData.currentPolygon[0][1]);
          for(var i = 0; i < drawingData.currentPolygon.length; i++)
          {
              context.lineTo(drawingData.currentPolygon[i][0], drawingData.currentPolygon[i][1]);
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
          context.globalAlpha = 1.0;
          var position = Physics.getPosition(objects.shapes[i].body);
          context.translate(position[0], position[1]);
          context.rotate(Physics.getAngle(objects.shapes[i].body));
          context.translate(-objects.shapes[i].centroid[0], -objects.shapes[i].centroid[1]);
          context.beginPath();
          if(objects.shapes[i].type == "polygon" || objects.shapes[i].type == "wire" ) {
              context.moveTo(objects.shapes[i].vertices[0][0], objects.shapes[i].vertices[0][1]);
              for(var j = 1; j < objects.shapes[i].vertices.length; j++) {
                  context.lineTo(objects.shapes[i].vertices[j][0], objects.shapes[i].vertices[j][1]);
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
              context.globalAlpha = 0.2;
              context.fill();
              context.globalAlpha = 1.0;
              context.stroke(); 
          }
          context.restore();
      }

      /* Drawing chains */
      context.save();
      context.strokeStyle = ColorManager.getColorAt(0);
      for(var i = 0; i < objects.chains.length; i++)
      {
          /* Drawing chains  */
          for(var chl = 0; chl < objects.chains[i].chain_links.length; chl++)
          {
              context.save();
              context.globalAlpha = objects.chains[i].deleted ? 0.1 : 1.0;
              var handler = objects.chains[i].chain_handler[chl];
              var link = objects.chains[i].chain_links[chl];
              var pos = Physics.getPosition(handler);
              var centroid = Physics.getCentroid(handler);
              context.beginPath();
              context.translate(pos[0], pos[1]);
              context.rotate(Physics.getAngle(handler));
              context.translate(-centroid[0], -centroid[1]);
              context.moveTo(objects.chains[i].vertices[chl][0], objects.chains[i].vertices[chl][1]);
              context.lineTo(objects.chains[i].vertices[chl+1][0], objects.chains[i].vertices[chl+1][1]);
              context.stroke();
              context.restore();
          }
      }
      context.restore();

      /* Drawing objects.tacks */
      context.strokeStyle = ColorManager.getColorAt(0);
      var tack_radius = (0.1) * Physics.getScale();
      if(!LevelManager.isVisible())
          tackFrameCount++;
      if(tackFrameCount > 10)
        tack_radius *= 1.3;
      if(tackFrameCount > 20)
        tackFrameCount = 0;

      for(var i = 0; i < objects.tacks.length; i++)
      {
          context.save();
          context.beginPath();
          var pos = calcTackAbsPos(i);
          context.translate(pos[0],pos[1]);
          context.arc(0, 0, tack_radius, 0, Math.PI * 2);
          context.globalAlpha = 1.0;
          context.stroke();
          context.restore();
      }

      /* Drawing level.hints (ghost mode) */
      var segments = 0.25 * Physics.getScale();
      lineDash = [segments, segments];

      var i, l = levelData.hints.length;
      for(var i = 0; i < l; i++)
      {
          context.save();
            context.translate(levelData.hints[i].position[0], levelData.hints[i].position[1]);
            context.beginPath();
            var j, l2 = levelData.hints[i].vertices.length;
            if(l2 > 1)
            {
                context.moveTo(levelData.hints[i].vertices[0][0], levelData.hints[i].vertices[0][1]);
                for(j = 0; j < l2; j++)
                {
                    context.lineTo(levelData.hints[i].vertices[j][0], levelData.hints[i].vertices[j][1]);
                }
                context.globalAlpha = levelData.hints[i].opacity;
                if(levelData.hints[i].line == "dotted")
                    context.setLineDash(lineDash);
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
          if(LevelManager.isVisible())
          {
              LevelManager.hide();
          }
          else
          {
              LevelManager.show();
          }
      }
      if(e.keyCode == 84) // T key
      {
          PlayerCursor.changeTool();
      }
  }

  function onMouseMove(e)
  {
      var pos = new Float32Array(2);
      pos[0] = e.clientX - canvasRect.left;
      pos[1] = e.clientY - canvasRect.top;
      moveTo(pos);
  }

  function onTouchEvent(e)
  {
      if(e.type == "touchstart")
      {
        drawingData.clear();
        skipFrames = true;
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
              lineTo([e.x, e.y]);
          }
      }
      else if(e.type == "touchend")
      {
          if(PlayerCursor.getCurrentToolName() == "ereaser")
          {
              erease();
          }
          if(PlayerCursor.getCurrentToolName() == "tack" || (drawingData.currentPolygon.length < 2))
          {
              if(e.button != 2)
              {
                  if(!drawingData.isLineToLocked)
                  {
                      tack();
                  }
                  drawingData.clear();
              }
          }
          else
          {
              closePath();
          }
          skipFrames = false;
      }
  }

  /** @func moveTo
    * @desc Moves the cursor (the chalk!)
    * @param pos {Float32Array} the new position
    */
  function moveTo(pos)
  {
      PlayerCursor.moveTo(pos);
  }

  /** @func lineTo
    * @desc Moves the cursor drawing a line (the chalk!)
    * @param pos {Float32Array} the new position
    */
  function lineTo(pos)
  {
      pos[0] += camera[0]
      pos[1] += camera[1];
      if(drawingData.isLineToLocked)
      {
          return;
      }
      if(PlayerCursor.getCurrentToolName() == "chalk")
      {
          var new_pos = pos.slice();
          if(drawingData.currentPolygon.length > 0){
            var old_pos = drawingData.currentPolygon[drawingData.currentPolygon.length - 1];
            var distance = Math.sqrt((new_pos[0] - old_pos[0]) * (new_pos[0] - old_pos[0]) + (new_pos[1] - old_pos[1]) * (new_pos[1] - old_pos[1]));
            if(distance < ConfigOptions.min_vertex_distance * Physics.getScale())
            {
              return; 
            }
          }
          if(drawingData.currentColorIndex == -1)
          {
            drawingData.currentColorIndex = ColorManager.getRandomColorIndex();
          }     
          drawingData.currentPolygon.push(new_pos);

          /* Fix for tacks-wire relation
           */
          var cur_pos = PlayerCursor.getPosition();
          var tack_index =  findTackAtPos(cur_pos, { filterConnectedTacks: true, returnIndex : true} );
          if(tack_index != undefined)
          {
              var shouldBePushed = true;
              for( var k = 0; k < candidateTacksForNewWire.length; k++)
              {
                if(candidateTacksForNewWire[k] == tack_index)
                {
                  shouldBePushed = false;
                  break;
                }
              }
              if(shouldBePushed)
              {
                  candidateTacksForNewWire.push(tack_index);
              }
          }
          /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

          if(drawingData.currentPolygon.length > 20)
          {
              var tail = drawingData.currentPolygon[drawingData.currentPolygon.length -1];
              var head = drawingData.currentPolygon[0];
              var vec = new Float32Array(2);
              vec[0] = tail[0] - head[0];
              vec[1] = tail[1] - head[1];
              distance = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
              if(distance < (Physics.getScale() * ConfigOptions.polygon_autoclose_distance))
              {
                  if(decomp.isSimple(drawingData.currentPolygon))
                  {
                      closePath(true);
                      drawingData.isLineToLocked = true;
                  }
              }
          }
      }
      moveTo(pos);
  }

  /** @func closePath
    * @desc create a body using the user's drawing (rocks, wires or chains)
    * @param forcePolygon {boolean} Prevent wires or chains
    */
  function closePath(forcePolygon)
  {
      var type = evalCurrentShape();

      if(type == "invalid")
      {
          drawingData.clear();
          return;
      }

      addCurrentDrawingToDirtyLayer();

      if(type == "polygon" || forcePolygon)
      {
          closeAsPolygon();
          candidateTacksForNewWire = [];
          return;
      }

      if(type == "wire")
      {
          closeAsWire();
          candidateTacksForNewWire = [];
          return;
      }
      if(type == "chain")
      {
          closeAsChain();
          candidateTacksForNewWire = [];
      }
  }

  /** @func evalCurrentShape
    * @desc evaluates the current shape and returns a string containing the recommended type of body, (polygon, chain or wire)
    */
  function evalCurrentShape()
  {
      var  l = drawingData.currentPolygon.length;
      if(l < ConfigOptions.min_vertices_per_polygon)
      {
          return "invalid";
      }

      var first_vertex = drawingData.currentPolygon[0];
      var last_vertex = drawingData.currentPolygon[l-1];
      decomp.removeCollinearPoints(drawingData.currentPolygon, 0.25);

      /* The first vertex must be restored */
      if(first_vertex[0] != drawingData.currentPolygon[0][0] || first_vertex[1] != drawingData.currentPolygon[0][1])
      {
          drawingData.currentPolygon.splice(0,0,first_vertex);
      }

      /* The last vertex must be restored */
      l = drawingData.currentPolygon.length;
      if(last_vertex[0] != drawingData.currentPolygon[l-1][0] || last_vertex[1] != drawingData.currentPolygon[l-1][1])
      {
          drawingData.currentPolygon.push(last_vertex);
      }

      var h2t_vector = new Float32Array(2);
      h2t_vector[0] = drawingData.currentPolygon[0][0] - drawingData.currentPolygon[drawingData.currentPolygon.length-1][0];
      h2t_vector[1] = drawingData.currentPolygon[0][1] - drawingData.currentPolygon[drawingData.currentPolygon.length-1][1];

      var h2t_distance = Math.sqrt(h2t_vector[0] * h2t_vector[0] + h2t_vector[1] * h2t_vector[1]);
      var h2t_angle = Math.atan( h2t_vector[1] / h2t_vector[0] );
      if(h2t_vector[0] < 0)
        h2t_angle += Math.PI;

      var tail_vector = new Float32Array(2);
      tail_vector[0] = drawingData.currentPolygon[drawingData.currentPolygon.length-1][0] - drawingData.currentPolygon[drawingData.currentPolygon.length-3][0];
      tail_vector[1] = drawingData.currentPolygon[drawingData.currentPolygon.length-1][1] - drawingData.currentPolygon[drawingData.currentPolygon.length-3][1];

      var tail_angle = Math.atan(tail_vector[1] / tail_vector[0] );
      if(tail_vector[0] < 0)
        tail_angle += Math.PI;

      if(Math.abs(tail_angle - h2t_angle) <= 0.7)
      {
          h2t_distance *= 0.5;
      }

      var distance_cond = h2t_distance > Physics.getScale() * ConfigOptions.polygon_autoclose_distance * 3;
      var insersection_cond = !decomp.isSimple(drawingData.currentPolygon);

      if(distance_cond || insersection_cond)
      {
          var searchOptions = { returnIndex : true, filterConnectedTacks : true };
          var indexA = findTackAtPos(drawingData.currentPolygon[0], searchOptions);
          var indexB = findTackAtPos(drawingData.currentPolygon[drawingData.currentPolygon.length - 1], searchOptions);
          if(distance_cond && indexA != undefined && indexB != undefined)
          {
              drawingData.candidateTackIndexA = indexA;
              drawingData.candidateTackIndexB = indexB;
              return "chain";
          }
          else
          {
              return "wire";
          }
      }

      return "polygon";
  }

  /** @func closeAsPolygon
    * @desc Creates a rock using the user's drawing
    */
  function closeAsPolygon()
  {
      var body = undefined;

      body = Physics.createBody({
          position : new Float32Array(2),
          vertices : drawingData.currentPolygon,
      });

      if(body == undefined) {
          drawingData.clear();
          return;
      };
      var group = null;
      var tack_indices = [];
      var i, l = objects.tacks.length;
      for(i = 0; i < l; i++)
      {
          if(objects.tacks[i].bodyB == null && !objects.tacks[i].deleted)
          {
              if(itsInsideOf(calcTackAbsPos(i), drawingData.currentPolygon ))
              {
                  tack_indices.push(i);
              }
          }
      }

      objects.shapes.push({
          body : body,
          type : "polygon",
          vertices : drawingData.currentPolygon,
          centroid: Physics.getCentroid(body),
          color_index : drawingData.currentColorIndex,
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
          onTackConnected(i);
      }
      drawingData.clear();
  }

  /** @func closeAsWire
    * @desc Creates a wire using the user's drawing
    */
  function closeAsWire()
  {
      var body = Physics.createWire({vertices:drawingData.currentPolygon});
      if(body == undefined)
      {
          drawingData.clear();
          return;
      }
      var tack_indices = [];
      var tack_indices = candidateTacksForNewWire;

      var i, l = objects.tacks.length;
      for(i = 0; i < l; i++)
      {
          if(objects.tacks[i].bodyB == null && !objects.tacks[i].deleted)
          {
              if(itsInsideOf(calcTackAbsPos(i), drawingData.currentPolygon ))
              {
                  tack_indices.push(i);
              }
          }
      }

      objects.shapes.push({
          body : body,
          type : "wire",
          vertices : drawingData.currentPolygon,
          centroid : Physics.getCentroid(body),
          color_index : drawingData.currentColorIndex,
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
      drawingData.clear();
  }

  /** @func closeAsChain
    * @desc Creates a chain using the user's drawing
    */
  function closeAsChain()
  {
      var groupA = collisionGroupCount++;
      var groupB = collisionGroupCount++;
      decomp.removeCollinearPoints(drawingData.currentPolygon, 0.3);
      drawingData.currentPolygon = Utils.normalizePolyLine(drawingData.currentPolygon, 0.3 * Physics.getScale());
      var chain = {
          vertices : drawingData.currentPolygon,
          chain_handler : [],
          chain_links   : [],
          tackAIndex    : -1,
          tackBIndex    : -1,
          label         :  "chainLink" + chainIdCount,
      };
      var  l = drawingData.currentPolygon.length;
      for(var i = 1; i < l; i++)
      {
          var chainLink = createChainLink(drawingData.currentPolygon[i-1], drawingData.currentPolygon[i]);
          chain.chain_handler.push(chainLink.body_handler);
          if(i == 1)
          {
              var contraint = Physics.createRevoluteJoint({
                  bodyA : objects.tacks[drawingData.candidateTackIndexA].bodyA,
                  pointA : objects.tacks[drawingData.candidateTackIndexA].offsetA,
                  bodyB : chain.chain_handler[chain.chain_handler.length - 1],
                  pointB : chainLink.point1,
              });

              /* collision group stuff */
              Physics.addCollisionGroup(objects.tacks[drawingData.candidateTackIndexA].bodyA, groupA);
              Physics.addCollisionGroup(chain.chain_handler[chain.chain_handler.length - 1], groupA);
              Physics.addCollisionGroup(chain.chain_handler[chain.chain_handler.length - 1], groupB);

              objects.tacks[drawingData.candidateTackIndexA].contraint = contraint;
              objects.tacks[drawingData.candidateTackIndexA].bodyB = chain.chain_handler[chain.chain_handler.length - 1];
          }
          else if(i == l-1)
          {
              var contraint = Physics.createRevoluteJoint({
                  bodyA : objects.tacks[drawingData.candidateTackIndexB].bodyA,
                  pointA : objects.tacks[drawingData.candidateTackIndexB].offsetA,
                  bodyB : chain.chain_handler[chain.chain_handler.length - 1],
                  pointB : chainLink.point2,
              });

              /* collision group stuff */
              Physics.addCollisionGroup(objects.tacks[drawingData.candidateTackIndexB].bodyA, groupB);
              Physics.addCollisionGroup(chain.chain_handler[chain.chain_handler.length - 1], groupA);
              Physics.addCollisionGroup(chain.chain_handler[chain.chain_handler.length - 1], groupB);

              objects.tacks[drawingData.candidateTackIndexB].contraint = contraint;
              objects.tacks[drawingData.candidateTackIndexB].bodyB = chain.chain_handler[chain.chain_handler.length - 1];
          }
          if(chain.chain_handler.length > 1)
          {
              Physics.createRevoluteJoint({
                  bodyA : chain.chain_handler[chain.chain_handler.length - 2],
                  pointA : chain.chain_links[chain.chain_links.length-1].point2,
                  bodyB : chain.chain_handler[chain.chain_handler.length - 1],
                  pointB : chainLink.point1,
              });

              /* collision group stuff */
              Physics.addCollisionGroup(chain.chain_handler[chain.chain_handler.length - 1], groupA);
              Physics.addCollisionGroup(chain.chain_handler[chain.chain_handler.length - 1], groupB);
          }
          chain.chain_links.push(chainLink);
      }
      chainIdCount++;
      chain.tackAIndex = drawingData.candidateTackIndexA;
      chain.tackBIndex = drawingData.candidateTackIndexB;
      objects.chains.push(chain);
      drawingData.clear();
  }

  function addCurrentDrawingToDirtyLayer()
  {
      DirtyLayer.addShape({
          vertices : drawingData.currentPolygon,
          position : [0, 0],
          angle : 0,
          centroid : [0, 0],
          type : "wire",
      });
  }

  function createChainLink(pointA, pointB)
  {
      var shape = Utils.rectFromPoints(pointA, pointB, 0.08 * Physics.getScale());
      var centroid = [ (shape[0][0] + shape[1][0] + shape[2][0] + shape[3][0])/4,
                       (shape[0][1] + shape[1][1] + shape[2][1] + shape[3][1])/4 ];
      var point1 = [ pointA[0] - centroid[0], pointA[1] - centroid[1] ];
      var point2 = [ pointB[0] - centroid[0], pointB[1] - centroid[1] ];
      var body_handler = Physics.createBody({
          label    : "chainLink" + chainIdCount,
          vertices : shape,
          massScale : 5,
      });
      
      return {
          body_handler : body_handler,
          point1 : point1,
          point2 : point2,
      };
  }

  /** @func tack
    * @desc Creates a tack at the cursor position
    */
  function tack()
  {
      var cur_pos = PlayerCursor.getPosition();

      var tack = {
          bodyA     : null,
          offsetA   : null,
          bodyB     : null,
          offsetB   : null,
          contraint : null,
          tack_id   : tackIdCount++,
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
          return;
      }

      tack.offsetA = calcTackOffset(cur_pos, tack.bodyA);
      objects.tacks.push(tack);
      onTackAdded();
  }

  /** @func erease
    * @desc Deletes a body or a tack at the cursor position
    */
  function erease()
  {
      var cur_pos = PlayerCursor.getPosition();
      var tack_index =  findTackAtPos(cur_pos, { returnIndex : true} );
      if(tack_index != undefined && !objects.tacks[tack_index].indelible)
      {
          var tack = objects.tacks[tack_index];
          if(objects.tacks[tack_index].contraint != null)
          {
              Physics.removeConstraint(objects.tacks[tack_index].contraint);
          }
          objects.tacks[tack_index].contraint = null;
          onTackRemoved(tack_index);
          objects.tacks.splice(tack_index,1);
          drawingData.clear();
          return;
      }

      // si no se encuentra tack, eliminar una figura que se encuentre bajo el cursor
      var _bodies = Physics.getBodiesAtPoint(cur_pos);

      l = _bodies.length;
      for(i = 0; i < l; i++)
      {
          var label = Physics.getLabel(_bodies[i]);
          if( Physics.isSensor(_bodies[i]) || (label != "Body" && label.indexOf("chainLink") != 0) )
              continue;
          if(label.indexOf("chainLink") == 0)
          {
              onChainLinkDeleted(label);
          }
          else
          {
              removeBody(_bodies[i]);
              onDrawingDeleted();
          }
          break;
      }
      drawingData.clear();
  }

  function onChainLinkDeleted(label)
  {
      // Buscamos los tacks conectados a esta cadena
      var i, founds = 0;
      for(i = objects.tacks.length-1; i >= 0 && founds < 2; i--)
      {
          if(Physics.getLabel(objects.tacks[i].bodyA) == label)
          {
              founds++;
              Physics.removeConstraint(objects.tacks[i].contraint);
              objects.tacks.splice(i,1);
          }
          if(objects.tacks[i].bodyB && Physics.getLabel(objects.tacks[i].bodyB) == label)
          {
              founds++;
              Physics.removeConstraint(objects.tacks[i].contraint);
              objects.tacks.splice(i,1);
          }          
      }

      var bodies = Physics.getAllBodies();
      for(i = bodies.length-1; i >= 0; i--)
      {
          if(Physics.getLabel(bodies[i]) == label)
          {
              removeBody(bodies[i]);
          }
      }

      for(i = objects.chains.length-1; i >= 0; i--)
      {
          if(objects.chains[i].label == label)
          {
              objects.chains.splice(i,1);
              break;
          }
      }
  }

  /** @func findTacksAtPos
    * @desc Returns an array containing the found tacks at "pos"
    */
  function findTackAtPos(pos,  options)
  {
      options = options || {};
      options.returnIndex = options.returnIndex || false;
      options.filterConnectedTacks = options.filterConnectedTacks || false;

      var tack_radio = 0.4 * Physics.getScale();
      var i, l = objects.tacks.length;
      for(i = 0 ; i < l; i ++)
      {
          if(!objects.tacks[i].deleted)// && !objects.tacks[i].indelible)
          {
              if( !options.filterConnectedTacks  || objects.tacks[i].contraint == null )
              {
                  var tack_pos = calcTackAbsPos(i)
                  var diff_x = pos[0] - tack_pos[0];
                  var diff_y = pos[1] - tack_pos[1];
                  var distance = Math.sqrt((diff_x * diff_x) + (diff_y * diff_y));
                  if(distance < tack_radio)
                  {
                      if(options.returnIndex)
                      {
                          return i;
                      }
                      else
                      {
                          return objects.tacks[i];
                      }
                  }
              }
          }
      }
      return undefined;
  }

  /** @func removeBody
    * @desc removes a body from the world
    * @param body {object} the body_handler to be deleted
    */
  function removeBody(body)
  {
      if((body.label != "Body" && body.label.indexOf("chainLink") != 0))
        return;
      Physics.removeBody(body);
      removeTacksConnectedTo(body.id);

      if(body.label.indexOf("chainLink") == 0)
          return;

      for(i = objects.shapes.length-1; i >= 0; i--)
      {
          if(body == objects.shapes[i].body)
          {
              objects.shapes[i].fill = true;
              objects.shapes[i].position = Physics.getPosition(objects.shapes[i].body);
              objects.shapes[i].angle = Physics.getAngle(objects.shapes[i].body);
              DirtyLayer.addShape(objects.shapes[i]);
              objects.shapes.splice(i,1);
              return;
          }
      }      
  }

  function calcTackAbsPos(index)
  {
      var tack = objects.tacks[index];
      var body_pos = Physics.getPosition(tack.bodyA);
      var scaled_offsetA = tack.offsetA;
      var r = Physics.getAngle(tack.bodyA);
      var x = scaled_offsetA[0];
      var y = scaled_offsetA[1];
      var cos_r = Math.cos(r);
      var sin_r = Math.sin(r);
      return [ (x  * cos_r) - (y * sin_r) + body_pos[0] ,
               (y * cos_r) + (x * sin_r) + body_pos[1] ];
  }

  function calcTackOffset(pos, body)
  {
      var body_pos = Physics.getPosition(body);
      var x = pos[0] - body_pos[0];
      var y = pos[1] - body_pos[1];
      var angle = -Physics.getAngle(body);

      // 2D Rotation 
      var offset = new Float32Array(2);
      offset[0] = (x  * Math.cos(angle)) - (y * Math.sin(angle));
      offset[1] = (y * Math.cos(angle)) + (x * Math.sin(angle));
      return offset;
  }

  /** @func removeTacksConnectedTo
    * @desc removes all the tacks connected to a body
    * @param body_id {Number} the body_id to be cleaned
    */
  function removeTacksConnectedTo(body_id)
  {
      for(var i = objects.tacks.length-1; i >= 0 && i < objects.tacks.length; i--)
      {
          if( Physics.getId(objects.tacks[i].bodyA) == body_id)
          {
               if(objects.tacks[i].contraint != null)
               {
                   Physics.removeConstraint(objects.tacks[i].contraint);
               }
               objects.tacks[i].contraint = null;
               objects.tacks[i].bodyB = null;
               if(!objects.tacks[i].indelible)
               {
                   onTackRemoved(i);
                   objects.tacks.splice(i,1);
               }
          }
          else if(objects.tacks[i].bodyB != null &&  Physics.getId(objects.tacks[i].bodyB) ==  body_id)
          {
               Physics.removeConstraint(objects.tacks[i].contraint);
               objects.tacks[i].contraint = null;
               objects.tacks[i].bodyB = null;
               if(!objects.tacks[i].indelible)
               {
                   onTackRemoved(i);
                   objects.tacks.splice(i,1);
               }
          }
      }
  }

  /** @func changeTool
    * @desc Selects the next tool (chalk, ereaser or tack)
    */
  function changeTool()
  {
      PlayerCursor.changeTool();
  }

  /** @func loadLevel
    * @desc Loads and starts a level
    * @param level_index {Number} The level to be loaded
    */
  function loadLevel(level_index)
  {
      restartEngine();
      levelData.earnedStars = 0;
      levelData.context = {};
      levelData.id = level_index;
      var level = LevelManager.getLevels()[level_index];
      levelData.updateFnc = level.update;
      var _bodies = [];
      level.hints = level.hints || [];
      level.tacks = level.tacks || [];
      level.decorations = level.decorations || [];
      levelData.hints = [];
      levelData.decorations = [];
      levelData.tacks = [];
      for(var i = 0; i < level.hints.length;i++)
      {
          levelData.hints.push(prepareLevelShapes(level.hints[i], "hint"));
      }
      for(var i = 0; i < level.decorations.length;i++)
      {
          levelData.decorations.push(prepareLevelShapes(level.decorations[i], "decoration"));
      }
      for(var i = 0; i < level.tacks.length;i++)
      {
          levelData.tacks.push(prepareLevelShapes(level.tacks[i]));
      }
      for(var i = 0; i < level.bodies.length; i++)
      {
          var type = level.bodies[i].type == "circle" ? "circle" : "polygon";
          var scaledBody = prepareLevelShapes(level.bodies[i]);
          if(type == "polygon")
          {
              var body = Physics.createBody({
                  position : scaledBody.position,
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
              var body = Physics.createCircle({
                  position : scaledBody.position,
                  radio    : scaledBody.radio,
                  label    : level.bodies[i].label,
                  isStatic : level.bodies[i].isStatic,
                  friction : 0.5,
              });
              var centroid = new Float32Array(2);
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
          if(level.bodies[i].respawn)
          {
              levelData.respawnableBodies.push(body);
              levelData.spawners.push(Physics.getPosition(body));
          }
          _bodies.push(body);
      }

      for(var i = 0; i < levelData.tacks.length; i++)
      {
          /* Create level tacks */
          var bodyA = Physics.getBodyByLabel(levelData.tacks[i].bodyA);
          var bodyB = Physics.getBodyByLabel(levelData.tacks[i].bodyB);
          var pos = levelData.tacks[i].position;
          var tack = {
              bodyA     : bodyA,
              offsetA   : calcTackOffset(pos, bodyA),
              bodyB     : bodyB,
              offsetB   : bodyB ? calcTackOffset(pos, bodyB) : null,
              contraint : null,
              indelible  : true,
          };
          if(bodyB)
          {
              tack.contraint = Physics.createRevoluteJoint({
                  bodyA  : tack.bodyA,
                  pointA : tack.offsetA,
                  bodyB  : tack.bodyB,
                  pointB : tack.offsetB,
              });
          }
          objects.tacks.push(tack);
      }

      levelData.title       = level.title;
      levelData.descriptions = level.descriptions;
      levelData.setupFnc   = level.setup;
      levelData.show_timer       = level.show_timer;

      /* Draw level decorations on the dirty layer
       */
      DirtyLayer.adjustToViewPort();
      for(var i = 0; i < levelData.decorations.length; i++)
      {
          DirtyLayer.addShape({
              position : levelData.decorations[i].position,
              vertices : levelData.decorations[i].vertices,
              centroid : [0,0],
              angle    : 0,
              type     : "wire",
              opacity  : levelData.decorations[i].opacity,
          });
      }

      Screen.setSubtitleText(level.descriptions[0]);
      //Screen.setTitleText(level.title);
      Screen.setTitleText("");
      if(levelData.setupFnc != undefined)
          levelData.setupFnc(levelData.context);
      levelData.startTime = new Date().getTime();

      if(levelData.show_timer)
      {
          document.querySelector("#hud-timer-text").style.opacity = 1;
          document.querySelector("#hud-timer-icon").style.opacity = 1;
      }
      else
      {
          document.querySelector("#hud-timer-text").style.opacity = 0;
          document.querySelector("#hud-timer-icon").style.opacity = 0;
      }

      var bitflag = LevelManager.getLevelStars(level_index);
      var starElems = document.querySelectorAll(".hud-star-icon");

      starElems[0].dataset.filled = (bitflag & THIRD_STAR) ? "true" : "false";
      starElems[1].dataset.filled = (bitflag & SECOND_STAR) ? "true" : "false";
      starElems[2].dataset.filled = (bitflag & FIRST_STAR) ? "true" : "false";

      levelData.drawnObjectsCount = 0;
      hudTimerTextElem.innerHTML = "00:00";
      document.querySelector(".hud-timer-hand").dataset.rotate = "false";
      Physics.on("addBody", function(){
          ChalkProgressBar.setValue(0.8);
          levelData.drawnObjectsCount++;
          if(levelData.drawnObjectsCount == 1)
          {
              levelData.startTime = new Date().getTime();
              document.querySelector(".hud-timer-hand").dataset.rotate = "true";
          }
      });
      ChalkProgressBar.setValue(1.0);
  }

  /** @func restartLevel
    * @desc Restarts the current level
    */
  function restartLevel()
  {
      loadLevel(levelData.id);
  }

  /** @func itsInsideOf
    * @desc This is a geofence algo http://alienryderflex.com/polygon/Diagram_1.gif
    */
  function itsInsideOf(pos, polygon)
  {
      var sides = polygon.length - 1;
      var j = sides - 1;
      var pointStatus = false;
      for (var i = 0; i < sides; i++)
      {
          if (polygon[i][1] < pos[1] && polygon[j][1] >= pos[1] || polygon[j][1] < pos[1] && polygon[i][1] >= pos[1])
          {
              if (polygon[i][0] + (pos[1] - polygon[i][1]) /  (polygon[j][1] - polygon[i][1]) * (polygon[j][0] - polygon[i][0]) < pos[0])
              {
                  pointStatus = !pointStatus ;                        
              }
          }
          j = i;
      }
      return pointStatus;
  }

  /** @func prepareLevelShapes
    * @desc Takes objects from p2.js space to canvas space
    */
  function prepareLevelShapes(const_shape, type)
  {
      /* Fixme: improve this coping technique */
      var shape = JSON.parse(JSON.stringify(const_shape));
      
      shape.position[0] *= Physics.getScale();
      shape.position[1] *= Physics.getScale();

      shape.position[1] = -shape.position[1];
      //shape.position[0] += Screen.getWidth()>>1;
      //shape.position[1] += Screen.getHeight();
      if(shape.vertices)
      {
          var v, l = shape.vertices.length;
          for(v = 0; v < l; v++)
          {
              shape.vertices[v][0] *= Physics.getScale();
              shape.vertices[v][1] *= Physics.getScale();

              shape.vertices[v][1] = -shape.vertices[v][1];
          }
      }
      if(shape.radio)
      {
          shape.radio *= Physics.getScale();
      }
      
      if(type == "hint" || type == "decoration")
      {
          if(shape.opacity != 0.0)
              shape.opacity = shape.opacity || 0.5;
      }

      if(type == "hint")
      {
          shape.line = shape.line || "dotted";
      }
      
      return shape;
  }
  
  /** @func getHints
    * @desc returns the hints array from the current level
    */
  function getHints()
  {
      return levelData.hints;
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
               callbacks[i]();
          }
      }
  }

  function onDrawingDeleted()
  {
      var callbacks = listeners["deleteDrawing"];
      if(callbacks)
      {
          for(var i = 0; i < callbacks.length; i++)
          {
               callbacks[i]();
          }
      }
  }

  function onTackConnected(index)
  {
      var callbacks = listeners["connectTack"];
      if(callbacks)
      {
          for(var i = 0; i < callbacks.length; i++)
          {
               callbacks[i](index);
          }
      }
  }

  function onTackRemoved(index)
  {
      var callbacks = listeners["removeTack"];
      if(callbacks)
      {
          for(var i = 0; i < callbacks.length; i++)
          {
               callbacks[i](index);
          }
      }
      var label = Physics.getLabel(objects.tacks[index].bodyA);
      if(label.indexOf("chain") == 0 )
      {
          onChainLinkDeleted(label);
      }
      if(objects.tacks[index].bodyB)
      {
          var label = Physics.getLabel(objects.tacks[index].bodyB);
          if(label.indexOf("chain") == 0 )
          {
              onChainLinkDeleted(label);
          }
      }
  }
  
  function adjustToViewPort()
  {
     camera[0] = -Screen.getWidth()>>1;
     camera[1] = -Screen.getHeight();
  }
  
  function getCamera()
  {
      return camera;
  }

  function setFonts(title, subtitle)
  {
      document.querySelector("#title_label").style.fontFamily = "chalk" + title;
      document.querySelector("#subtitle_label").style.fontFamily = "chalk" + subtitle;
  }

  function getElapsedTime_str()
  {
      var elapsedTime = new Date().getTime() - levelData.startTime;
      var elapsedSeconds = elapsedTime / 1000;
      var minutes = parseInt(elapsedSeconds / 60);
      var seconds = parseInt(elapsedSeconds % 60);
      if(minutes < 9) minutes = "0" + minutes;
      if(seconds < 9) seconds = "0" + seconds;
      return minutes + ":" + seconds;
  }

  function getTime()
  {
      return (new Date().getTime() - levelData.startTime)/1000;
  }

  function getDrawnObjectsCount()
  {
      return levelData.drawnObjectsCount;
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
            adjustToViewPort : adjustToViewPort,
            getCamera        : getCamera,
            getTime          : getTime,
            setFonts         : setFonts,
            getDrawnObjectsCount : getDrawnObjectsCount,
            showTooltip          : showTooltip,
            hideTooltip          : hideTooltip, };
})();