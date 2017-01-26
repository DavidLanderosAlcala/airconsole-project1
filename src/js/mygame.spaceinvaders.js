// CLASE: mygame.SpaceInvaders
// AUTOR: David Landeros
// FECHA: 11/08/2015

// UNA PEQUEÑA CLASE PARA INCRUSTAR EL VIDEOJUEGO 'space invaders' EN CUALQUIER
// DOCUMENTO HTML MEDIANTE JAVASCRIPT

// SE DECLARA EL NAMESPACE EN CASO DE QUE
// NO HAYA SIDO DECLARADO ANTES
if( typeof mygame == "undefined")
	mygame = {};

mygame.SpaceInvadersSingleton = null;
mygame.SpaceInvadersKeyDownEventHandler = function(evt) {
    console.log('se a presionado una tecla: ' + evt.keyCode);
    if(evt.keyCode == 37) // LEFT
    	mygame.SpaceInvadersSingleton.keys.left = true;
    else if(evt.keyCode == 39) // RIGHT
    	mygame.SpaceInvadersSingleton.keys.right = true;
    else if(evt.keyCode == 40 || evt.keyCode == 32) // DOWN
    	mygame.SpaceInvadersSingleton.keys.down = true;
    else if(evt.keyCode == 27)
        mygame.SpaceInvadersSingleton.close();
}

mygame.SpaceInvadersKeyUpEventHandler = function(evt) {
    console.log('se a presionado una tecla: ' + evt.keyCode);
    if(evt.keyCode == 37) // LEFT
    	mygame.SpaceInvadersSingleton.keys.left = false;
    else if(evt.keyCode == 39) // RIGHT
    	mygame.SpaceInvadersSingleton.keys.right = false;
    else if(evt.keyCode == 40 || evt.keyCode == 32) // DOWN or SPACE
    	mygame.SpaceInvadersSingleton.keys.down = false;
}

// CONSTRUCTOR DE LA CLASE
mygame.SpaceInvaders = function(options)
{
	// SE ASIGNA EL SINGLETON Y EL MANEJADOR DE KEYDOWNS Y KEYUPS
	if(mygame.SpaceInvadersSingleton != null){
		console.error('No se pueden crear 2 objetos mygame.SpaceInvaders, espere a que se cierre el primer juego');
		return false;
	}
	mygame.SpaceInvadersSingleton = this;
	window.addEventListener('keydown', mygame.SpaceInvadersKeyDownEventHandler);
	window.addEventListener('keyup', mygame.SpaceInvadersKeyUpEventHandler);

	// SE CREA UNA ESTRUCTURA QUE DESCRIBE EL ESTADO DE LAS TECLAS
	this.keys = {
        left: false,
        right: false,
        down : false,
	};

	// SE CARGA EL ARCHIVO CON LOS SPRITES
	this.sprites = new Image();
	this.sprites.src = "./resource/sprites.png";

	// EL OBJETO TIENE 2 CALLBACKS, UNO PARA EJECUTARSE CUANDO EL JUEGO SE ABRA
	// Y OTRO PARA EJECUTARSE CUANDO LE JUEGO SE CIERRE
	this.onclose = options.close == undefined ? function(){} : options.close;
	this.open = options.open == undefined ? function(){} : options.open;

    // SI LA BANDERA 'MODAL' ESTÁ ACTIVADA SE INSERTA UNA PEQUEÑA NIEBLA
    // QUE INHABILITA EL DOCUMENTO MIENTRAS SE ESTÁ JUGANDO
    if(options.modal) {
        this.fog = document.createElement('div');
        this.fog.style.position = 'fixed';
        this.fog.style.left = '0px';
        this.fog.style.top = '0px';
        this.fog.style.width = '100%';
        this.fog.style.height = '100%';
        this.fog.style.backgroundColor = 'rgba(0,0,0,0.3)';
        document.body.appendChild(this.fog);
    }

    // AQUI SE CONSTRUYE UN DIV QUE FLOTE EN LA PANTALLA
    // DONDE PROYECTARÁ EL JUEGO, LO LLAMARÉ MAIN_LAYOUT
    this.main_layout = document.createElement('div');
    this.main_layout.style.position = "fixed";
    this.main_layout.style.left = "50%";
    this.main_layout.style.top = "50%";
    this.main_layout.style.marginLeft = "-300px";
    this.main_layout.style.marginTop = "-240px";
    this.main_layout.style.width = "600px";
    this.main_layout.style.height = "480px";
    this.main_layout.style.background = "black";
    this.main_layout.style.padding = "0px";
    document.body.appendChild(this.main_layout);

    // SE CREA UN CANVAS Y UN CONTEXTO, SE INSERTA EL CANVAS EN EL
    // MAIN_LAYOUT PARA RENDERIZAR GRAFICOS AL VUELO.
    this.canvas = document.createElement('canvas');
    this.canvas.width = "600";
    this.canvas.height = "480";
    //this.canvas.style.border = "1px solid red";
    this.canvas.style.marginRight = "-600px";
    this.canvas.style.marginBottom = "-480px";
    this.canvas.style.position = "relative";
    this.canvas.style.top = "-13px";
    this.canvas.style.width = "600px";
    this.canvas.style.height = "480px";
    this.canvas.id = 'mygame-canvas-spaceinvaders';
    this.main_layout.appendChild(this.canvas);
    this.canvas.focus();
    this.ctx = this.canvas.getContext('2d');


    // reamos los LABEL que mostraran la información
    // en pantalla

    this.scoreLabel = document.createElement('label');
    this.scoreLabel.style.color = "white";
    this.scoreLabel.style.display = "inline-block";
    this.scoreLabel.style.margin = "0px";
    this.scoreLabel.style.width = "100%";
    this.scoreLabel.style.fontWeight = "bold";
    this.scoreLabel.style.height = "100px";
    this.scoreLabel.style.border = "1px solid rgba(0,0,0,0)";
    this.scoreLabel.style.textAlign = "center";
    this.scoreLabel.style.fontSize = "25px";
    this.scoreLabel.style.fontFamily = "Courier New";
    this.main_layout.appendChild(this.scoreLabel);
    this.scoreLabel.innerHTML = "SCORE<br>0";
    this.open();
    this.start();
}

