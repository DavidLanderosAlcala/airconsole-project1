LevelSelector.getLevels().push({
    title: 'Los abismos',
    description: 'Lleva la pelota al hoyo derecho',
    bodies: [{
        "label": "ball",
        "type": "circle",
        "position": [-4.11, 11.42],
        "isStatic": false,
        "isSensor": false,
        "radio": 0.4454545285279036
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
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
        "vertices": [
            [5.199332275390626, 8.172756042480469],
            [6.193197021484377, 8.172756042480469],
            [6.193197021484377, 7.724903259277343],
            [5.199332275390626, 7.724903259277343],
            [5.199332275390626, 8.172756042480469]
        ],
        "opacity": "1.0"
    }, {
        "label": "untitled-shape",
        "position": [0, 0],
        "vertices": [
            [5.1876550292968755, 8.558168640136717],
            [6.181519775390626, 8.558168640136717],
            [6.181519775390626, 8.325039672851561],
            [5.1876550292968755, 8.325039672851561],
            [5.1876550292968755, 8.558168640136717]
        ],
        "opacity": "1.0"
    }],
    setup: function(context) {
        /* your code goes here */
        context.gameover = false;
        context.ball = Physics.getBodyByLabel("ball");
        context.spawner = Physics.getPosition(context.ball);
        Physics.on("beginContact", function(event) {
            var bodyA = Physics.getLabel(event.bodyA);
            var bodyB = Physics.getLabel(event.bodyB);
            if (bodyA == "sensor" || bodyB == "sensor") {
                if (bodyA == "ball" || bodyB == "ball") {
                    Screen.setSubtitleText("Buen trabajo!");
                    context.gameover = true;
                }
            }
        });
    },
    update: function(context) {
        /* your code goes here */
        if (Physics.getPosition(context.ball)[1] > Screen.getHeight() + 50) {
            Physics.setPosition(context.ball, context.spawner);
            Physics.clearForces(context.ball);
        }
        return context.gameover;
    },
});


/*
 Generated from SVG: 
<title style="pointer-events:inherit">Layer 1</title><path fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" stroke-linejoin="undefined" stroke-linecap="undefined" category="bodies" sensor="false" static="true" d="M-304.5455322265625,838 L453.63629150390625,838 L453.63629150390625,1261.6363830566406 L-304.5455322265625,1261.6363830566406 L-304.5455322265625,838 Z" id="svg_2" stroke-dasharray="none" opacity="1.0"></path><path fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" stroke-linejoin="undefined" stroke-linecap="undefined" category="bodies" sensor="false" static="true" d="M689.9999389648438,838 L1448.1817626953125,838 L1448.1817626953125,1261.6363830566406 L689.9999389648438,1261.6363830566406 L689.9999389648438,838 Z" id="svg_4" stroke-dasharray="none" opacity="1.0"></path><path fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" stroke-linejoin="undefined" stroke-linecap="undefined" opacity="1.0" category="bodies" sensor="false" static="true" d="M1686.363525390625,838 L2444.5453491210938,838 L2444.5453491210938,1261.6363830566406 L1686.363525390625,1261.6363830566406 L1686.363525390625,838 Z" id="svg_6" stroke-dasharray="none"></path><ellipse fill="none" stroke-width="5" cx="589.0908422978862" cy="94.3636108621731" id="svg_7" rx="44.54545285279036" ry="43.63636279435179" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0" stroke="#fff" label="ball" bodya="" bodyb=""></ellipse><path fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" stroke-dasharray="none" stroke-linejoin="undefined" stroke-linecap="undefined" label="sensor" category="bodies" sensor="true" static="true" d="M1495.4544677734375,918 L1644.5453796386719,918 L1644.5453796386719,1138 L1495.4544677734375,1138 L1495.4544677734375,918 Z" id="svg_8" opacity="0.2"></path><path fill="none" stroke="#fff" stroke-width="5" stroke-opacity="null" fill-opacity="null" opacity="0.2" d="M377.49989,396.1818C377.49989,396.1818 373.86352,661.63635 373.86352,661.63635C373.86352,661.63635 908.40899,656.1818 908.40899,656.1818C908.40899,656.1818 377.49989,396.1818 377.49989,396.1818z" id="svg_9" stroke-dasharray="10,10" static="false" category="hints" sensor="false"></path><path fill="none" stroke-width="5" stroke-dasharray="3,3" stroke-opacity="null" fill-opacity="null" d="M1474.4301587408468,579.8005574681873 L1570.2026724026482,675.5731012904282 C1570.731807144718,676.1022058720584 1666.5043208065194,580.3296922102567 1666.5043208065194,580.3296922102567 C1666.5043208065194,580.3296922102567 1618.8826162664336,579.8005574681873 1618.353496604584,579.2714528865571 C1618.8826162664336,579.8005574681873 1618.8826162664336,482.96978940246663 1618.353496604584,482.4406848208364 C1618.8826162664336,482.96978940246663 1522.0518482007128,483.4989090643163 1521.5227285388632,482.9698044826861 C1522.0518482007128,483.4989090643163 1521.522713458644,579.2714227261181 1520.993593796794,578.7423181444879 C1521.522713458644,579.2714227261181 1504.0547673957508,578.5684884542281 1474.4301587408468,579.8005574681873 z" id="svg_16" static="false" category="decorations" sensor="false" opacity="0.1" stroke="#fff"></path><path fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="3,3" stroke-linejoin="undefined" stroke-linecap="undefined" category="decorations" sensor="false" static="false" d="M1519.9332275390625,418.7243957519531 L1619.3197021484375,418.7243957519531 L1619.3197021484375,463.5096740722656 L1519.9332275390625,463.5096740722656 L1519.9332275390625,418.7243957519531 Z" id="svg_17" opacity="1.0"></path><path fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="undefined" stroke-linecap="undefined" category="decorations" sensor="false" static="false" d="M1518.7655029296875,380.1831359863281 L1618.1519775390625,380.1831359863281 L1618.1519775390625,403.49603271484375 L1518.7655029296875,403.49603271484375 L1518.7655029296875,380.1831359863281 Z" id="svg_18" stroke-dasharray="3,3" opacity="1.0"></path>
*/