"use strict";

var RobotsRadar = (function() {

    var scanForRobots = function(robotIndex) {
        //var tankBody = RobotsData.robotBodyImages[robotIndex];
        //var tankPosition = tankBody.getCenter();
        // console.log(`scanning for robots: `, robotIndex);

        // var tankPosition = RobotsData.getPosition(robotIndex);
        var tankPositionX = RobotsData.positionXs[robotIndex];
        var tankPositionY = RobotsData.positionYs[robotIndex];
        var radarAngle = RobotsData.radarAngles[robotIndex];
        var radarMaxScanDistance = RobotsData.radarMaxScanDistance[robotIndex];
        var radarFOVAngle = RobotsData.radarFOVAngles[robotIndex];

        // todo: change to *0.5 instead of /2
        var radarStartAngle = Phaser.Math.DegToRad(radarAngle - radarFOVAngle / 2);
        var radarEndAngle = Phaser.Math.DegToRad(radarAngle + radarFOVAngle / 2);

        var scannedRobots = [];

        var totalRobots = RobotsData.totalRobots;
        for (let i = 0; i < totalRobots; i++) {
            // Skip scanning the current tank
            if (i === robotIndex) {
                continue;
            }

            //var otherTank = RobotsData.robotBodyImages[i];
            //var otherTankPosition = otherTank.getCenter();
            // var otherTankPosition = RobotsData.getPosition(i);
            var otherTankPositionX = RobotsData.positionXs[i];
            var otherTankPositionY = RobotsData.positionYs[i];
            // var distance = Phaser.Math.Distance.BetweenPoints(tankPosition, otherTankPosition);
            var distance = Phaser.Math.Distance.Between(tankPositionX, tankPositionY, otherTankPositionX, otherTankPositionY);
            //var distance = tankPosition - otherTankPosition;
            //console.log('distance', distance);

            if (distance > radarMaxScanDistance) {
                continue;
            }

            // var angleBetween = Phaser.Math.Angle.BetweenPoints(tankPosition, otherTankPosition);
            var angleBetween = Phaser.Math.Angle.Between(tankPositionX, tankPositionY, otherTankPositionX, otherTankPositionY);
            if (angleBetween >= radarStartAngle && angleBetween <= radarEndAngle) {
                scannedRobots.push({
                    index: i,
                    distance: distance
                });
            }
        }

        // Sort scannedRobots by distance
        scannedRobots.sort(function(a, b) {
            return a.distance - b.distance;
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

            RobotsData.radarGraphics[index] = radarGraphics;
            RobotsData.radarAngles[index] = 0;
            RobotsData.radarFOVAngles[index] = 45;
            RobotsData.radarMaxScanDistance[index] = 200;
        },
        scanForRobots: scanForRobots,
        drawRadarArc: function(robotIndex) {
            var radarGraphics = RobotsData.radarGraphics[robotIndex];
            var radarFOVAngle = RobotsData.radarFOVAngles[robotIndex];
            var radarMaxScanDistance = RobotsData.radarMaxScanDistance[robotIndex];
            var radarAngle = RobotsData.radarAngles[robotIndex];

            var tankPositionX = RobotsData.positionXs[robotIndex];
            var tankPositionY = RobotsData.positionYs[robotIndex];

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

            /******************************/
            RobotsData.radarAngles[robotIndex] += 1;
            /******************************/
        }
    };

    return obj;
}());
