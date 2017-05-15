LevelSelector.getLevels().push({
    title: 'Golf',
    description: 'Lleva la pelota al vaso',
    bodies: [{
        "label": "ball",
        "type": "circle",
        "position": [-4.05, 3.26],
        "isStatic": false,
        "isSensor": false,
        "radio": 0.43636393547058105
    }, {
        "label": "base",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-5.050379625680562, 7.670504794908934],
            [-2.9857705669773704, 7.670504794908934],
            [-2.9857705669773704, 6.956631377388393],
            [-5.050379625680562, 6.956631377388393]
        ]
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-4.2668767999999995, 1.8814785999999994],
            [-4.2740195000000005, 1.145780199999999],
            [-4.281162, 1.1457802999999984],
            [-0.06696789999999986, 1.1314948000000005],
            [-0.06696789999999986, 1.1243520999999994],
            [-0.06696789999999986, 1.1172093999999984],
            [1.3615726000000006, 2.2814698999999994],
            [1.3544301, 2.2814698999999994],
            [0.8544406999999996, 2.8671714999999995],
            [0.8472982000000009, 2.8671714999999995],
            [-0.3955321999999999, 1.8743359000000002],
            [-0.4026745999999992, 1.8743359000000002]
        ]
    }, {
        "label": "glass",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [4.014999505044443, 2.2193356730768947],
            [5.572294445639676, 0.64114420133264],
            [7.403418940628907, 2.4526038227471396],
            [5.841065840756974, 4.021223414019662],
            [5.562734416294038, 3.7374159320370204],
            [6.676200375205525, 2.2709545431488394],
            [5.759946106149176, 1.362251526148036],
            [4.296527174804185, 2.4925549935432088]
        ]
    }, {
        "label": "sensor",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": true,
        "vertices": [
            [6.023052206385589, 3.2675986488647695],
            [6.86996136503069, 2.430613650344375],
            [5.591909616897883, 1.1374079983560055],
            [4.745000458252784, 1.9743929968764018]
        ]
    }],
    tacks: [{
        "label": "untitled-shape",
        "position": [-4.11, 7.31],
        "bodyA": "base",
        "bodyB": "null"
    }],
    hints: [{
        "label": "hammer",
        "position": [0, 0],
        "vertices": [
            [-7.146852425390625, 11.93627218380432],
            [-7.146852125390625, 10.35832538380432],
            [-4.633146025390624, 10.35832538380432],
            [-4.6790166253906245, 6.62446268380432],
            [-3.440511825390624, 6.60611448380432],
            [-3.4863823253906254, 11.93627218380432],
            [-7.146852425390625, 11.93627218380432]
        ],
        "opacity": "0.2"
    }],
    decorations: [],
    setup: function(context) {
        /* your code goes here */
        context.gameover = false;
        context.ball = Physics.getBodyByLabel("ball");
        context.spawner = Physics.getPosition(context.ball);
        context.ball.mass *= 0.7;
        Physics.on("beginContact", function(e) {
            var a = Physics.getLabel(e.bodyA);
            var b = Physics.getLabel(e.bodyB);
            if (b == "sensor" && a == "ball") {
                Screen.setTitleText("Buen trabajo!");
                context.gameover = true;
            }
        });
    },
    update: function(context) {
        if (Physics.getPosition(context.ball)[1] >= 100) {
            Physics.setPosition(context.ball, context.spawner);
            Physics.clearForces(context.ball);
        }
        return context.gameover;
    },
});


