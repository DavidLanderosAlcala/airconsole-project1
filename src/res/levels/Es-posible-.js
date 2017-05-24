LevelManager.getLevels().push({
    title: 'Es posible?',
    descriptions: ["Lleva la pelota a la bandera", "Usa 1 o mas ejes de rotacion", "Utilizando solo 1 dibujo"],
    show_timer: false,
    bodies: [{
        "label": "ball",
        "type": "circle",
        "position": [-2.0599999999999996, 4.529999999999999],
        "isStatic": false,
        "isSensor": false,
        "respawn": true,
        "radio": 0.3500003916426908
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-3.9652999059655905, 9.524912941830946],
            [3.969038988758591, 9.541579627147264],
            [3.9558808811388175, 2.8415721299871812],
            [-3.9521417983458162, 2.8082387593545466],
            [-3.958711985394525, 2.821564986046692],
            [-3.9784580135853647, 3.8582399342826186],
            [-3.9652999059655905, 3.8582399342826186],
            [-3.9521417983458162, 3.8582399342826186],
            [-2.9784418344824823, 3.941573360864213],
            [2.9558647020359334, 3.9249066755478914],
            [2.9558647020359334, 8.558245193484467],
            [-2.965283726862709, 8.558245193484467],
            [-2.9784418344824823, 7.608244130454305],
            [1.8768998772144059, 7.558244074505349],
            [1.9032160924539543, 5.0082412211086025],
            [-3.9389836907260403, 5.091574647690196]
        ]
    }, {
        "label": "sensor",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": true,
        "respawn": false,
        "vertices": [
            [-2.875003662109375, 8.546669311523438],
            [-1.9250024414062494, 8.546669311523438],
            [-1.9250024414062494, 7.5633349609375],
            [-2.875003662109375, 7.5633349609375]
        ]
    }],
    tacks: [],
    hints: [],
    decorations: [{
        "label": "untitled-shape",
        "position": [0, 0],
        "respawn": false,
        "vertices": [
            [-2.1583357450354717, 7.530001675532291],
            [-2.108335689086518, 8.432230548775825],
            [-2.116657708407053, 8.443328997099599],
            [-2.7083363604739885, 7.988056334255931],
            [-2.716658384730531, 7.9991547789256305],
            [-2.191669115668107, 7.988056334255931],
            [-2.1583357450354717, 7.530001675532291]
        ],
        "line": null,
        "opacity": "0.5"
    }],
    setup: function(ctx) {
        ctx.bitflag = 0;
        ctx.tackCond = false;
        Game.on("connectTack", function() {
            ctx.tackCond = true;
        });
        Phy.on("beginContactBetween", "sensor", "ball", function() {
            ctx.bitflag = FIRST_STAR;
            if (ctx.tackCond) {
                ctx.bitflag |= SECOND_STAR;
            }
            if (Game.getDrawnObjectsCount() == 1) {
                ctx.bitflag |= THIRD_STAR;
            }
        });
    },
    update: function(ctx) {
        /* your code goes here */
        return ctx.bitflag;
    },
});