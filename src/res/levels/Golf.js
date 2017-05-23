LevelManager.getLevels().push({
    title: 'Golf',
    descriptions: ["Lleva la pelota al vaso", "Utilizando el eje de rotacion", "No mas de 1 dibujo"],
    show_timer: false,
    bodies: [{
        "label": "ball",
        "type": "circle",
        "position": [-4.05, 3.26],
        "isStatic": false,
        "isSensor": false,
        "respawn": true,
        "radio": 0.43636393547058105
    }, {
        "label": "base",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-5.050379625680562, 7.670504794908934],
            [-2.9857705669773704, 7.670504794908934],
            [-2.9857705669773704, 6.956631377388393],
            [-5.050379625680562, 6.956631377388393]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-4.2668767999999995, 1.8814785999999994],
            [-4.2740195000000005, 1.145780199999999],
            [-4.281162, 1.1457802999999984],
            [-0.06696789999999986, 1.1314948000000005],
            [-0.06696789999999986, 1.1243520999999994],
            [-0.06696789999999986, 1.1172093999999984],
            [1.3615726000000006, 2.2814698999999994],
            [1.3544301, 2.2814698999999994],
            [0.8544406999999996, 2.8671714999999995],
            [0.8472982000000009, 2.8671714999999995],
            [-0.3955321999999999, 1.8743359000000002],
            [-0.4026745999999992, 1.8743359000000002]
        ]
    }, {
        "label": "glass",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [4.014999505044443, 2.2193356730768947],
            [5.572294445639676, 0.64114420133264],
            [7.403418940628907, 2.4526038227471396],
            [5.841065840756974, 4.021223414019662],
            [5.562734416294038, 3.7374159320370204],
            [6.676200375205525, 2.2709545431488394],
            [5.759946106149176, 1.362251526148036],
            [4.296527174804185, 2.4925549935432088]
        ]
    }, {
        "label": "sensor",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": true,
        "respawn": false,
        "vertices": [
            [6.023052206385589, 3.2675986488647695],
            [6.86996136503069, 2.430613650344375],
            [5.591909616897883, 1.1374079983560055],
            [4.745000458252784, 1.9743929968764018]
        ]
    }],
    tacks: [{
        "label": "untitled-shape",
        "position": [-4.11, 7.31],
        "respawn": false,
        "bodyA": "base",
        "bodyB": "null"
    }],
    hints: [{
        "label": "hammer",
        "position": [0, 0],
        "respawn": false,
        "vertices": [
            [-7.146852425390625, 11.93627218380432],
            [-7.146852125390625, 10.35832538380432],
            [-4.633146025390624, 10.35832538380432],
            [-4.6790166253906245, 6.62446268380432],
            [-3.440511825390624, 6.60611448380432],
            [-3.4863823253906254, 11.93627218380432],
            [-7.146852425390625, 11.93627218380432]
        ],
        "opacity": "0.2"
    }],
    decorations: [],
    setup: function(ctx) {

        ctx.bitflag = 0;
        ctx.gameover = false;
        ctx.ball = Phy.getBodyByLabel("ball");
        ctx.ball.mass *= 0.7;
        ctx.tackCondition = false;

        Game.on("connectTack", function() {
            ctx.tackCondition = true;
        });

        Phy.on("beginContactBetween", "sensor", "ball", function() {
            Screen.setSubtitle("Buen trabajo!");
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