/*
 Generated from SVG: 
<title style="pointer-events:inherit">Layer 1</title><path fill="none" stroke="#fff" stroke-width="5" stroke-opacity="null" fill-opacity="null" d="M285.31475746093747,42.37278161956786 L285.3147874609375,200.16746161956786 L536.6853974609376,200.16746161956786 L532.0983374609375,573.5537316195679 L655.9488174609376,575.3885516195679 L651.3617674609375,42.37278161956786 L285.31475746093747,42.37278161956786 z" id="svg_18" stroke-dasharray="10,10" static="false" category="hints" sensor="false" opacity="0.2" label="hammer" bodya="" bodyb=""></path><path fill="url(#diagonal-stripe-1)" fill-opacity="null" stroke-width="5" stroke-linejoin="null" stroke-linecap="null" stroke-opacity="null" d="M494.9620374319438,468.9495205091065 L701.422943302263,468.9495205091065 L701.422943302263,540.3368622611606 L494.9620374319438,540.3368622611606 L494.9620374319438,468.9495205091065 z" id="svg_4" stroke-dasharray="none" static="true" category="bodies" sensor="false" opacity="1.0" label="base" bodya="" bodyb="" stroke="#fff"></path><path fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" stroke-opacity="null" fill-opacity="null" d="M573.31232,1047.85214C573.31232,1047.85214 572.59805,1121.42198 571.8838,1121.42197C572.59805,1121.42198 993.30321,1122.85052 993.30321,1123.56479C993.30321,1124.27906 1136.15726,1007.85301 1135.44301,1007.85301C1136.15726,1007.85301 1085.44407,949.28285 1084.72982,949.28285C1085.44407,949.28285 960.44678,1048.56641 959.73254,1048.56641C960.44678,1048.56641 573.31232,1047.85214 573.31232,1047.85214z" id="svg_10" stroke-dasharray="none" static="true" category="bodies" sensor="false" opacity="1.0"></path><ellipse fill="none" stroke-width="5" stroke-opacity="null" fill-opacity="null" cx="589.8121484958863" cy="505.22748092456493" id="svg_6" rx="15" ry="15" stroke-dasharray="none" static="false" category="tacks" sensor="false" opacity="1.0" label="untitled-shape" bodya="base" bodyb="" stroke="#fff"></ellipse><path fill="url(#diagonal-stripe-1)" stroke-width="5" stroke-opacity="null" fill-opacity="null" d="M1442.2493275069428,891.6609382856739 C1442.2493275069428,891.6609382856739 1442.2493275069428,1113.3782324575495 1442.2493275069428,1113.3782324575495 C1442.2493275069428,1113.3782324575495 1699.8224675069428,1113.0521769594561 1699.8224675069428,1113.0521769594561 C1699.8224675069428,1113.0521769594561 1698.7901175069428,891.6609382856739 1698.7901175069428,891.6609382856739 C1698.7901175069428,891.6609382856739 1659.0443575069428,892.3130492818606 1659.0443575069428,892.3130492818606 C1659.0443575069428,892.3130492818606 1635.3001375069427,1074.9037568333042 1635.3001375069427,1074.9037568333042 C1635.3001375069427,1074.9037568333042 1506.2554775069427,1075.2298123313976 1506.2554775069427,1075.2298123313976 C1506.2554775069427,1075.2298123313976 1481.4789075069427,891.9869937837673 1481.4789075069427,891.9869937837673 C1481.4789075069427,891.9869937837673 1442.2493275069428,891.6609382856739 1442.2493275069428,891.6609382856739 z" id="svg_7" stroke-dasharray="none" static="true" category="bodies" sensor="false" opacity="1.0" label="glass" bodya="" bodyb="" stroke="#fff" transform="rotate(-44.61815643310547 1571.035034179688,1002.5198974609377) "></path><ellipse fill="none" stroke-width="5" stroke-opacity="null" fill-opacity="null" cx="595.9434576320514" cy="910.3080475766949" id="svg_5" rx="43.636393547058105" ry="43.636393547058105" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0" label="ball" bodya="" bodyb="" stroke="#fff"></ellipse><path fill="url(#diagonal-stripe-1)" fill-opacity="null" stroke-width="5" stroke-linejoin="null" stroke-linecap="null" stroke-opacity="null" d="M1521.2124193668476,924.8403707516934 L1640.2837849735768,924.8403707516934 L1640.2837849735768,1106.658882714584 L1521.2124193668476,1106.658882714584 L1521.2124193668476,924.8403707516934 z" id="svg_13" stroke-dasharray="none" static="true" category="bodies" sensor="true" opacity="0.2" transform="rotate(44.66232681274414 1580.748046875,1015.7496337890624) " label="sensor" bodya="" bodyb="" stroke="#fff"></path>
*/