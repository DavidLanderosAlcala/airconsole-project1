LevelManager.getLevels().push({
    title: 'El vaso',
    descriptions: ["Saca la pelota del vaso", "Utilizando solo 1 dibujo", "En menos de 60 segundos"],
    show_timer: true,
    bodies: [{
        "label": "ball",
        "type": "circle",
        "position": [0, 6.869999999999999],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "radio": 0.3544580454739358
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-12.53271240234375, 1.1343786621093734],
            [12.532711863405712, 1.1343786621093734],
            [12.532711863405712, 0.024999618530273438],
            [-12.53271240234375, 0.024999618530273438]
        ]
    }, {
        "label": "glass",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-1.01532458655225, 6.277969723207475],
            [-1.5376725750160176, 2.3724941632357677],
            [1.01609370514662, 2.0367801462937756],
            [1.5274411238148051, 5.937880908529424],
            [1.1319551541498125, 5.979084013238126],
            [0.4664397186120226, 2.79428713139961],
            [-0.813385586866465, 2.9596145986552784],
            [-0.6272593369401989, 6.220220829325814]
        ]
    }, {
        "label": "sensor",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": true,
        "respawn": false,
        "vertices": [
            [-0.7164312307461103, 5.963440783285215],
            [1.1374308070046766, 5.715491182413693],
            [0.716433021966763, 2.5677877422158986],
            [-1.1374290157840257, 2.81573734308742]
        ]
    }],
    tacks: [],
    hints: [{
        "label": "untitled-shape",
        "position": [0, 0],
        "respawn": false,
        "vertices": [
            [0.05548704371581792, 7.563317159147096],
            [0.039386823934945525, 5.3173372495822795],
            [0.5143431444561362, 5.30928713969184],
            [0.5062930454333419, 6.629504727017943],
            [1.2791033340919533, 6.621454617127505],
            [1.2710532242015145, 5.3173372495822795],
            [1.7379594456999126, 5.30928713969184],
            [1.7379594456999126, 6.621454617127505],
            [6.189668715377358, 6.621454617127505],
            [6.205768935158229, 7.571367269037534],
            [0.05548704371581792, 7.563317159147096]
        ],
        "opacity": "0.2"
    }],
    decorations: [],
    setup: function(ctx) {

        ctx.bitflag = 0;
        ctx.glass = Phy.getBodyByLabel("glass");
        ctx.sensor = Phy.getBodyByLabel("sensor");
        ctx.deletionFlag = false;

        Phy.on("removeBody", function() {
            ctx.deletionFlag = true;
        });

        Phy.on("endContactBetween", "sensor", "ball", function() {
            Screen.setSubtitle("Bien hecho!");
            ctx.bitflag = FIRST_STAR;
            if (ctx.deletionFlag === false) {
                ctx.bitflag |= SECOND_STAR;
            }
            if (Game.getTime() < 60) {
                ctx.bitflag |= THIRD_STAR;
            }
        });
    },
    update: function(ctx) {
        ctx.glass = Phy.getBodyByLabel("glass");
        ctx.sensor = Phy.getBodyByLabel("sensor");
        Phy.setPosition(ctx.sensor, Phy.getPosition(ctx.glass));
        Phy.setAngle(ctx.sensor, Phy.getAngle(ctx.glass));
        return ctx.bitflag;
    },
});