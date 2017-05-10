LevelSelector.getLevels().push({
    title: 'Los abismos',
    description: 'Lleva la pelota al hoyo derecho',
    bodies: [{
        "label": "untitled-shape",
        "type": "polygon",
        "position": [-9.25, 1.8799999999999986],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-3.79, -2.11],
            [-3.79, 2.11],
            [3.79, 2.11],
            [3.79, -2.11]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0.6800000000000006, 1.8699999999999988],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-3.79, -2.11],
            [-3.79, 2.11],
            [3.79, 2.11],
            [3.79, -2.11]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [10.649999999999999, 1.8799999999999986],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-3.79, -2.11],
            [-3.79, 2.11],
            [3.79, 2.11],
            [3.79, -2.11]
        ]
    }, {
        "label": "sensor",
        "type": "polygon",
        "position": [5.690000000000001, 2.0899999999999994],
        "isStatic": true,
        "isSensor": true,
        "vertices": [
            [-0.74, -1.1],
            [-0.74, 1.1],
            [0.74, 1.1],
            [0.74, -1.1]
        ]
    }, {
        "label": "ball",
        "type": "circle",
        "position": [-4.11, 11.42],
        "isStatic": false,
        "isSensor": false,
        "radio": 0.4454545285279036
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
        "position": [5.68, 7.96],
        "vertices": [
            [-0.49, -0.22],
            [-0.49, 0.22],
            [0.49, 0.22],
            [0.49, -0.22],
            [-0.49, -0.22]
        ],
        "opacity": "0.1"
    }, {
        "label": "untitled-shape",
        "position": [5.67, 8.45],
        "vertices": [
            [-0.49, -0.11],
            [-0.49, 0.11],
            [0.49, 0.11],
            [0.49, -0.11],
            [-0.49, -0.11]
        ],
        "opacity": "0.1"
    }, {
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
                    Screen.setTitleText("Buen trabajo!");
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
<title style="pointer-events:inherit">Layer 1</title><rect fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" x="-304.5455316131761" y="837.9999931442844" width="758.1818317963362" height="423.6363712435166" id="svg_2" stroke-dasharray="none" static="true" category="bodies" sensor="false" opacity="1.0"></rect><rect fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" x="689.9999205047438" y="838.0000292646992" width="758.1818317963362" height="423.6363712435166" id="svg_4" stroke-dasharray="none" static="true" category="bodies" sensor="false" opacity="1.0"></rect><rect fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" x="1686.3635355407546" y="837.9999958860981" width="758.1818317963362" height="423.6363712435166" id="svg_6" stroke-dasharray="none" static="true" category="bodies" sensor="false" opacity="1.0"></rect><ellipse fill="none" stroke-width="5" cx="589.0908422978862" cy="94.3636108621731" id="svg_7" rx="44.54545285279036" ry="43.63636279435179" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0" stroke="#fff" label="ball" bodya="" bodyb=""></ellipse><rect fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" stroke-opacity="null" fill-opacity="null" x="1495.4544977874082" y="917.999998505026" width="149.09091176810443" height="220.00000395049574" id="svg_8" stroke-dasharray="none" static="true" category="bodies" sensor="true" opacity="0.2" label="sensor" bodya="" bodyb=""></rect><path fill="none" stroke="#fff" stroke-width="5" stroke-opacity="null" fill-opacity="null" opacity="0.2" d="M377.49989,396.1818C377.49989,396.1818 373.86352,661.63635 373.86352,661.63635C373.86352,661.63635 908.40899,656.1818 908.40899,656.1818C908.40899,656.1818 377.49989,396.1818 377.49989,396.1818z" id="svg_9" stroke-dasharray="10,10" static="false" category="hints" sensor="false"></path><path fill="none" stroke-width="5" stroke-dasharray="3,3" stroke-opacity="null" fill-opacity="null" d="M1474.4301587408468,579.8005574681873 L1570.2026724026482,675.5731012904282 C1570.731807144718,676.1022058720584 1666.5043208065194,580.3296922102567 1666.5043208065194,580.3296922102567 C1666.5043208065194,580.3296922102567 1618.8826162664336,579.8005574681873 1618.353496604584,579.2714528865571 C1618.8826162664336,579.8005574681873 1618.8826162664336,482.96978940246663 1618.353496604584,482.4406848208364 C1618.8826162664336,482.96978940246663 1522.0518482007128,483.4989090643163 1521.5227285388632,482.9698044826861 C1522.0518482007128,483.4989090643163 1521.522713458644,579.2714227261181 1520.993593796794,578.7423181444879 C1521.522713458644,579.2714227261181 1504.0547673957508,578.5684884542281 1474.4301587408468,579.8005574681873 z" id="svg_16" static="false" category="decorations" sensor="false" opacity="0.1" stroke="#fff"></path><rect fill="none" stroke-width="5" stroke-dasharray="3,3" stroke-opacity="null" fill-opacity="null" x="1519.933259151893" y="418.7243923409585" width="99.38650474957903" height="44.785276073619684" id="svg_17" static="false" category="decorations" sensor="false" opacity="0.1" stroke="#fff"></rect><rect fill="none" stroke-width="5" stroke-dasharray="3,3" stroke-opacity="null" fill-opacity="null" x="1518.7654714211992" y="380.1831454758046" width="99.38650474957903" height="23.312885263946185" id="svg_18" static="false" category="decorations" sensor="false" opacity="0.1" stroke="#fff"></rect>
*/