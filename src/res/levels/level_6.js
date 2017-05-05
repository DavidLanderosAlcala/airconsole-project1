LevelSelector.getLevels().push({
    title: 'Extraccion',
    description: 'Saca la pelota del hoyo',
    bodies: [{
        "label": "sensor",
        "type": "Polygon",
        "position": [-1.92, 6.510000000000001],
        "isStatic": true,
        "isSensor": true,
        "vertices": [
            [-0.84, -1.2],
            [-0.84, 1.2],
            [0.84, 1.2],
            [0.84, -1.2]
        ]
    }, {
        "label": "ball",
        "type": "circle",
        "position": [-1.9499999999999993, 6.48],
        "isStatic": false,
        "isSensor": false,
        "radio": 0.4916652143071458
    }, {
        "label": "platform1",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-12.225004, 6.665003700000001],
            [-2.6749982, 6.8250020000000005],
            [-2.6349982, 5.465001700000001],
            [-1.1749977999999999, 5.545001700000001],
            [-1.214997799999999, 6.785002],
            [0.3450026000000008, 6.8650020000000005],
            [0.5450026999999995, -1.0950001999999994],
            [-12.695001, -0.9950000999999986]
        ]
    }],
    tacks: [{
        "label": "untitled-shape",
        "position": [-0.3699999999999992, 5.8500000000000005],
        "bodyA": "platform1",
        "bodyB": "null"
    }],
    hints: [{
        "label": "untitled-shape",
        "position": [0, 0],
        "vertices": [
            [-2.8100010101316775, 3.9399993133544022],
            [2.1100004913336257, 8.64000074768101],
            [3.6100009490974347, 7.420000375366443],
            [2.3700005706793537, 5.999999942016701],
            [1.2100002166753399, 6.760000173950367],
            [-2.430000894164846, 3.559999197387567],
            [-2.8100010101316775, 3.9399993133544022]
        ],
        "opacity": "0.5"
    }],
    decorations: [],
    setup: function(context) {
        /* your code goes here */
        context.gameover = false;
        Physics.on("endContact", function(event) {
            var bodyA = Physics.getLabel(event.bodyA);
            var bodyB = Physics.getLabel(event.bodyB);
            if (bodyA == "sensor" || bodyB == "sensor") {
                if (bodyA == "ball" || bodyB == "ball") {
                    setTimeout(function() {
                        Screen.setTitleText("Excelente!");
                        context.gameover = true;
                    }, 500);
                }
            }
        });
    },
    update: function(context) {
        /* your code goes here */
        return context.gameover;
    },
});


/*
 Generated from SVG: 
<svg id="svgcontent" width="999.9997225702322" height="617.9998285484035" x="347.5001387148839" y="131.00008572579827" overflow="hidden" xmlns="http://www.w3.org/2000/svg" xmlns:se="http://svg-edit.googlecode.com" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 2000 1236"><!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --><g style="pointer-events:none"><title style="pointer-events:inherit">background</title><image x="0" y="0" width="2002" height="1238" id="canvas_background" fill="#000" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./images/chalkboard.png" style="pointer-events:inherit"/><g id="canvasGrid" width="100%" height="100%" x="0" y="0" overflow="visible" display="none"><rect width="100%" height="100%" x="0" y="0" stroke-width="0" fill="url(#gridpattern)" style="pointer-events: none; display:visible;"/></g></g><g style="pointer-events:all"><title style="pointer-events:inherit">Layer 1</title><path fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" stroke-opacity="null" fill-opacity="null" d="M-222.5004,571.49963L732.50018,555.4998L736.50018,691.49983L882.50022,683.49983L878.50022,559.4998L1034.50026,551.4998L1054.50027,1347.50002L-269.5001,1337.50001L-222.5004,571.49963z" id="svg_11" static="true" category="bodies" sensor="false" label="platform1" bodyA="" bodyB=""/><rect fill="url(#diagonal-stripe-1)" stroke-width="5" stroke-opacity="null" fill-opacity="null" x="724.5013155670574" y="467.3334051646051" width="168.33282729465787" height="241.66652668429674" id="svg_3" static="true" category="bodies" sensor="true" opacity="0.2" label="sensor" bodyA="" bodyB="" stroke="#fff"/><ellipse fill="none" stroke-width="5" stroke-opacity="null" fill-opacity="null" cx="805.6677205140702" cy="590.0001548073053" id="svg_2" rx="49.16652143071458" ry="49.999856136305056" static="false" category="bodies" sensor="false" label="ball" bodyA="" bodyB="" stroke="#fff"/><ellipse fill="none" stroke-width="5" stroke-opacity="null" fill-opacity="null" cx="963.9999895477456" cy="653.0000086351297" id="svg_12" rx="17.000005187989927" ry="15.000002849102872" static="false" category="tacks" sensor="false" stroke="#fff" label="untitled-shape" bodyA="platform1" bodyB=""/><path fill="none" stroke="#fff" stroke-width="5" stroke-opacity="null" fill-opacity="null" d="M718.9998989868322,844.0000686645599 C718.9998989868322,844.0000686645599 1211.0000491333626,373.9999252318991 1211.0000491333626,373.9999252318991 C1211.0000491333626,373.9999252318991 1361.0000949097434,495.99996246335576 1361.0000949097434,495.99996246335576 C1361.0000949097434,495.99996246335576 1237.0000570679354,638.00000579833 1237.0000570679354,638.00000579833 C1237.0000570679354,638.00000579833 1121.000021667534,561.9999826049634 1121.000021667534,561.9999826049634 C1121.000021667534,561.9999826049634 756.9999105835154,882.0000802612433 756.9999105835154,882.0000802612433 C756.9999105835154,882.0000802612433 718.9998989868322,844.0000686645599 718.9998989868322,844.0000686645599 z" id="svg_13" stroke-dasharray="10,10" static="false" category="hints" sensor="false" opacity="0.5"/></g></svg>
*/