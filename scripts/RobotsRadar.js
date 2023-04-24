"use strict";

const RobotsRadar = (function() {

    const isRadarEnabled = function(robotIndex) {
        const api = RobotsData_Instance.robotAPIs[robotIndex];
        return api.radarEnabled;
    };

    const scanForRobots = function(robotIndex) {
        const radarEnabled = isRadarEnabled(robotIndex);
        if (!radarEnabled) {
            return [];
        }

        // console.log(`scanning for robots: `, robotIndex);

        const robotPositionX = RobotsData_CurrentData.positionXs[robotIndex];
        const robotPositionY = RobotsData_CurrentData.positionYs[robotIndex];
        const radarAngle = RobotsData_CurrentData.currentRadarAngles[robotIndex];
        const radarMaxScanDistance = RobotsData_Radar.radarMaxScanDistance[robotIndex];
        const radarFOVAngle = RobotsData_Radar.radarFOVAngles[robotIndex];

        //console.log('robotPositionX:', robotPositionX);
        //console.log('robotPositionY:', robotPositionY);
        //console.log('radarAngle:', radarAngle);
        //console.log('radarMaxScanDistance:', radarMaxScanDistance);
        //console.log('radarFOVAngle:', radarFOVAngle);

        const radarStartAngle = Phaser.Math.DegToRad(radarAngle - radarFOVAngle * 0.5);
        const radarEndAngle = Phaser.Math.DegToRad(radarAngle + radarFOVAngle * 0.5);

        //console.log('radarStartAngle:', radarStartAngle);
        //console.log('radarEndAngle:', radarEndAngle);

        const scannedRobots = [];

        const totalRobots = RobotManager.getTotalRobots();
        for (let i = 0; i < totalRobots; i++) {
            if (i === robotIndex) {
                continue;
            }

            const otherRobotPositionX = RobotsData_CurrentData.positionXs[i];
            const otherRobotPositionY = RobotsData_CurrentData.positionYs[i];
            const distanceBetweenRobots = Phaser.Math.Distance.Between(robotPositionX, robotPositionY, otherRobotPositionX, otherRobotPositionY);

            //console.log(`otherRobotPositionX [${i}]:`, otherRobotPositionX);
            //console.log(`otherRobotPositionY [${i}]:`, otherRobotPositionY);
            //console.log(`distanceBetweenRobots [${i}]:`, distanceBetweenRobots);

            if (distanceBetweenRobots > radarMaxScanDistance) {
                continue;
            }

            const angleBetween = Phaser.Math.Angle.Between(robotPositionX, robotPositionY, otherRobotPositionX, otherRobotPositionY);

            //console.log(`angleBetween [${i}]:`, angleBetween);

            if (angleBetween >= radarStartAngle && angleBetween <= radarEndAngle) {
                scannedRobots.push({
                    index: i,
                    distanceBetweenRobots: distanceBetweenRobots
                });
            }
        }

        scannedRobots.sort(function(a, b) {
            return a.distanceBetweenRobots - b.distanceBetweenRobots;
        });

        if (scannedRobots > 0) {
            Logger.log(`Scanned robots:`, scannedRobots);
        }

        return scannedRobots;
    };

    const obj = {
        createRadar: function(index) {
            const game = GameContextHolder.game;

            const radarGraphics = new Phaser.GameObjects.Graphics(game.scene.scenes[0]);
            game.scene.scenes[0].add.existing(radarGraphics);

            RobotsData_Radar.radarGraphics[index] = radarGraphics;
            RobotsData_CurrentData.currentRadarAngles[index] = 0;
            RobotsData_Radar.radarFOVAngles[index] = 45;
            RobotsData_Radar.radarMaxScanDistance[index] = 200;
        },
        scanForRobots: scanForRobots,
        drawRadarArc: function(robotIndex) {
            const radarGraphics = RobotsData_Radar.radarGraphics[robotIndex];
            radarGraphics.clear();

            // Don't draw the radar arc is the radar is not enabled
            const radarEnabled = isRadarEnabled(robotIndex);
            if (!radarEnabled) {
                return;
            }
            
            const radarFOVAngle = RobotsData_Radar.radarFOVAngles[robotIndex];
            const radarMaxScanDistance = RobotsData_Radar.radarMaxScanDistance[robotIndex];
            const radarAngle = RobotsData_CurrentData.currentRadarAngles[robotIndex];

            const robotPositionX = RobotsData_CurrentData.positionXs[robotIndex];
            const robotPositionY = RobotsData_CurrentData.positionYs[robotIndex];

            radarGraphics.lineStyle(1, 0x00ff00, 0.5);
            radarGraphics.fillStyle(0x00ff00, 0.2);

            radarGraphics.beginPath();
            radarGraphics.moveTo(robotPositionX, robotPositionY);
            radarGraphics.arc(robotPositionX,
                robotPositionY,
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