// ESTA FUNIÓN INICIA EL JUEGO.
// CONSTRUYE Y EJECUTA EL GAME_LOOP
mygame.SpaceInvaders.prototype.start = function() {
    this.init();
    var self = this;
    this.gameLoop = setInterval(function(){
        self.step();
        self.render();
    },10);
}

// CONSTRUYE LOS MOBS, ESTABLECE 3 VIDAS PARA EL JUGADOR
// REINICIA EL SCORE, ETC.
mygame.SpaceInvaders.prototype.init = function() {
    this.sounds = {
        song : new Audio("./resource/song.mpeg"),
        shoot: new Audio("./resource/shoot.wav"),
        dead: new Audio("./resource/dead.wav"),
        score : new Audio("./resource/score.wav")
    }

    this.sounds.song.play();
    this.sounds.song.volume = 0.3;
    this.sounds.shoot.volume = 0.1;
    this.sounds.score.volume = 0.1;
    this.sounds.dead.volume = 0.1;

    this.explotion = {x: -100, y: -100 };
	this.enemySize = 25;
	this.movements = 'RRRRRRRRRRDLLLLLLLLLLD';
	this.movePtr = 0;
	this.enemyPtr = 40;
    this.score = 0;
    this.lives = 2;
    this.enemies = [];
    this.spaceShip = { x: 300, y: 430, width: 25, height: 25, alive: true };
    this.wallsSprites = [
        new mygame.Shield({x: 150, y: 380, size: 45, ctx: this.ctx }),
        new mygame.Shield({x: 250, y: 380, size: 45, ctx: this.ctx }),
        new mygame.Shield({x: 350, y: 380, size: 45, ctx: this.ctx }),
        new mygame.Shield({x: 450, y: 380, size: 45, ctx: this.ctx }),
    ];
    this.walls = [
        { x:150, y:380, health: 5 },
        { x:250, y:380, health: 5 },
        { x:350, y:380, health: 5 },
        { x:450, y:380, health: 5 },
    ];
    for(var i = 0; i < 5; i++)
    	for(var j = 0; j < 8; j++)
    		this.enemies.push({
    			x : (j * (this.enemySize + 25)) + 50 ,
    			y : (i * (this.enemySize + 25)) + 80 ,
    			alive:true,
    			type : this.getTypeByRow(i),
    			frame : 0
    		});
    this.special_enemiess = [];
    this.bullets = [];
    this.enemyBullets = [];
    this.shot_lock = false;
    this.render();
}

