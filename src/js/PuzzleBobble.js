

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                           PB NAMESPACE
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var PB = (function() {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //                           ITEM CLASS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    function Item( sprite, x, y, velocidadx, velocidady, ttl, gravedad)
    {
        this.sprite     = sprite;
        this.x          = x;
        this.y          = y;
        this.velocidadx = velocidadx;
        this.velocidady = velocidady;
        this.ttl        = ttl;
        this.gravedad   = gravedad;
    }
    
    Item.prototype.tick = function()
    {
        this.x += this.velocidadx;
        this.y += this.velocidady;
        this.velocidady += this.gravedad;
        if(this.ttl > 0) this.ttl--;
        return this.ttl;
    }
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //                           SPRITE CLASS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    function Sprite(archivo, longitud , puntoRetorno)
    {
        this.imagenes = new Array(longitud);
        for(var i = 0; i < longitud; i++)
        {
            this.imagenes[i] = new Image();
            this.imagenes[i].src= archivo+i +".png";
        }
    
        this.puntoRetorno = puntoRetorno;
        this.index = 0;
        this.longitud = longitud;
    
        this.timer = 0;
    }
    
    Sprite.prototype.siguienteImagen = function()
    {
        this.timer++;
        if(this.timer == 3)
        {
            this.timer = 0;
            this.index++;
            if(this.index == this.longitud) this.index = this.puntoRetorno;
        }
        return this.imagenes[this.index];
    }
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //                           PELOTA CLASS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    var RADIO = 10;
    var X_INICIAL = 50;
    var Y_INICIAL = 190;
    
    function Pelota(velocidadx, velocidady, color)
    {
        this.x = X_INICIAL;
        this.y = Y_INICIAL;
        this.color = color;
        this.velocidadx = velocidadx;
        this.velocidady = velocidady;
    }
    
    Pelota.prototype.getPunto = function()
    {
        return {x: this.x, y: this.y};
    }

    return { Pelota : Pelota,
             Sprite : Sprite,
             Item   : Item,
             RADIO  : RADIO };

})();



