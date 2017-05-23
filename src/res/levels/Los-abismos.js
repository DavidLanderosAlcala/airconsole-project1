LevelManager.getLevels().push({
    title: 'Los abismos',
    descriptions: ["Lleva la pelota al hoyo derecho", "Con solo 1 dibujo", "Sin borrar dibujos"],
    show_timer: false,
    bodies: [{
        "label": "ball",
        "type": "circle",
        "position": [-4.11, 11.42],
        "isStatic": false,
        "isSensor": false,
        "respawn": true,
        "radio": 0.4454545285279036
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-13.045455322265624, 3.9799999999999986],
            [-5.463637084960937, 3.9799999999999986],
            [-5.463637084960937, -0.2563638305664071],
            [-13.045455322265624, -0.2563638305664071]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-3.1000006103515627, 3.9799999999999986],
            [4.481817626953125, 3.9799999999999986],
            [4.481817626953125, -0.2563638305664071],
            [-3.1000006103515627, -0.2563638305664071]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [6.863635253906249, 3.9799999999999986],
            [14.445453491210937, 3.9799999999999986],
            [14.445453491210937, -0.2563638305664071],
            [6.863635253906249, -0.2563638305664071]
        ]
    }, {
        "label": "sensor",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": true,
        "respawn": false,
        "vertices": [
            [4.954544677734376, 3.1799999999999997],
            [6.445453796386719, 3.1799999999999997],
            [6.445453796386719, 0.9799999999999986],
            [4.954544677734376, 0.9799999999999986]
        ]
    }],
    tacks: [],
    hints: [{
        "label": "untitled-shape",
        "position": [0, 0],
        "respawn": false,
        "vertices": [
            [-6.2250011, 8.398181999999998],
            [-6.2613648, 5.743636499999999],
            [-0.9159100999999996, 5.798182],
            [-6.2250011, 8.398181999999998]
        ],
        "opacity": "0.2"
    }],
    decorations: [{
        "label": "untitled-shape",
        "position": [0, 0],
        "respawn": false,
        "vertices": [
            [4.744301587408469, 6.561994425318126],
            [5.702026724026483, 5.604268987095717],
            [5.70731807144718, 5.598977941279415],
            [6.665043208065196, 6.556703077897432],
            [6.188826162664338, 6.561994425318126],
            [6.1835349660458405, 6.567285471134428],
            [6.188826162664338, 7.530302105975333],
            [6.1835349660458405, 7.535593151791636],
            [5.220518482007128, 7.525010909356836],
            [5.215227285388632, 7.5303019551731385],
            [5.21522713458644, 6.567285772738819],
            [5.2099359379679395, 6.572576818555121],
            [5.040547673957509, 6.5743151154577175],
            [4.744301587408469, 6.561994425318126]
        ],
        "opacity": "0.1"
    }, {
        "label": "untitled-shape",
        "position": [0, 0],
        "respawn": false,
        "vertices": [
            [5.199332275390626, 8.172756042480469],
            [6.193197021484377, 8.172756042480469],
            [6.193197021484377, 7.724903259277343],
            [5.199332275390626, 7.724903259277343],
            [5.199332275390626, 8.172756042480469]
        ],
        "opacity": "0.1"
    }, {
        "label": "untitled-shape",
        "position": [0, 0],
        "respawn": false,
        "vertices": [
            [5.1876550292968755, 8.558168640136717],
            [6.181519775390626, 8.558168640136717],
            [6.181519775390626, 8.325039672851561],
            [5.1876550292968755, 8.325039672851561],
            [5.1876550292968755, 8.558168640136717]
        ],
        "opacity": "0.1"
    }],
    setup: function(ctx) {
        ctx.bitflag = 0;
        ctx.deletionflag = false;

        Phy.on("removeBody", function() {
            ctx.deletionflag = true;
        });

        Phy.on("beginContactBetween", "sensor", "ball", function() {
            ctx.bitflag = FIRST_STAR;
            if (Game.getDrawnObjectsCount() == 1) {
                ctx.bitflag |= SECOND_STAR;
            }
            if (!ctx.deletionflag) {
                ctx.bitflag |= THIRD_STAR;
            }
        });
    },
    update: function(ctx) {
        return ctx.bitflag;
    },
});