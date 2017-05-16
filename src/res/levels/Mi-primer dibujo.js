LevelSelector.getLevels().push({
    title: 'Mi primer dibujo',
    description: 'Dibuja una figura cualquiera',
    bodies: [{
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
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-11.716673583984376, 1.0416674804687496],
            [11.716673583984374, 1.0416674804687496],
            [11.716673583984374, 0.02500022888183473],
            [-11.716673583984376, 0.02500022888183473]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": false,
        "isSensor": false,
        "vertices": [
            [-3.239206698791863, 3.9598284346468695],
            [-2.516153913793171, 4.339486103220324],
            [-1.5941281776588134, 2.5835008261221155],
            [-2.3171809626575053, 2.2038431575486612]
        ]
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
            Screen.setSubtitleText("perfecto! ahora intenta borrarla con click derecho");
        });
        Physics.on("removeBody", function() {
            Screen.setSubtitleText("Buen trabajo");
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
<title style="pointer-events:inherit">Layer 1</title><path fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" stroke-linejoin="undefined" stroke-linecap="undefined" category="bodies" sensor="false" static="true" d="M-171.6673583984375,1131.833251953125 L2171.6673583984375,1131.833251953125 L2171.6673583984375,1233.4999771118164 L-171.6673583984375,1233.4999771118164 L-171.6673583984375,1131.833251953125 Z" id="svg_1" stroke-dasharray="none" opacity="1.0"></path><path fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="undefined" stroke-linecap="undefined" category="bodies" sensor="false" static="false" transform="rotate(-27.7028865814209 758.3332519531255,908.8334960937502) " d="M717.4998779296875,809.6668090820312 L799.1665954589844,809.6668090820312 L799.1665954589844,1008.0002593994141 L717.4998779296875,1008.0002593994141 L717.4998779296875,809.6668090820312 Z" id="svg_2" stroke-dasharray="none" opacity="1.0"></path><ellipse fill="none" stroke="#fff" stroke-width="5" style="pointer-events:inherit" cx="414.1663345334887" cy="932.166871134565" id="svg_3" rx="55.00003356935645" ry="54.166699727396576" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0"></ellipse><path fill="none" stroke="#fff" stroke-width="5" d="M1164.1667920430623,951.3335500082595 L1161.667357130214,763.3337861290197 L1466.6675376378312,948.3338956172464 L1164.1667920430623,951.3335500082595 z" id="svg_4" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0" transform="rotate(-25.87781524658203 1314.1673583984377,857.3336791992188) "></path>
*/