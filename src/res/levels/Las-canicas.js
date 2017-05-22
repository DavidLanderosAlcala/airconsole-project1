LevelManager.getLevels().push({
    title: 'Las canicas',
    descriptions: ["Haz que las canicas se toquen", "En menos de 30 segundos", "Utilizando solo 1 dibujo"],
    show_timer: true,
    bodies: [{
        "label": "ball1",
        "type": "circle",
        "position": [-5.29, 5.339999999999999],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "radio": 0.4259259259259261
    }, {
        "label": "ball2",
        "type": "circle",
        "position": [5.41, 5.209999999999999],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "radio": 0.4259259259259261
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [2.0976633748046876, 3.465371957812499],
            [6.182769974804689, 3.486648557812499],
            [6.193408174804688, 4.273882657812498],
            [2.8955357748046886, 4.2313294578125],
            [2.927450674804687, 8.901542357812499],
            [2.0657485748046884, 8.901542357812499],
            [2.0551102748046883, 8.9015424578125]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-2.0710823484054703, 3.4584582004882805],
            [-6.182700882109138, 3.4797348004882807],
            [-6.19340812296431, 4.26696890048828],
            [-2.8741328605685137, 4.224415700488281],
            [-2.9062548850809957, 8.89462860048828],
            [-2.038960424541979, 8.89462860048828],
            [-2.0282530830378205, 8.89462870048828]
        ]
    }],
    tacks: [],
    hints: [],
    decorations: [],
    setup: function(ctx) {
        ctx.statuscode = 0;
        Phy.on("beginContactBetween", "ball1", "ball2", function() {
            ctx.statuscode = FIRST_STAR;
            if (Game.getTime() < 30) {
                ctx.statuscode |= SECOND_STAR;
            }
            if (Game.getDrawnObjectsCount() == 1) {
                ctx.statuscode |= THIRD_STAR;
            }
        });
    },
    update: function(ctx) {
        /* your code goes here */
        return ctx.statuscode;
    },
});