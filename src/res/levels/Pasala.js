LevelManager.getLevels().push({
    title: 'Pasala',
    descriptions: ["Dummy description 1", "Dummy description 2", "Dummy description 3"],
    show_timer: false,
    bodies: [{
        "label": "untitled-shape",
        "type": "circle",
        "position": [-6.18, 7.249999999999999],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "radio": 0.21538469628331483
    }, {
        "label": "untitled-shape",
        "type": "circle",
        "position": [-6.029999999999999, 7.819999999999999],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "radio": 0.21538469628331483
    }, {
        "label": "untitled-shape",
        "type": "circle",
        "position": [-6.109999999999999, 8.45],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "radio": 0.21538469628331483
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-7.2846177, 4.3030758],
            [-4.8076937, 4.3030758],
            [-4.8076937, 3.9184602999999996],
            [-7.2846177, 3.9184602999999996]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [6.34615716165251, 4.287691202163696],
            [8.82308122573092, 4.287691202163696],
            [8.82308122573092, 3.903075685501097],
            [6.34615716165251, 3.903075685501097]
        ]
    }, {
        "label": "glass",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-6.735086125337023, 7.234865771139468],
            [-7.141201328951992, 4.858831522908087],
            [-5.587397365837904, 4.596849414396058],
            [-5.188104721459481, 6.970453476454768],
            [-5.428972360674298, 7.004430406810239],
            [-5.90660155681242, 5.072169171975402],
            [-6.68535848775973, 5.20167912293588],
            [-6.499122844703972, 7.190938278744521]
        ]
    }, {
        "label": "glass",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [6.564873218582687, 7.364947528469759],
            [6.906032007402242, 4.978720605051061],
            [8.46539993961478, 5.205244282725451],
            [8.118490917442877, 7.587068202421589],
            [7.878792971000884, 7.5456368084154475],
            [8.015951645435077, 5.559950356371234],
            [7.234955532127433, 5.444710473369826],
            [6.802950280836114, 7.395404505595471]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [0.17692382812500007, 8.287693076133728],
            [0.9923087310791026, 8.287693076133728],
            [0.9923087310791026, -0.22000223636627325],
            [0.17692382812500007, -0.22000223636627325]
        ]
    }],
    tacks: [],
    hints: [],
    decorations: [],
    setup: function(ctx) {
        /* your code goes here */
        ctx.statuscode = 0;
    },
    update: function(ctx) {
        /* your code goes here */
        return ctx.statuscode;
    },
});