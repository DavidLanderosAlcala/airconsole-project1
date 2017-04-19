        var LevelSelector = (function(){

         var levels = [];
         var menu_container = null;
         var title          = null;
         var subtitle       = null;
         var header         = null;
         var body           = null;
         var footer         = null;
         var left_arrow     = null;
         var right_arrow    = null;
         var scrollpos      = 0;
         var buttons_count  = 0;
         var listeners = [];
         var visible = false;

         function init()
         {
            var content =  "<div class='chalk-menu-container'>" +
                           "    <div class='chalk-menu-row'>" +
                           "         <label class='chalk-menu-title'> Draw something </label>" +
                           "         <label class='chalk-menu-subtitle'>level 1</label>" +
                           "    </div>" +
                           "    <div class='chalk-menu-row'>";
            for(var i = 0 ; i < levels.length; i++)
            {
                content += "<div onmouseover='LevelSelector.dispatch(\"preview\"," + i + ")'" +
                           "onclick='LevelSelector.dispatch(\"selected\"," + i + ")' class='chalk-level-button'>" + (i+1) + "</div>";
            }
            content +=     "    </div>" +
                           "    <div class='chalk-menu-row'>" +
                           "        <div class='chalk-arrow-button'></div>" +
                           "        <div class='chalk-arrow-button'></div>" +
                           "    </div>" +
                           "</div>";
             document.querySelector(".chalk-menu-layer").innerHTML = content;
             menu_container = document.querySelector(".chalk-menu-container");
             title          = document.querySelector(".chalk-menu-title");
             subtitle       = document.querySelector(".chalk-menu-subtitle");
             header         = document.querySelector("div.chalk-menu-row:nth-child(1)");
             body           = document.querySelector("div.chalk-menu-row:nth-child(2)");
             footer         = document.querySelector("div.chalk-menu-row:nth-child(3)");
             left_arrow     = document.querySelector("div.chalk-arrow-button:nth-child(1)");
             right_arrow    = document.querySelector("div.chalk-arrow-button:nth-child(2)");
             window.addEventListener("resize", resize);
             left_arrow.addEventListener("click", function(e){
                 e.preventDefault();
                 rect = body.getBoundingClientRect();
                 var button_height = rect.height * 0.4;
                 scrollpos += button_height * 4;
                 if(scrollpos > 0)
                     scrollpos = 0;
                 body.style.marginLeft = scrollpos + "px";            
             });
             right_arrow.addEventListener("click", function(e){
                 e.preventDefault();
                 rect = body.getBoundingClientRect();
                 var button_height = rect.height * 0.4;
                 scrollpos -= button_height * 4;
                 var width_and_margin = button_height * 1.3;
                 if(scrollpos < -width_and_margin * buttons_count)
                     scrollpos = -width_and_margin * buttons_count;
                 body.style.marginLeft = scrollpos + "px";
             });

             on("preview", function(level_index){
                 title.innerHTML = levels[level_index].title;
                 subtitle.innerHTML = "Level " + (level_index + 1);
             });

             on("selected", function(level_index){
                hide();
                Game.loadLevel(level_index);
             });

             resize();
             title.innerHTML = levels[0].title;
             subtitle.innerHTML = "Level 1";
         }

        function resize()
        {
            /* adjust container */
            var rect = menu_container.getBoundingClientRect();
            var height = (rect.width / 1.7);
            menu_container.style.height = height + "px";
            menu_container.style.top = ((window.innerHeight>>1) - (height>>1)) + "px";

            /* adjust header */
            rect = header.getBoundingClientRect();
            title.style.fontSize = ((rect.height * 0.2)|0) + "px";
            title.style.lineHeight = ((rect.height * 0.3)|0) + "px";
            subtitle.style.fontSize = ((rect.height * 0.1)|0) + "px";
            subtitle.style.lineHeight = ((rect.height * 0.55)|0) + "px";

            /* adjust body */
            rect = body.getBoundingClientRect();
            var button_height = rect.height * 0.6;
            var buttons = document.querySelectorAll(".chalk-level-button");
            buttons_count = buttons.length;
            for(var i = 0; i < buttons_count; i++)
            {
                buttons[i].style.height = button_height + "px";
                buttons[i].style.lineHeight = (button_height*1.6) + "px";
                buttons[i].style.fontSize = title.style.fontSize;
                buttons[i].style.width = button_height + "px";
                buttons[i].style.marginLeft = (button_height*0.3) + "px";
                buttons[i].style.top = (rect.height>>1) - (button_height>>1) + "px";
            }

            /* adjust footer */
            rect = footer.getBoundingClientRect();
            footer.style.lineHeight = rect.height + "px";
        }

        function getLevels()
        {
            return levels;
        }

        function show()
        {
            visible = true;
            document.querySelector(".chalk-menu-layer").style.zIndex = 10;
        }

        function hide()
        {
            visible = false;
            document.querySelector(".chalk-menu-layer").style.zIndex = -10;
        }

        function isVisible()
        {
            return visible;
        }

        function on(type, callback)
        {
            if(!listeners[type])
            {
                listeners[type] = [];
            }
            listeners[type].push(callback);
        }

        function dispatch(event, arg)
        {
            if(listeners[event])
            {
                for(var i = 0; i < listeners[event].length; i++)
                {
                    listeners[event][i](arg);
                }
            }
        }

        return { init      : init,
                 getLevels : getLevels,
                 on        : on,
                 show      : show,
                 hide      : hide,
                 dispatch  : dispatch };

        })();
