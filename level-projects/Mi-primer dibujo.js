LevelSelector.getLevels().push({
    title: 'Mi primer dibujo',
    description: 'Dibuja una figura cualquiera',
    bodies: [{
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0.5499999999999989],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-11.71, -0.5],
            [-11.71, 0.5],
            [11.71, 0.5],
            [11.71, -0.5]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [-2.43, 3.2799999999999994],
        "isStatic": false,
        "isSensor": false,
        "vertices": [
            [0.10608970276926072, -1.0624711642987446],
            [-0.8143858673499487, 0.6905618430384579],
            [-0.10608970276926072, 1.0624711642987446],
            [0.8143858673499487, -0.6905618430384579]
        ]
    }, {
        "label": "untitled-shape",
        "type": "circle",
        "position": [-5.86, 3.039999999999999],
        "isStatic": false,
        "isSensor": false,
        "radio": 0.5500003356935644
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": false,
        "isSensor": false,
        "vertices": [
            [2.202343907282591, 2.2862384946775176],
            [1.3593243658957768, 3.9668139592709135],
            [4.910932211103063, 3.633502129454543]
        ]
    }],
    tacks: [],
    hints: [],
    decorations: [],
    setup: function(context) {
        /* your code goes here */
        context.gameover = false;
        Physics.on("addBody", function() {
            Screen.setTitleText("perfecto! ahora intenta borrarla con click derecho");
        });
        Physics.on("removeBody", function() {
            Screen.setTitleText("Buen trabajo");
            context.gameover = true;
        });
    },
    update: function(context) {
        /* your code goes here */
        return context.gameover;
    },
});


/*
 Generated from SVG: 
<title style="pointer-events:inherit">Layer 1</title><rect fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" style="pointer-events:inherit" x="-171.66736195923357" y="1131.833305867681" width="2343.334763591368" height="101.66672871911351" id="svg_1" stroke-dasharray="none" static="true" category="bodies" sensor="false" opacity="1.0"></rect><rect fill="none" stroke="#fff" stroke-width="5" x="717.4998520532439" y="809.6667965889869" width="81.6667165120748" height="198.3334543864671" id="svg_2" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0" transform="rotate(-27.7028865814209 758.3332519531255,908.8335571289064) "></rect><ellipse fill="none" stroke="#fff" stroke-width="5" style="pointer-events:inherit" cx="414.1663345334887" cy="932.166871134565" id="svg_3" rx="55.00003356935645" ry="54.166699727396576" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0"></ellipse><path fill="none" stroke="#fff" stroke-width="5" d="M1164.1667920430623,951.3335500082595 L1161.667357130214,763.3337861290197 L1466.6675376378312,948.3338956172464 L1164.1667920430623,951.3335500082595 z" id="svg_4" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0" transform="rotate(-25.87781524658203 1314.1673583984377,857.3336791992188) "></path>
*/