// COMPRUEBA SI ALGUNA DE LAS BALAS HA CHOCADO CON ALGUNO DE LOS ENEMIGOS
// O CON ALGUNO DE LOS MUROS
// EN CASO DE QUE HAYA COLISIÓN ELIMINA EL ENEMIGO E INSERTA EL EFECTO DE EXPLOSIÓN.
mygame.SpaceInvaders.prototype.bulletTest = function() {
    var i,j, bl = this.bullets.length, el = this.enemies.length, wl = this.walls.length;
    for(i = 0; i < bl; i++) {
        // COMPROBANDO BALAS CON TODOS LOS ENEMIGOS
        for(j = 0; j < el; j++) {
            // AQUI SE COMPRUEBA TODAS LAS BALAS CON TODOS LOS ENEMIGOS
            var closeX = 20; // lo mas cerca que pueden etar los objetos de una bala son chocar en X
            var closeY = 30; // lo mas cerca que pueden estar 2 objetos sin chocar en Y
            if( Math.abs(this.bullets[i].x - this.enemies[j].x) < closeX &&  Math.abs(this.bullets[i].y - this.enemies[j].y) < closeY)
            {
                this.sounds.score.play();
                this.score += (20 * this.enemies[j].type);
                this.scoreLabel.innerHTML =  "SCORE<br>" + this.score;
                this.explotion.x = this.enemies[j].x;
                this.explotion.y = this.enemies[j].y;
                this.enemies.splice(j,1);
                this.bullets.splice(i,1);
                var self = this;
                setTimeout(function(){
                    self.explotion.x = -1;
                },300);
                if(j < this.enemyPtr)
                    this.enemyPtr--;
                return;
            }
        }

        // COMPROBANDO BALAS CON TODOS LOS MUROS
        for(j = 0; j < wl; j++) {
            var closeX = 25;
            var closeY = 30;
            if( Math.abs(this.bullets[i].x - this.walls[j].x) < closeX &&  Math.abs(this.bullets[i].y - this.walls[j].y) < closeY) {
                this.bullets.splice(i,1);
                this.walls[j].health -= 1;
                this.wallsSprites[j].hitBottom();
                if(this.walls[j].health <= 0)
                {
                    this.walls.splice(j,1);
                    this.wallsSprites.splice(j,1);
                }
            }
        }
    }
}

// REGRESA UN VALOR NUMERICO QUE DETERMINA QUE TIPO
// DE ENEMIGO SE VA A GENERAR BASADO EN LA POSICIÓN
mygame.SpaceInvaders.prototype.getTypeByRow = function(row) {
	switch(row)
	{
		case 0: return 1;
		case 1: return 2;
		case 2: return 1;
		case 3: return 3;
		case 4: return 1;
	}
    return 1;
}

// CALCULA EL SIGUIENTE MOVIMIENTO Y EL SIGUIENTE ENEMIGO
// QUE SE VA A MOVER.
mygame.SpaceInvaders.prototype.nextMovement = function() {
	this.enemyPtr--;
	if(this.enemyPtr < 0) {
		this.enemyPtr = this.enemies.length-1;
		this.movePtr++;
		if(this.movePtr == 22)
			this.movePtr = 0;
	}
}

// LA FUNCIÓN RETORNA FALSE 3 VECES Y CUANDO SE LLAMANA OTRA VEZ
// RETORNA TRUE. SE USA PARA TEMPORIZAR EL MOVIMIENTO DE LOS ENEMIGOS.
// LOS CUALES SE MUEVEN CADA 3 FOTOGRAMAS.
mygame.SpaceInvaders.prototype.enemyStep = function() {
	if(this.enemyStepCount == undefined)
		this.enemyStepCount = 0;
	if(this.enemyStepCount == 2) {
		this.enemyStepCount = 0;
		return true;
	}
	this.enemyStepCount++;
	return false;
}

// LA FUNCIÓN RETORNA FALSE 10 VECES Y CUANDO SE LLAMANA OTRA VEZ
// RETORNA TRUE. SE USA PARA TEMPORIZAR LOS DISPAROS DE LOS ENEMIGOS.
// LOS CUALES OCURREN CADA 10 FOTOGRAMAS.
mygame.SpaceInvaders.prototype.enemyBulletStep = function() {
    if(this.enemyBulletStepCount == undefined)
        this.enemyBulletStepCount = 0;
    if(this.enemyBulletStepCount == 100) {
        this.enemyBulletStepCount = 0;
        return true;
    }
    this.enemyBulletStepCount++;
    return false;
}

