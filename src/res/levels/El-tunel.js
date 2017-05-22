LevelManager.getLevels().push({
    title: 'El tunel',
    descriptions: ["Lleva la pelota a la bandera", "Utilizando solo 1 dibujo", "En menos de 40 segundos"],
    show_timer: false,
    bodies: [{
        "label": "ball",
        "type": "circle",
        "position": [-3.3599999999999994, 5.529999999999999],
        "isStatic": false,
        "isSensor": false,
        "respawn": true,
        "radio": 0.30000001367479284
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-4.269230768950263, 5.010768192186271],
            [-0.6846152209386336, 5.026152808272157],
            [-0.6999998370245208, 7.456922149842275],
            [2.238461835379862, 7.410768301584615],
            [2.2538464514657495, 8.45692219542492],
            [-1.8076921952083715, 8.364614498909598],
            [-1.8538460434660333, 6.072306702112462],
            [-4.1923076885208275, 6.041537469940688],
            [-4.3000000011220365, 9.733845330553525],
            [4.238461926545149, 9.687691482295865],
            [4.300000390888695, 2.6261526988738133],
            [-4.2230769206926, 2.6876911632173606]
        ]
    }, {
        "label": "sensor",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": true,
        "respawn": false,
        "vertices": [
            [1.2384619140624995, 8.318461303710937],
            [2.2692311859130854, 8.318461303710937],
            [2.2692311859130854, 7.4261535644531245],
            [1.2384619140624995, 7.4261535644531245]
        ]
    }],
    tacks: [],
    hints: [],
    decorations: [{
        "label": "untitled-shape",
        "position": [0, 0],
        "respawn": false,
        "vertices": [
            [1.8846153634622098, 7.456922893621816],
            [1.8846153634622098, 8.195384465744382],
            [1.5769230417444717, 7.872307527940761],
            [1.8538461312904317, 7.841538295768986],
            [1.8846153634622098, 7.456922893621816]
        ],
        "opacity": "0.5"
    }],
    setup: function(ctx) {
        ctx.statuscode = 0;
        ctx.bodiesCount = 0;

        Phy.on("addBody", function() {
            ctx.bodiesCount++;
        });

        Phy.on("beginContactBetween", "sensor", "ball", function() {
            ctx.statuscode = FIRST_STAR;
            if (ctx.bodiesCount == 1) {
                ctx.statuscode |= SECOND_STAR;
            }
        });
    },
    update: function(ctx) {
        /* your code goes here */
        return ctx.statuscode;
    },
});