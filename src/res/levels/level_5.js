LevelSelector.getLevels().push({
    title: 'Golf',
    description: 'Haz un hoyo en uno',
    bodies: [{
        "label": "floating-rock",
        "type": "Polygon",
        "position": [-1.83, 6.730000000000001],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-1.12, -0.47000000000000003],
            [-1.12, 0.47000000000000003],
            [1.12, 0.47000000000000003],
            [1.12, -0.47000000000000003]
        ]
    }, {
        "label": "sensor",
        "type": "Polygon",
        "position": [7.28, 3.19],
        "isStatic": true,
        "isSensor": true,
        "vertices": [
            [-0.46, -0.4],
            [-0.46, 0.4],
            [0.46, 0.4],
            [0.46, -0.4]
        ]
    }, {
        "label": "ball",
        "type": "circle",
        "position": [-1.8100000000000005, 3.4000000000000004],
        "isStatic": false,
        "isSensor": false,
        "radio": 0.37692360547112197
    }, {
        "label": "untitled-shape",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-11.1461554, 2.784614900000001],
            [-0.43076819999999927, 2.718460500000001],
            [5.723078599999999, 3.9799991000000006],
            [6.646155700000001, 3.9799991000000006],
            [6.646155700000001, 2.656922],
            [7.953848100000002, 2.6497791],
            [7.930221799999998, 4.030000000000001],
            [10.553848400000003, 4.0261529],
            [10.538463799999999, -0.3430782999999984],
            [-11.1692309, -0.37384749999999833],
            [-11.1000016, 2.5076918]
        ]
    }],
    tacks: [{
        "label": "untitled-shape",
        "position": [-1.8100000000000005, 6.700000000000001],
        "bodyA": "floating-rock",
        "bodyB": "null"
    }],
    hints: [{
        "label": "hint1",
        "position": [0, 0],
        "vertices": [
            [-2.362618504081744, 5.895811351605377],
            [-2.3507523508238224, 8.486514005465876],
            [-3.5608866102684216, 8.486514005465876],
            [-3.5846147330026277, 10.02835786988718],
            [-1.021977477708182, 9.987783031349776],
            [-1.1406180913792223, 5.8085746619972936],
            [-2.362618504081744, 5.895811351605377]
        ],
        "opacity": "0.5"
    }],
    decorations: [],
    setup: function(context) {
        /* your code goes here */
        context.gameover = false;
        Physics.on("beginContact", function(event) {
            var bodyA = Physics.getLabel(event.bodyA);
            var bodyB = Physics.getLabel(event.bodyB);
            if (bodyA == "sensor" || bodyB == "sensor") {
                if (bodyA == "ball" || bodyB == "ball") {
                    context.gameover = true;
                    Screen.setTitleText("bien hecho!");
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
<svg id="svgcontent" width="1199.9993775097607" height="741.5996153010321" x="247.50031124511963" y="69.20019234948393" overflow="hidden" xmlns="http://www.w3.org/2000/svg" xmlns:se="http://svg-edit.googlecode.com" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 2000 1236"><!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --><g style="pointer-events:none"><title style="pointer-events:inherit">background</title><image x="0" y="0" width="2002" height="1238" id="canvas_background" fill="#000" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./images/chalkboard.png" style="pointer-events:inherit"/><g id="canvasGrid" width="100%" height="100%" x="0" y="0" overflow="visible" display="none"><rect width="100%" height="100%" x="0" y="0" stroke-width="0" stroke="none" fill="url(#gridpattern)" style="pointer-events: none; display:visible;"/></g></g><g style="pointer-events:all"><title style="pointer-events:inherit">Layer 1</title><path fill="url(#diagonal-stripe-1)" stroke="#fff" stroke-width="5" stroke-opacity="null" fill-opacity="null" d="M-114.61554,959.53851L956.92318,966.15395L1572.30786,840.00009L1664.61557,840.00009L1664.61557,972.3078L1795.38481,973.02209L1793.02218,835L2055.38484,835.38471L2053.84638,1272.30783L-116.92309,1275.38475L-110.00016,987.23082z" id="svg_2" stroke-dasharray="none" static="true" category="bodies" sensor="false" opacity="1.0"/><rect fill="url(#diagonal-stripe-1)" stroke-width="5" stroke-opacity="null" fill-opacity="null" x="705.1647628039004" y="518.219509419418" width="224.61540900176396" height="95.38462697897057" id="svg_3" stroke-dasharray="none" static="true" category="bodies" sensor="false" opacity="1.0" stroke="#fff" label="floating-rock" bodyA="" bodyB=""/><path fill="none" stroke-width="5" stroke-opacity="null" fill-opacity="null" opacity="0.5" d="M763.7381495918256,648.4188648394623 L764.9247649176177,389.3485994534124 L643.9113389731579,389.3485994534124 L641.5385266997372,235.16421301128207 L897.8022522291818,239.22169686502247 L885.9381908620777,657.1425338002707 L763.7381495918256,648.4188648394623 z" id="svg_7" stroke-dasharray="10,10" static="false" category="hints" sensor="false" label="hint1" bodyA="" bodyB="" stroke="#fff"/><ellipse fill="none" stroke-width="5" stroke-opacity="null" fill-opacity="null" cx="819.6702642530628" cy="568.2195216674563" id="svg_4" rx="12.967028613325775" ry="13.076924116274975" stroke-dasharray="none" static="false" category="tacks" sensor="false" opacity="1.0" label="untitled-shape" bodyA="floating-rock" bodyB="" stroke="#fff"/><ellipse fill="none" stroke-width="5" stroke-opacity="null" fill-opacity="null" cx="819.9999117519827" cy="898.0000040318971" id="svg_5" rx="37.692360547112195" ry="36.92313116582533" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0" label="ball" bodyA="" bodyB="" stroke="#fff"/><rect fill="url(#diagonal-stripe-1)" stroke-width="5" stroke-opacity="null" fill-opacity="null" x="1682.307723448188" y="879.5385284372913" width="93.84616525350339" height="80.00000963259848" id="svg_6" stroke-dasharray="none" static="true" category="bodies" sensor="true" opacity="0.2" stroke="#fff" label="sensor" bodyA="" bodyB=""/></g></svg>
*/