// función que computa todos los cambios que debe tener el juego
// en cada fotograma.
mygame.SpaceInvaders.prototype.step = function() {

	// LOS ENEMIGOS NO SE MUEVEN EN CADA FOTOGRAMA
	// SOLO SE MUEVEN CADA X FOTOGRAMAS	
    if(this.enemyStep()) {
        this.nextMovement();
        if(this.movements[this.movePtr] == 'R')
        	this.enemies[this.enemyPtr].x += 15;
        if(this.movements[this.movePtr] == 'L')
        	this.enemies[this.enemyPtr].x -= 15;
        if(this.movements[this.movePtr] == 'D')
        	this.enemies[this.enemyPtr].y += 10;
        this.enemies[this.enemyPtr].frame =
            this.enemies[this.enemyPtr].frame == 0 ? 1 : 0;
    }

    // SI TOCA UN DISPARO DEL ENEMIGO
    if(this.enemyBulletStep()) {

        // SELECCIONAMOS UN ENEMIGO AL AZAR
        var selected = new Date().getSeconds() % this.enemies.length;
        this.enemyBullets.push({x : this.enemies[selected].x, y : this.enemies[selected].y });
    }

    // SE MUEVE LA NAVE SEGUN LAS TECLAS PRESIONADAS
    if(this.spaceShip.alive) {
        if(this.keys.left)
        	this.spaceShip.x-=2;
        if(this.keys.right)
    	    this.spaceShip.x+=2;
        if(this.keys.down && !this.shot_lock)
        {
            this.sounds.shoot.play();
        	this.shot_lock = true;
    	    this.shot();
    	    var self = this;
    	    setTimeout(function(){ self.shot_lock = false; }, 500);
        }
    }
    
    // SE MUEVEN LAS BALAS EXISTENTES
    var i, l = this.bullets.length;
    for(i = 0; i < l; i++) {
    	this.bullets[i].y -= 10;
    }

    // SE DESTRUYEN LAS BALAS QUE YA SALIERON DE LA PANTALLA
    for(i = 0; i < l; i++) {
        if(this.bullets[i].y < 0)
            this.bullets.splice(i,1);
    }

    // SE MUEVEN LAS BALAS ENEMIGAS EXISTENTES
    l = this.enemyBullets.length;
    for(i = 0; i < l; i++) {
        this.enemyBullets[i].y += 5;
    }

    // SE DESTRUYEN LAS BALAS ENEMIGAS QUE YA SALIERON DE LA PANTALLA
    l = this.enemyBullets.length;
    for(i = 0; i < l; i++) {
        if(this.enemyBullets[i].y > 480)
            this.enemyBullets.splice(i,1);
    }

    // DETECTAR COLISIONES, ELIMINAR ENEMIGOS ALCANZADOS
    // E INSERTAR EXPLOSIÓN
    this.bulletTest();
    this.enemyBulletTest();
}

// COMPRUEBA SI UNA BALA ENEMIGA A ALCANZADO A PERSONAJE PRINCIPAL
mygame.SpaceInvaders.prototype.enemyBulletTest = function() {
    var i , l = this.enemyBullets.length;
    for(i = 0; i < l; i++) {
        var mindiffx = 20,mindiffy = 30;

        // COMPARAR BALAS ENEMIGAS CONTRA NUESTRA NAVE
        if(Math.abs( this.enemyBullets[i].x - this.spaceShip.x ) <= mindiffx && 
            Math.abs( this.enemyBullets[i].y - this.spaceShip.y ) <= mindiffy) {
            // LA BALA A TOCADO AL PERSONAJE
            this.sounds.dead.play();

            // vibrate request
            var packet = { header: AirConsoleBus.ON_VIBRATE_REQUEST, pattern : 200 };
            Screen.getAirconsoleObject().broadcast(JSON.stringify(packet));
            // -------------------------------------------


            this.spaceShip.alive = false;
            var self = this;
            self.explotion.x = self.spaceShip.x-25;
            self.explotion.y = self.spaceShip.y-25;
            this.enemyBullets.splice(i,1);
            setTimeout(function(){
                self.explotion.x = -1;
            }, 300);
            setTimeout(function(){
                self.spaceShip.alive = true;
                self.lives--;
                // si las vidas llegan a 0 se acaba el juego
            }, 1000);
        }

        // COMPARAR BALAS ENEMIGAS CONTRA MUROS
        var j; wl = this.walls.length;
        for(j = 0; j < wl; j++) {

            if(this.enemyBullets[i] == undefined)
                continue;

            if(Math.abs( this.enemyBullets[i].x - this.walls[j].x ) <= mindiffx && 
            Math.abs( this.enemyBullets[i].y - this.walls[j].y ) <= mindiffy) {
                this.enemyBullets.splice(i,1);
                this.walls[j].health -= 1;
                this.wallsSprites[j].hitTop();
                if(this.walls[j].health <= 0) {
                    this.walls.splice(j,1);
                    this.wallsSprites.splice(j,1);
                }
            }
        }
    }
}

