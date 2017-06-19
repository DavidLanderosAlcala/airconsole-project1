LevelManager.getLevels().push({
    title: 'Encesta',
    descriptions: ["Lleva la pelota al vaso", "Utiliza solo 2 dibujos", "En menos de 30 segundos"],
    show_timer: true,
    bodies: [{
        "label": "ball",
        "type": "circle",
        "position": [0, 8.86],
        "isStatic": false,
        "isSensor": false,
        "respawn": true,
        "radio": 0.3357142572949067
    }, {
        "label": "glass",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-1.0678633700884301, 3.9186722422950258],
            [-1.0678633700884301, 1.610202659312753],
            [1.0678630929245934, 1.613597474329433],
            [1.0593031273393176, 3.9186722422950258],
            [0.7297420891636577, 3.911882612261664],
            [0.5328614711085162, 2.0107900696521206],
            [-0.5371417725236345, 2.0073952546354388],
            [-0.7425823561640499, 3.9152774272783457]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-3.735714325904846, 8.029285736083985],
            [3.7357138967514043, 8.029285736083985],
            [3.7357138967514043, 7.386428680419921],
            [-3.735714325904846, 7.386428680419921]
        ]
    }, {
        "label": "sensor",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": true,
        "respawn": false,
        "vertices": [
            [-0.6071426391601555, 3.137143096923827],
            [0.6928572082519526, 3.137143096923827],
            [0.6928572082519526, 1.9657146453857415],
            [-0.6071426391601555, 1.9657146453857415]
        ]
    }],
    tacks: [],
    hints: [],
    decorations: [],
    setup: function(ctx) {

        ctx.bitflag = 0;
        Phy.on("beginContactBetween", "sensor", "ball", function() {
            ctx.bitflag = FIRST_STAR;
            if (Game.getDrawnObjectsCount() < 3) {
                ctx.bitflag |= SECOND_STAR;
            }
            if (Game.getTime() < 30) {
                ctx.bitflag |= THIRD_STAR;
            }
        });
    },
    update: function(ctx) {
        return ctx.bitflag;
    },
});