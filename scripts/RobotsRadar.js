"use strict";

var RobotsRadar = (function() {

    var obj = {
        createRadar: function(index) {
            var game = GameContextHolder.game;

            var radarGraphics = new Phaser.GameObjects.Graphics(game.scene.scenes[0]);
            game.scene.scenes[0].add.existing(radarGraphics);

            RobotsData.radarGraphics[index] = radarGraphics;
            RobotsData.radarAngles[index] = 0;
            RobotsData.radarMaxRotation[index] = 45;
            RobotsData.radarMaxScanDistance[index] = 200;
        },
        drawRadarArc: function(robotIndex) {
            var tankBody = RobotsData.robotBodyImages[robotIndex];
            var radarGraphics = RobotsData.radarGraphics[robotIndex];
            var radarMaxRotation = RobotsData.radarMaxRotation[robotIndex];
            var radarMaxScanDistance = RobotsData.radarMaxScanDistance[robotIndex];
            var radarAngle = RobotsData.radarAngles[robotIndex];

            var tankPosition = tankBody.getCenter();

            radarGraphics.clear();
            radarGraphics.lineStyle(1, 0x00ff00, 0.5);
            radarGraphics.fillStyle(0x00ff00, 0.2);

            radarGraphics.beginPath();
            radarGraphics.moveTo(tankPosition.x, tankPosition.y);
            radarGraphics.arc(tankPosition.x,
                tankPosition.y,
                radarMaxScanDistance,
                Phaser.Math.DegToRad(radarAngle - radarMaxRotation / 2),
                Phaser.Math.DegToRad(radarAngle + radarMaxRotation / 2));
            radarGraphics.closePath();
            radarGraphics.fillPath();
            radarGraphics.strokePath();

            /******************************/
            RobotsData.radarAngles[robotIndex] += 1;
            /******************************/
        }
    };

    return obj;
}());
