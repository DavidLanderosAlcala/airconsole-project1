LevelManager.getLevels().push({
    title: 'My first drawing',
    descriptions: ["Draw any shape", "Erase it", "Hit some of the existing shapes"],
    show_timer: false,
    bodies: [{
        "label": "shape",
        "type": "circle",
        "position": [-5.86, 3.0299999999999994],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "radio": 0.5500003356935644
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-11.716673583984376, 1.0416674804687496],
            [11.716673583984374, 1.0416674804687496],
            [11.716673583984374, 0.02500022888183473],
            [-11.716673583984376, 0.02500022888183473]
        ]
    }, {
        "label": "shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [-3.239206698791863, 3.9598284346468695],
            [-2.516153913793171, 4.339486103220324],
            [-1.5941281776588134, 2.5835008261221155],
            [-2.3171809626575053, 2.2038431575486612]
        ]
    }, {
        "label": "shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": false,
        "isSensor": false,
        "respawn": false,
        "vertices": [
            [2.202344029686353, 2.286237961897431],
            [1.3593244882995368, 3.9668134264908286],
            [4.910932333506823, 3.633501596674458]
        ]
    }],
    tacks: [],
    hints: [],
    decorations: [],
    setup: function(ctx) {

        ctx.bitflag = 0;
        ctx.shapeHasBeenTouched = false;

        Phy.on("beginContactBetween", "Body", "shape", function() {
            ctx.shapeHasBeenTouched = true;
        });

        Phy.on("addBody", function() {
            Screen.setSubtitle("easy right? now erase it by right-clicking it");
        });

        Phy.on("removeBody", function() {
            Screen.setSubtitle("well done!");
            ctx.bitflag = FIRST_STAR | SECOND_STAR;
            if (ctx.shapeHasBeenTouched) {
                ctx.bitflag |= THIRD_STAR;
            }
        });
    },
    update: function(context) {
        return context.bitflag;
    },
});