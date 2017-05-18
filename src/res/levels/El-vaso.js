LevelManager.getLevels().push({
    title: 'El vaso',
    description: 'Saca la pelota del vaso',
    bodies: [{
        "label": "ball",
        "type": "circle",
        "position": [0, 6.869999999999999],
        "isStatic": false,
        "isSensor": false,
        "radio": 0.3544580454739358
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-8.578156127929688, 1.1343786621093734],
            [8.578156127929688, 1.1343786621093734],
            [8.578156127929688, 0.024999618530273438],
            [-8.578156127929688, 0.024999618530273438]
        ]
    }, {
        "label": "glass",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": false,
        "isSensor": false,
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
    setup: function(context) {
        context.glass = Physics.getBodyByLabel("glass");
        context.sensor = Physics.getBodyByLabel("sensor");
        Physics.on("endContact", function(event) {
            var a = Physics.getLabel(event.bodyA);
            var b = Physics.getLabel(event.bodyB);
            if (a == "sensor" || b == "sensor") {
                if (a == "ball" || b == "ball") {
                    Screen.setSubtitleText("Bien hecho!");
                    context.gameover = true;
                }
            }
        });
        context.gameover = false;
    },
    update: function(context) {
        context.glass = Physics.getBodyByLabel("glass");
        context.sensor = Physics.getBodyByLabel("sensor");
        Physics.setPosition(context.sensor, Physics.getPosition(context.glass));
        Physics.setAngle(context.sensor, Physics.getAngle(context.glass));
        return context.gameover;
    },
});


/*
 Generated from SVG: 
<title style="pointer-events:inherit">Layer 1</title><path fill="url(#diagonal-stripe-1)" fill-opacity="null" stroke="#fff" stroke-width="5" stroke-linejoin="null" stroke-linecap="null" stroke-opacity="null" d="M142.18438720703125,1122.5621337890625 L1857.8156127929688,1122.5621337890625 L1857.8156127929688,1233.5000381469727 L142.18438720703125,1233.5000381469727 L142.18438720703125,1122.5621337890625 z" id="svg_8" stroke-dasharray="none" static="true" category="bodies" sensor="false" opacity="1.0"></path><ellipse fill="none" stroke-width="5" stroke-opacity="null" fill-opacity="null" cx="1000.000018003492" cy="549.4814741528144" id="svg_9" rx="35.44580454739358" ry="35.44580454739359" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0" stroke="#fff" label="ball" bodya="" bodyb=""></ellipse><path fill="none" stroke-width="5" stroke-opacity="null" fill-opacity="null" d="M871.2134169136552,623.5370659052994 C871.2134169136552,623.5370659052994 871.2134169136552,1017.562277923369 871.2134169136552,1017.562277923369 C871.2134169136552,1017.562277923369 1128.7865626147573,1016.9828279174737 1128.7865626147573,1016.9828279174737 C1128.7865626147573,1016.9828279174737 1127.7542101549564,623.5370659052994 1127.7542101549564,623.5370659052994 C1127.7542101549564,623.5370659052994 1088.0084502407512,624.6959659170901 1088.0084502407512,624.6959659170901 C1088.0084502407512,624.6959659170901 1064.264232996606,949.1873092261787 1064.264232996606,949.1873092261787 C1064.264232996606,949.1873092261787 935.2195737603035,949.766759232074 935.2195737603035,949.766759232074 C935.2195737603035,949.766759232074 910.4429971395621,624.1165159111948 910.4429971395621,624.1165159111948 C910.4429971395621,624.1165159111948 871.2134169136552,623.5370659052994 871.2134169136552,623.5370659052994 z" id="svg_7" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0" stroke="#fff" label="glass" bodya="" bodyb="" transform="rotate(7.6179633140563965 999.9999999999998,820.5501098632815) "></path><path fill="url(#diagonal-stripe-1)" fill-opacity="null" stroke-width="5" stroke-linejoin="null" stroke-linecap="null" stroke-opacity="null" d="M906.4815519309589,650.6519543836295 L1093.5185391710727,650.6519543836295 L1093.5185391710727,968.2251913296898 L906.4815519309589,968.2251913296898 L906.4815519309589,650.6519543836295 z" id="svg_10" stroke-dasharray="none" static="true" category="bodies" sensor="true" opacity="0.2" label="sensor" bodya="" bodyb="" stroke="#fff" transform="rotate(7.6179633140563965 1000.0000610351562,809.4389038085934) "></path><path fill="none" stroke-width="5" stroke-opacity="null" fill-opacity="null" d="M1005.5487043715818,479.66828408529034 C1005.5487043715818,479.66828408529034 1003.9386823934944,704.266275041772 1003.9386823934944,704.266275041772 C1003.9386823934944,704.266275041772 1051.4343144456136,705.0712860308159 1051.4343144456136,705.0712860308159 C1051.4343144456136,705.0712860308159 1050.6293045433342,573.0495272982057 1050.6293045433342,573.0495272982057 C1050.6293045433342,573.0495272982057 1127.9103334091953,573.8545382872495 1127.9103334091953,573.8545382872495 C1127.9103334091953,573.8545382872495 1127.1053224201514,704.266275041772 1127.1053224201514,704.266275041772 C1127.1053224201514,704.266275041772 1173.7959445699912,705.0712860308159 1173.7959445699912,705.0712860308159 C1173.7959445699912,705.0712860308159 1173.7959445699912,573.8545382872495 1173.7959445699912,573.8545382872495 C1173.7959445699912,573.8545382872495 1618.9668715377356,573.8545382872495 1618.9668715377356,573.8545382872495 C1618.9668715377356,573.8545382872495 1620.576893515823,478.86327309624653 1620.576893515823,478.86327309624653 C1620.576893515823,478.86327309624653 1005.5487043715818,479.66828408529034 1005.5487043715818,479.66828408529034 z" id="svg_11" stroke-dasharray="10,10" static="false" category="hints" sensor="false" opacity="0.2" stroke="#fff"></path>
*/