// función que renderiza la escena
mygame.SpaceInvaders.prototype.render = function() {

	// SE LIMPIA LA PANTALLA
	this.canvas.width = this.canvas.width;

	// DIBUJO LOS ENEMIGOS
	this.ctx.fillStyle = "white";
	var i, l = this.enemies.length;
	var o = this.enemySize>>1;
	var z = this.enemySize;
	for(i = 0; i < l; i++) {
        if(this.enemies[i].alive) {
        	var x = this.enemies[i].x;
        	var y = this.enemies[i].y;
        	var frame = this.enemies[i].frame;
        	var type = this.enemies[i].type;
        	this.drawFrame(type, frame, x-o, y-0);
        }
	}

    // DIBUJAMOS LOS MUROS DE PROTECCION
	var i, l = this.walls.length;
	for(i = 0; i < l; i++) {
		if(this.walls[i].health > 0) {
			/*
            this.ctx.save();
            this.ctx.globalAlpha = this.walls[i].health;
			var x = this.walls[i].x;
			var y = this.walls[i].y;
			this.ctx.fillRect(x-o, y-o, z, z);
            this.ctx.restore(); */
            this.wallsSprites[i].render();
		}
	}

	// DIBUJAMOS LA NAVE DEL JUGADOR
    if(this.spaceShip.alive)
	this.drawFrame(4, 0, this.spaceShip.x - (this.spaceShip.width>>1),
		                 this.spaceShip.y - (this.spaceShip.height>>1) );

	// DIBUJAMOS LAS BALAS
	this.ctx.strokeStyle = "white";
	l = this.bullets.length;
	for(i = 0; i < l; i++) {
		this.ctx.beginPath();
		this.ctx.moveTo(this.bullets[i].x, this.bullets[i].y - 10);
		this.ctx.lineTo(this.bullets[i].x, this.bullets[i].y + 10);
		this.ctx.stroke();
	}

    // DIBUJAMOS LAS BALAS ENEMIGAS
    this.ctx.strokeStyle = "white";
    l = this.enemyBullets.length;
    for(i = 0; i < l; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.enemyBullets[i].x, this.enemyBullets[i].y - 10);
        this.ctx.lineTo(this.enemyBullets[i].x, this.enemyBullets[i].y + 10);
        this.ctx.stroke();
    }

    // dibujamos la explosión si esta visible
    if(this.explotion.x > 0) {
        this.drawFrame(5,0, this.explotion.x, this.explotion.y);
    }

    // dibujamos las vidas
    l = this.lives;
    for(i = 0; i < l; i++) {
        this.drawFrame(4, 0, (50*i) + 30 , 450 );
    }
}

// FUNCIÓN QUE SE DEBE EJECUTAR PARA CERRAR EL JUEGO
// LIMPIA LISTENERS, ELIMINA EL FOG, LIMPIA INTERVALOS, ETC.
mygame.SpaceInvaders.prototype.close = function() {

	// SI EXISTE EL FOG ENTONCES SE ELIMINA
    if(this.fog)
    	this.fog.parentNode.removeChild(this.fog);
    // SE ELIMINAR EL MAIN_LAYOUT
    this.main_layout.parentNode.removeChild(this.main_layout);

    clearInterval(this.gameLoop);

    // SE ELIMINAN LOS MANEJADORES DE EVENTOS
    window.removeEventListener('keydown', mygame.SpaceInvadersKeyDownEventHandler);
    window.removeEventListener('keyup', mygame.SpaceInvadersKeyUpEventHandler);
    mygame.SpaceInvadersSingleton = null;
    this.onclose();
    this.sounds.song.pause();
}


// SE CREA UN OBJETO BULLET PARTIENDO DE LA POSICION DE LA NAVE
mygame.SpaceInvaders.prototype.shot = function() {
    this.bullets.push({
    	x: this.spaceShip.x,
    	y: this.spaceShip.y,
    });
}


