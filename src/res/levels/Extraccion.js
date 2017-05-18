LevelManager.getLevels().push({
    title: 'Extraccion',
    description: 'Saca la pelota del hoyo',
    bodies: [{
        "label": "ball",
        "type": "circle",
        "position": [0, 8.629999999999999],
        "isStatic": false,
        "isSensor": false,
        "radio": 0.591668990748042
    }, {
        "label": "base",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": false,
        "vertices": [
            [-2.772303660785294, 7.256428707157941],
            [-0.7654869607852941, 7.250220485705584],
            [-0.8206571607852933, 5.772668821304275],
            [-0.3034363607852928, 5.418801368812344],
            [0.28274713921470784, 5.443634164599278],
            [0.7723827392147058, 5.729211451182764],
            [0.7999678392147054, 7.225387689918651],
            [2.7929918392147055, 7.275053281492517],
            [2.7998881392147066, 4.586902484893814],
            [-2.799888560785293, 4.568277910559239]
        ]
    }, {
        "label": "sensor",
        "type": "polygon",
        "position": [0, 0],
        "isStatic": true,
        "isSensor": true,
        "vertices": [
            [-1.2083386282580229, 6.813336082935493],
            [1.3416714771132625, 6.813336082935493],
            [1.3416714771132625, 5.296663448079416],
            [-1.2083386282580229, 5.296663448079416]
        ]
    }],
    tacks: [{
        "label": "untitled-shape",
        "position": [1.9000000000000004, 6.119999999999999],
        "bodyA": "base",
        "bodyB": "null"
    }],
    hints: [{
        "label": "untitled-shape",
        "position": [0, 0],
        "vertices": [
            [0.4618157876872253, 2.8296666751018957],
            [2.104670199954098, 7.800143405967123],
            [2.844905772218297, 9.75324284044008],
            [6.009240736413748, 8.670464618536684],
            [5.215847569113452, 6.240781015376664],
            [2.664579703308574, 7.15852899827956],
            [1.0744869982920253, 2.6295023147554524],
            [1.0639869346975228, 2.633134682720213],
            [0.7715533410441484, 2.688434316986207],
            [0.4618157876872253, 2.8296666751018957]
        ],
        "opacity": "0.5"
    }],
    decorations: [],
    setup: function(context) {
        Physics.on("endContact", function(e) {

            if (Physics.getLabel(e.bodyA) == "sensor") {
                if (Physics.getLabel(e.bodyB) == "ball") {
                    context.gameover = true;
                    Screen.setSubtitleText("Excelente!");
                }
            }
        });
        context.gameover = false;
    },
    update: function(context) {
        return context.gameover;
    },
});


/*
 Generated from SVG: 
<title style="pointer-events:inherit">Layer 1</title><path fill="url(#diagonal-stripe-1)" stroke-width="5" stroke-opacity="null" fill-opacity="null" d="M722.7696339214706,510.3571292842058 L923.4513039214706,510.97795142944153 L917.9342839214706,658.7331178695724 L969.6563639214706,694.1198631187655 L1028.2747139214707,691.6365835400721 L1077.2382739214706,663.0788548817235 L1079.9967839214705,513.4612310081349 L1279.2991839214706,508.4946718507482 L1279.9888139214706,777.3097515106185 L720.0111439214706,779.172208944076 L722.7696339214706,510.3571292842058 z" id="svg_9" stroke-dasharray="none" static="true" category="bodies" sensor="false" opacity="1.0" stroke="#fff" label="base" bodya="" bodyb=""></path><ellipse fill="none" stroke-width="5" stroke-opacity="null" fill-opacity="null" cx="1000.0000020952268" cy="373.16952543338266" id="svg_10" rx="59.166899074804206" ry="60.169727872682095" stroke-dasharray="none" static="false" category="bodies" sensor="false" opacity="1.0" stroke="#fff" label="ball" bodya="" bodyb=""></ellipse><ellipse fill="none" stroke="#fff" stroke-width="5" stroke-opacity="null" fill-opacity="null" cx="1190.0007073563336" cy="624.6666696161813" id="svg_11" rx="14.166723098623038" ry="15.000059751483263" stroke-dasharray="none" static="false" category="tacks" sensor="false" opacity="1.0" label="untitled-shape" bodya="base" bodyb=""></ellipse><path fill="url(#diagonal-stripe-1)" fill-opacity="null" stroke-width="5" stroke-dasharray="none" stroke-linejoin="null" stroke-linecap="null" stroke-opacity="null" d="M879.1661371741976,554.6663917064507 L1134.1671477113262,554.6663917064507 L1134.1671477113262,706.3336551920584 L879.1661371741976,706.3336551920584 L879.1661371741976,554.6663917064507 z" id="svg_13" static="true" category="bodies" sensor="true" opacity="0.2" stroke="#fff" label="sensor" bodya="" bodyb=""></path><path fill="none" stroke="#fff" stroke-width="5" stroke-opacity="null" fill-opacity="null" d="M1156.6662185559082,1027.7774212353515 C1149.444008555908,504.33312123535154 1155.5551085559082,295.5554512353516 1155.5551085559082,295.5554512353516 C1155.5551085559082,295.5554512353516 1489.9994385559082,294.44434123535154 1489.9994385559082,294.44434123535154 C1489.9994385559082,294.44434123535154 1494.4438785559082,549.9998112353516 1494.4438785559082,549.9998112353516 C1494.4438785559082,549.9998112353516 1223.3328685559081,546.6664812353515 1223.3328685559081,546.6664812353515 C1223.3328685559081,546.6664812353515 1221.1106385559083,1026.6663112353517 1219.999578555908,1026.6662712353516 C1221.1106385559083,1026.6663112353517 1190.5551085559082,1030.9996012353515 1156.6662185559082,1027.7774212353515 z" id="svg_7" stroke-dasharray="10,10" static="false" category="hints" sensor="false" opacity="0.5" transform="rotate(19.08036994934082 1323.792236328124,661.7066650390625) "></path>
*/