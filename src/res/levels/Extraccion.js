LevelManager.getLevels().push({
    title: 'Extraccion',
    descriptions: ["Saca la pelota del hoyo", "Utilizando el eje de rotacion", "Utilizando solo 1 dibujo"],
    show_timer: false,
    bodies: [{
        "label": "ball",
        "type": "circle",
        "position": [0, 8.629999999999999],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "radio": 0.591668990748042
    }, {
        "label": "base",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-2.772303660785294, 7.256428707157941],
            [-0.7654869607852941, 7.250220485705584],
            [-0.8206571607852933, 5.772668821304275],
            [-0.3034363607852928, 5.418801368812344],
            [0.28274713921470784, 5.443634164599278],
            [0.7723827392147058, 5.729211451182764],
            [0.7999678392147054, 7.225387689918651],
            [2.7929918392147055, 7.275053281492517],
            [2.7998881392147066, 4.586902484893814],
            [-2.799888560785293, 4.568277910559239]
        ]
    }, {
        "label": "sensor",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": true,
        "respawn": false,
        "vertices": [
            [-1.2083386282580229, 6.813336082935493],
            [1.3416714771132625, 6.813336082935493],
            [1.3416714771132625, 5.296663448079416],
            [-1.2083386282580229, 5.296663448079416]
        ]
    }],
    tacks: [{
        "label": "untitled-shape",
        "position": [1.9000000000000004, 6.119999999999999],
        "respawn": false,
        "bodyA": "base",
        "bodyB": "null"
    }],
    hints: [{
        "label": "untitled-shape",
        "position": [0, 0],
        "respawn": false,
        "vertices": [
            [0.4618157876872253, 2.8296666751018957],
            [2.104670199954098, 7.800143405967123],
            [2.844905772218297, 9.75324284044008],
            [6.009240736413748, 8.670464618536684],
            [5.215847569113452, 6.240781015376664],
            [2.664579703308574, 7.15852899827956],
            [1.0744869982920253, 2.6295023147554524],
            [1.0639869346975228, 2.633134682720213],
            [0.7715533410441484, 2.688434316986207],
            [0.4618157876872253, 2.8296666751018957]
        ],
        "opacity": "0.5"
    }],
    decorations: [],
    setup: function(ctx) {

        ctx.bitflag = 0;
        ctx.tackCondition = false;

        Game.on("connectTack", function() {
            ctx.tackCondition = true;
        });

        Phy.on("addBody", function() {
            Game.getHints()[0].opacity = 0;
        });

        Phy.on("endContactBetween", "sensor", "ball", function() {
            Screen.setSubtitle("Excelente!");
            ctx.bitflag = FIRST_STAR;
            if (ctx.tackCondition) {
                ctx.bitflag |= SECOND_STAR;
            }
            if (Game.getDrawnObjectsCount() == 1) {
                ctx.bitflag |= THIRD_STAR;
            }
        });

    },
    update: function(ctx) {
        return ctx.bitflag;
    },
});