// DIBUJA EL PERSONAJE SELECCIONADO EN LA POSICIÓN SELECCIONADA
// UBICADO EN LAS COORDENADAS DADAS
mygame.SpaceInvaders.prototype.drawFrame = function(character, position, x, y) {
	var sx,sy;
	if(character == 1)  // ALIEN
	{
		if(position == 0){
			sx = 17; sy = 12;
		}
		else {
			sx = 165; sy = 12;
		}
	    this.ctx.drawImage(
    		this.sprites,
		    sx,sy, 113,85,
		    x,y,37,28
        );
	}
	else if(character == 2) // MEDUSA
	{
		if(position == 0){
			sx = 311; sy = 12;
		}
		else {
			sx = 426; sy = 12;
		}
	    this.ctx.drawImage(
    		this.sprites,
		    sx,sy, 81,84,
		    x,y,27,28
        );
	}
	else if(character == 3) // CALAVERA
	{
		if(position == 0){
            sx = 200; sy = 253;
		}
		else {
            sx = 310; sy = 253;
		}
	    this.ctx.drawImage(
    		this.sprites,
		    sx,sy, 91,82,
		    x,y,30,27
        );
	}
	else if (character == 4) // NAVE HUMANA
	{
	    this.ctx.drawImage(
    		this.sprites,
		    150,634, 70,56,
		    x,y,23,18
        );
	}
    else if (character == 5) // EXPLOSION
    {
        this.ctx.drawImage(
            this.sprites,
            354,632, 103,60,
            x,y,34,20
        );
    }

}


//
// Clase: mygame.Shield
// Autor: David Landeros
// Fecha: 17/10/2015
//
// Clase que representa un escudo para el juego
// space invaders. Cada escudo debe desaparecer
// poco a poco conforme va recibiendo disparos.
// Los disparos pueden provenir de abajo o de
// arriba por los invasores o por el jugador
// respectivamente.

// La clase está definida dentro del espacio de nombres
// mygame.
if( typeof mygame == "undefined")
	mygame = {};

// constructor de la clase, recibe
// un parámetro de tipo object que
// contiene las coordenadas X y Y
// del objeto Shield.
mygame.Shield = function(options) {
    this.x = options.x; // la coordenada X donde se ubica el escudo
    this.y = options.y; // la coordenada Y donde se ubica el escudo
    // una matriz de booleanos que indica cuales piezas del escudo
    // siguen vivas y por lo tanto se dibujan.
    // cuando ninguna celda esta viva el escudo ya se terminó
    this.matrix = [[ 0, 0, 1, 0, 0],
                   [ 0, 1, 1, 1, 0],
                   [ 1, 1, 0, 1, 1],
                   [ 1, 1, 0, 1, 1],
                   [ 1, 1, 0, 1, 1]];
    // el escudo tiene 5 puntos de salud
    // solo puede soportar 5 disparos
    // cada disparo desruye un renglon de la matrix
    this.health = 5;
    this.rb = 4;
    this.rt = 0;
    // contexto en el que se dibujarán los escudos
    this.ctx = options.ctx;
    this.size = options.size;
}

// elimina las celdas desde abajo
// se debe llamar a esta función cuando
// el escudo es golpeado por una bala del jugador
mygame.Shield.prototype.hitBottom = function() {
	if(this.health == 0)
		return;
    this.health--;
    var i;
    for(i = 0; i < 5; i++)
    	this.matrix[this.rb][i] = 0;
    this.rb--;
}

// elimina las celdas desde arriba
// se debe llamar a esta función cuando
// el escudo es golpeado por una bala de
// los invasores
mygame.Shield.prototype.hitTop = function() {
	if(this.health == 0)
		return;
    this.health--;
    var i;
    for(i = 0; i < 5; i++)
    	this.matrix[this.rt][i] = 0;
    this.rt++;
}

// dibuja el escudo en su estado actual
mygame.Shield.prototype.render = function() {
	// calculamos el tamaño de cada celda
	var cellsize = this.size / 5;
    var ctx = this.ctx;
    ctx.save();
        ctx.fillStyle = '#40FF00';
        var offset = this.size >> 1;
        ctx.translate(this.x - offset ,this.y - offset );
        //ctx.translate(this.x,this.y);
        for(var i = 0; i < 5; i++)
        	for(var j = 0; j < 5; j++) {
        		if(this.matrix[j][i] == 1){
                    ctx.fillRect(i*cellsize,j*cellsize, cellsize, cellsize);
        		}
        	}
    ctx.restore();
}
