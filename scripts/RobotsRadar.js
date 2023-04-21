"use strict";

var RobotsRadar = (function() {

    var scanForRobots = function(robotIndex) {
        // console.log(`scanning for robots: `, robotIndex);

        var tankPositionX = RobotsData_CurrentData.positionXs[robotIndex];
        var tankPositionY = RobotsData_CurrentData.positionYs[robotIndex];
        var radarAngle = RobotsData_CurrentData.currentRadarAngles[robotIndex];
        var radarMaxScanDistance = RobotsData_Radar.radarMaxScanDistance[robotIndex];
        var radarFOVAngle = RobotsData_Radar.radarFOVAngles[robotIndex];

        // todo: change to *0.5 instead of /2
        var radarStartAngle = Phaser.Math.DegToRad(radarAngle - radarFOVAngle / 2);
        var radarEndAngle = Phaser.Math.DegToRad(radarAngle + radarFOVAngle / 2);

        var scannedRobots = [];

        var totalRobots = RobotManager.getTotalRobots();
        for (let i = 0; i < totalRobots; i++) {
            // Skip scanning the current tank
            if (i === robotIndex) {
                continue;
            }

            var otherTankPositionX = RobotsData_CurrentData.positionXs[i];
            var otherTankPositionY = RobotsData_CurrentData.positionYs[i];
            var distanceBetweenTanks = Phaser.Math.Distance.Between(tankPositionX, tankPositionY, otherTankPositionX, otherTankPositionY);
            //console.log('distanceBetweenTanks', distanceBetweenTanks);

            if (distanceBetweenTanks > radarMaxScanDistance) {
                console.log(`skipping `);
                continue;
            }

            // var angleBetween = Phaser.Math.Angle.BetweenPoints(tankPosition, otherTankPosition);
            var angleBetween = Phaser.Math.Angle.Between(tankPositionX, tankPositionY, otherTankPositionX, otherTankPositionY);
            if (angleBetween >= radarStartAngle && angleBetween <= radarEndAngle) {
                scannedRobots.push({
                    index: i,
                    distanceBetweenTanks: distanceBetweenTanks
                });
            }
        }

        // Sort scannedRobots by distanceBetweenTanks
        scannedRobots.sort(function(a, b) {
            return a.distanceBetweenTanks - b.distanceBetweenTanks;
        });

        if (scannedRobots.length > 0) {
            console.log(`[${robotIndex}] Scanned robots: ${scannedRobots.length}`);
        }

        //    // Trigger the custom event 'onScannedRobot' with the scannedRobots array
        //    if (scannedRobots.length > 0) {
        //        onScannedRobot(scannedRobots);
        //    }
        return scannedRobots;
    };

    var obj = {
        createRadar: function(index) {
            var game = GameContextHolder.game;

            var radarGraphics = new Phaser.GameObjects.Graphics(game.scene.scenes[0]);
            game.scene.scenes[0].add.existing(radarGraphics);

            RobotsData_Radar.radarGraphics[index] = radarGraphics;
            RobotsData_CurrentData.currentRadarAngles[index] = 0;
            RobotsData_Radar.radarFOVAngles[index] = 45;
            RobotsData_Radar.radarMaxScanDistance[index] = 200;
        },
        scanForRobots: scanForRobots,
        drawRadarArc: function(robotIndex) {
            var radarGraphics = RobotsData_Radar.radarGraphics[robotIndex];
            var radarFOVAngle = RobotsData_Radar.radarFOVAngles[robotIndex];
            var radarMaxScanDistance = RobotsData_Radar.radarMaxScanDistance[robotIndex];
            var radarAngle = RobotsData_CurrentData.currentRadarAngles[robotIndex];

            var tankPositionX = RobotsData_CurrentData.positionXs[robotIndex];
            var tankPositionY = RobotsData_CurrentData.positionYs[robotIndex];

            radarGraphics.clear();
            radarGraphics.lineStyle(1, 0x00ff00, 0.5);
            radarGraphics.fillStyle(0x00ff00, 0.2);

            radarGraphics.beginPath();
            radarGraphics.moveTo(tankPositionX, tankPositionY);
            radarGraphics.arc(tankPositionX,
                tankPositionY,
                radarMaxScanDistance,
                Phaser.Math.DegToRad(radarAngle - radarFOVAngle * 0.5),
                Phaser.Math.DegToRad(radarAngle + radarFOVAngle * 0.5));
            radarGraphics.closePath();
            radarGraphics.fillPath();
            radarGraphics.strokePath();
        }
    };

    return obj;
}());