var PuzzleBobble = (function(){

     var cara_sebas = new Image();
     cara_sebas.src='./res/img/cara_sebas.png';
     var flecha = new Image();
     flecha.src = './res/img/flecha.png';
     var cara_grillo = new Image();
     cara_grillo.src='./res/img/cara_grillo.png';
     var tema = new Audio();
     tema.src = "./res/sounds/tema.mp3";
     tema.volume = 0.3;
     tema.loop = true;
     var sprites = new Array(4);
     var efectos = new Array();
     // colores de las pelotas
     sprites[0] = new PB.Sprite('./res/img/yellow',1,0);
     sprites[1] = new PB.Sprite('./res/img/red',1,0);
     sprites[2] = new PB.Sprite('./res/img/blue',1,0);
     sprites[3] = new PB.Sprite('./res/img/green',1,0);
     sprites[4] = new PB.Sprite('./res/img/purple',1,0);
     // efectos especiales
     sprites[5] = new PB.Sprite('./res/img/destello',5,0);
     var r = 0;
     var tablero = Matrix(5,13);
     var canvas;
     var contexto;
     var canvas2;
     var contexto2;
     var pelota;
     var angulo = 90;
     var fuerza = 5;
     var direccion = 0;
     var hilo;
     var primer_color = siguienteColor();
     var segundo_color = siguienteColor();
     var contador_relleno = 0;
     var contador_relleno2 = 0;
     var segundos = 100;
     var puntos = 0;
     var ha_ganado = false;
     var ha_perdido = false;
     var timer;

    function init(canvas_selector1, canvas_selector2)
    {
        canvas = document.querySelector(canvas_selector1);
        contexto = canvas.getContext('2d');
        canvas2 = document.querySelector(canvas_selector2);
        contexto2 = canvas2.getContext('2d');
        window.addEventListener("keydown",_keydown);
        window.addEventListener("keyup", _keyup);
        contexto.font = '50px Impact';
        contexto.fillStyle = 'white';
        contexto.textAlign = 'center';
        contexto.fillText('Puzzle Bobble', 150, 100);
        contexto.font = '25px helvetica';
        contexto.fillText('Utiliza las flechas para', 150, 200);
        contexto.fillText('para dar direccion a la', 150, 225);
        contexto.fillText('pelota, y la tecla space', 150, 250);
        contexto.fillText('para disparar', 150, 275);
        contexto.fillText('Presiona Enter', 150, 500);
        contexto.fillText('para iniciar', 150, 525);
        cara_sebas.onload = function(){
        	contexto.drawImage(cara_sebas, 50,350,80,100);
        }
        cara_grillo.onload = function(){
        	contexto.drawImage(cara_grillo, 170,340,80,120);
        }
    }

    function start()
    {
         cargar_nivel1();
         tema.play();
         hilo = setInterval(game_loop,10);
         timer = setInterval(tick,1000);
    }

    function tick()
    {
        segundos--;
        if(segundos == 0)
        {
            clearInterval(timer);
            clearInterval(hilo);
            render();
            tema.pause();
            contexto.fillStyle = "black";
            contexto.globalAlpha = 0.5;
            contexto.fillRect(0,0,300,600);
            contexto2.fillStyle = "black";
            contexto2.globalAlpha = 0.5;
            contexto2.fillRect(0,0,300,600);
            contexto.globalAlpha = 1;
            contexto.fillStyle = "white";
            contexto.textAlign = 'center';
            contexto.font = '50px impact';
            contexto.fillText("Game over", 150, 300);
            contexto.font = '30px helvetica';
            contexto.fillText("Tiempo agotado", 150, 350);
        }
    }

    function pantalla_perdedora()
    {
        clearInterval(timer);
        clearInterval(hilo);
        tema.pause();
        contexto.fillStyle = "black";
        contexto.globalAlpha = 0.5;
        contexto.fillRect(0,0,300,600);
        contexto2.fillStyle = "black";
        contexto2.globalAlpha = 0.5;
        contexto2.fillRect(0,0,300,600);
        contexto.globalAlpha = 1;
        contexto.fillStyle = "white";
        contexto.textAlign = 'center';
        contexto.font = '50px impact';
        contexto.fillText("¡Perdiste!", 150, 300);
        contexto.font = '30px helvetica';
        contexto.fillText("puntos", 150, 350);
        contexto.font = '50px Impact';
        contexto.fillText(puntos, 150, 400);
    }

    function pantalla_ganadora()
    {
        contexto.save();
        contexto2.save();
        contexto.fillStyle = "black";
        contexto.globalAlpha = 0.5;
        contexto.fillRect(0,0,300,600);
        contexto2.fillStyle = "black";
        contexto2.globalAlpha = 0.5;
        contexto2.fillRect(0,0,300,600);
        contexto.globalAlpha = 1;
        contexto.fillStyle = "white";
        contexto.textAlign = 'center';
        contexto.font = '50px impact';
        contexto.fillText("¡Ganaste!", 150, 300);
        contexto.font = '30px helvetica';
        contexto.fillText("puntos", 150, 350);
        contexto.font = '50px Impact';
        contexto.fillText(puntos, 150, 400);
        contexto.restore();
        contexto2.restore();
    }

    function cargar_nivel1()
    {
        var nivel1 =
        [
            [1,1,1,1,1],
            [2,3,2,3,0],
            [0,0,4,0,0],
            [2,3,2,3,0],
            [0,1,4,1,0]
        ];
        for(var i = 0; i < 5; i++)
        for(var j = 0; j < 5; j++)
        {
            if( j % 2 == 0 || i != 4)
                tablero[i][j].ocupado = true;
            tablero[i][j].color = nivel1[j][i];
        }
    }

    function game_loop()
    {
        angulo += direccion;
        if(angulo < 10) angulo = 10;
        else if(angulo > 170) angulo = 170;
        if(pelota != undefined)
        {
            pelota.x += pelota.velocidadx;
            pelota.y += pelota.velocidady;
            if(pelota.x < PB.RADIO)
            {
                pelota.x = PB.RADIO;
                pelota.velocidadx = -pelota.velocidadx;
            }
            else if(pelota.x > 100 - PB.RADIO)
            {
                pelota.x = 100-PB.RADIO;
                pelota.velocidadx = -pelota.velocidadx;
            }
            if(pelota.y < PB.RADIO)
            {
                var punto = pixelToCell(pelota.x,pelota.y);
                tablero[punto.x][punto.y].ocupado = true;
                tablero[punto.x][punto.y].color = pelota.color;
                pelota.y = PB.RADIO;
                algoritmo_relleno(punto.x, punto.y, pelota.color);
                   var sonido = new Audio();
                   sonido.src = "./res/sounds/bubble.mp3";
                   sonido.play();
                if(contador_relleno >= 3)
                    borrar_pelotas();
                else
                    efectos.push(new PB.Item(5, punto.x*20 ,punto.y*15, 0, 0, 15,0));
                limpiar_relleno();
                pelota = undefined;
            }
            else colision();
        }
        for(var i = 0; i < 5; i++)if( tablero[i][11].ocupado) ha_perdido = true;
        render();
    }

    function colision()
    {
        var aux_x = pelota.x + pelota.velocidadx;
        var aux_y = pelota.y + pelota.velocidady;
        var punto = pixelToCell(aux_x, aux_y);
        if(tablero[punto.x][punto.y].ocupado)
        {
            punto = pixelToCell(pelota.x, pelota.y);
            tablero[punto.x][punto.y].ocupado = true;
            tablero[punto.x][punto.y].color = pelota.color;
            algoritmo_relleno(punto.x, punto.y, pelota.color);
                   var tema = new Audio();
                   tema.src = "./res/sounds/bubble.mp3";
                   tema.play();
            if(contador_relleno >= 3)
                borrar_pelotas();
            else
                efectos.push(new PB.Item(5, punto.x*20 ,punto.y*15, 0, 0, 15,0));
            limpiar_relleno();
            pelota = undefined;
            return true;
        }
    }

    function pixelToCell(_x,_y)
    {
        _y -= PB.RADIO;
        var eje_y = parseInt(_y/14);
        if(eje_y % 2  != 0) _x -= PB.RADIO;
        var eje_x = parseInt(_x/20);
        if(eje_x < 0) eje_x = 0;
        if((eje_y % 2 == 0) && eje_x > 4) eje_x = 4;
        if((eje_y % 2 != 0) && eje_x > 3) eje_x = 3;
        if(eje_y < 0) eje_y = 0;
        if(eje_y > 12) eje_y = 12;
        if(eje_x == 13) alert("wtf");
        return { 
                   x: eje_x,
                   y: eje_y
               };
    }

    function mostrarEfectosEspeciales()
    {
        for(var i = 0; i < efectos.length; i++)
        {
           if(efectos[i].tick() != 0)
           {
               if(efectos[i].sprite == 5)
               {
                   var y_aux = parseInt(efectos[i].y / 14);
                   if(y_aux % 2 == 0)
                       contexto.drawImage(sprites[efectos[i].sprite].siguienteImagen(),efectos[i].x+1,efectos[i].y+1,18,18);
                   else
                       contexto.drawImage(sprites[efectos[i].sprite].siguienteImagen(),efectos[i].x + PB.RADIO+1,efectos[i].y+1,18,18);
               }
               else
               {
                   contexto.drawImage(sprites[efectos[i].sprite].siguienteImagen(),efectos[i].x+1,efectos[i].y+1,18,18);
               }
           }
        }
    }

    function render()
    {
        canvas.width = canvas.width;
        canvas2.width = canvas2.width;
        contexto.save();
        contexto.scale(3,3);
        //contexto.translate(25,50);
        mostrar_malla();
        for(var i = 0; i < 5; i++)
        for(var j = 0; j < 13; j++)
        {
             if(tablero[i][j].ocupado)
             {
                 if(j % 2 == 0)
                     contexto.drawImage(sprites[tablero[i][j].color].siguienteImagen(),((i)*20) + 1 ,((j)*15)+1,18,18);
                 else if(i < 4)
                     contexto.drawImage(sprites[tablero[i][j].color].siguienteImagen(),((i)*20) + 1 + (PB.RADIO),((j)*15)+1,18,18);
             }
        }
        if(pelota != undefined)
        {
            contexto.drawImage(sprites[pelota.color].siguienteImagen(),pelota.x - PB.RADIO, pelota.y - PB.RADIO,18,18);
        }
        // mostrar las siguientes pelotas
        contexto2.drawImage(sprites[primer_color].siguienteImagen(),135,450,36,36);
        contexto2.drawImage(sprites[segundo_color].siguienteImagen(),10,450,36,36);
        contexto.save();
        contexto.translate(50,190);
        contexto.rotate(- angulo * Math.PI / 180);
        contexto.drawImage(flecha,-10,-12.5,50,25);
        contexto.restore();
        contexto2.save();
        contexto2.translate(150,40);
        contexto2.textAlign="center"; 
        contexto2.font = "30px Impact";
        contexto2.fillStyle = 'white';
        contexto2.fillText("Time " + segundos + "          Score " + puntos,0,0);
        contexto2.translate(55,0);
        contexto2.restore();
        mostrarEfectosEspeciales();
        contexto.restore();
        if(ha_ganado) pantalla_ganadora();
        else if(ha_perdido) pantalla_perdedora();
    }

    function mostrar_malla()
    {
        for(var i = 0; i < 5; i++)
        for(var j = 0; j < 13; j++)
        {
             contexto.strokeStyle = "rgba(100,100,100,0.2);";
             contexto.beginPath();
             if(j % 2 == 0)
                 contexto.arc(((i)*20) + PB.RADIO,(j)*15 + PB.RADIO, PB.RADIO-1, 0, 2 * Math.PI, false);
             else if(i < 4)
                 contexto.arc(((i)*20) + (PB.RADIO<<1),(j)*15 + PB.RADIO, PB.RADIO-1, 0, 2 * Math.PI, false);
             contexto.stroke();
        }
    }

    function algoritmo_relleno2(x, y)
    {
        if(x < 0 || y < 0 || x > 4 || y > 12 || !tablero[x][y].ocupado || tablero[x][y].aux_relleno2)
            return false;
        contador_relleno2++;
        tablero[x][y].aux_relleno2 = true;
        if(y % 2 == 0)
        {
            algoritmo_relleno2(x+1,y);
            algoritmo_relleno2(x-1,y);
            algoritmo_relleno2(x,y +1);
            algoritmo_relleno2(x,y -1);
            algoritmo_relleno2(x-1,y+1);
            algoritmo_relleno2(x-1,y-1);
        }
        else
        {
            algoritmo_relleno2(x-1,y);
            algoritmo_relleno2(x+1,y);
            algoritmo_relleno2(x,y +1);
            algoritmo_relleno2(x,y -1);
            algoritmo_relleno2(x+1,y+1);
            algoritmo_relleno2(x+1,y-1);
        }
    }

    function algoritmo_relleno(x, y, color)
    {
        if(x < 0 || y < 0 || x > 4 || y > 12 || !tablero[x][y].ocupado || tablero[x][y].aux_relleno)
            return false;
        if(tablero[x][y].color != color)
            return false;
        contador_relleno++;
        tablero[x][y].aux_relleno = true;
        if(y % 2 == 0)
        {
            algoritmo_relleno(x+1,y, color);
            algoritmo_relleno(x-1,y, color);
            algoritmo_relleno(x,y +1, color);
            algoritmo_relleno(x,y -1, color);
            algoritmo_relleno(x-1,y+1, color);
            algoritmo_relleno(x-1,y-1, color);
        }
        else
        {
            algoritmo_relleno(x-1,y, color);
            algoritmo_relleno(x+1,y, color);
            algoritmo_relleno(x,y +1, color);
            algoritmo_relleno(x,y -1, color);
            algoritmo_relleno(x+1,y+1, color);
            algoritmo_relleno(x+1,y-1, color);
        }
    }

    function limpiar_relleno()
    {
        contador_relleno = 0;
        for(var i = 0; i < 5; i++)
            for(var j = 0; j < 13; j++)
                tablero[i][j].aux_relleno = false;
    }

    function limpiar_relleno2()
    {
        contador_relleno2 = 0;
        for(var i = 0; i < 5; i++)
            for(var j = 0; j < 13; j++)
                tablero[i][j].aux_relleno2 = false;
    }

    function borrar_pelotas()
    {
        for(var i = 0; i < 5; i++)
            for(var j = 0; j < 13; j++)
                if(tablero[i][j].aux_relleno)
                {
                    tablero[i][j].ocupado = false;
                    puntos++;
                    efectos.push(new PB.Item(5, i*20 ,j*15, 0, 0, 15,0));
                }
        for(var i = 0; i < 5; i++)
        {
            algoritmo_relleno2(i,0);
        }
        tirar_pelotas();
        limpiar_relleno2();
    }

    function tirar_pelotas()
    {
        var falling = false;
        for(var i = 0; i < 5; i++)
            for(var j = 0; j < 13; j++)
                if(!tablero[i][j].aux_relleno2 && tablero[i][j].ocupado)
                {
                    tablero[i][j].ocupado = false;
                    puntos+=2;
                    efectos.push(new PB.Item(tablero[i][j].color, i*20 ,j*15, 0, -1, 200,0.1));
                    falling = true;
                }
        if(falling)
        {
                  var sonido = new Audio();
                  sonido.src = "./res/sounds/falling.wav";
                  sonido.play();
        }
        evaluar_fin_de_juego();
    }

    function evaluar_fin_de_juego()
    {
        for(var i = 0; i < 5; i++)
            for(var j = 0; j < 13; j++)
                if(tablero[i][j].ocupado)
                    return false;
        tema.pause();
        ha_ganado = true;
        var win_sound = new Audio();
        win_sound.src = "./res/sounds/winner.mp3";
        win_sound.play();
        clearInterval(timer);
        puntos += segundos;
    }

    function Matrix(col,ren)
    {
        var matrix = new Array(col);
        for(var  i = 0; i < col; i++)
        {
            matrix[i] = new Array(ren);
            for(var j = 0; j < ren; j++)
            {
                matrix[i][j] = {ocupado: false, color:-1 , aux_relleno: false,aux_relleno2: false };
            }
        }
        return matrix;
    }

    function siguienteColor()
    {
        var numeros_aleatorios = [0,1,2,3,3,2,3,4,2,2,4,0,0,2,4,0,3,3,2,1,0,1,1,0,2,3,3,0,3,0,1];
        if(r == numeros_aleatorios.length) r = 0;
        return numeros_aleatorios[r++];
    }

    function _keydown(key)
    {
        console.log("keydown: %s", key);
        if(key.keyCode == 13)
        { start(); };
        if(key.keyCode == 32 && pelota == undefined)
        {
            if(primer_color == undefined) alert("no hay un color almacenado aun");
            pelota = new PB.Pelota(fuerza * Math.cos(angulo * Math.PI / 180), -fuerza * Math.sin(angulo * Math.PI / 180), primer_color);
            primer_color = segundo_color;
            segundo_color = siguienteColor();
                   var sonido = new Audio();
                   sonido.src = "./res/sounds/shoot.wav";
                   sonido.play();
        }
        else if(key.keyCode == 37)
            direccion = 1;
        else if(key.keyCode == 39)
            direccion = -1;
    }

    function _keyup(key)
    {
        console.log("keyup: %s", key);
        if(key.keyCode == 37 || key.keyCode == 39)
            direccion = 0;
    }

    function handleKeyEvent(key, value)
    {
        // translation
        if(key == "left") key = 37;  // left
        if(key == "right") key = 39; // right
        if(key == "pad_a") key = 32; // spacebar

        if(value)
            _keydown({ keyCode : key });
        else
            _keyup({ keyCode : key });
    }

    return { init  : init,
             start : start,
             handleKeyEvent : handleKeyEvent };
})();
