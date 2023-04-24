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

        const tankPositionX = RobotsData_CurrentData.positionXs[robotIndex];
        const tankPositionY = RobotsData_CurrentData.positionYs[robotIndex];
        const radarAngle = RobotsData_CurrentData.currentRadarAngles[robotIndex];
        const radarMaxScanDistance = RobotsData_Radar.radarMaxScanDistance[robotIndex];
        const radarFOVAngle = RobotsData_Radar.radarFOVAngles[robotIndex];

        //console.log('tankPositionX:', tankPositionX);
        //console.log('tankPositionY:', tankPositionY);
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

            const otherTankPositionX = RobotsData_CurrentData.positionXs[i];
            const otherTankPositionY = RobotsData_CurrentData.positionYs[i];
            const distanceBetweenTanks = Phaser.Math.Distance.Between(tankPositionX, tankPositionY, otherTankPositionX, otherTankPositionY);

            //console.log(`otherTankPositionX [${i}]:`, otherTankPositionX);
            //console.log(`otherTankPositionY [${i}]:`, otherTankPositionY);
            //console.log(`distanceBetweenTanks [${i}]:`, distanceBetweenTanks);

            if (distanceBetweenTanks > radarMaxScanDistance) {
                continue;
            }

            const angleBetween = Phaser.Math.Angle.Between(tankPositionX, tankPositionY, otherTankPositionX, otherTankPositionY);

            //console.log(`angleBetween [${i}]:`, angleBetween);

            if (angleBetween >= radarStartAngle && angleBetween <= radarEndAngle) {
                scannedRobots.push({
                    index: i,
                    distanceBetweenTanks: distanceBetweenTanks
                });
            }
        }

        scannedRobots.sort(function(a, b) {
            return a.distanceBetweenTanks - b.distanceBetweenTanks;
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

            const tankPositionX = RobotsData_CurrentData.positionXs[robotIndex];
            const tankPositionY = RobotsData_CurrentData.positionYs[robotIndex];

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
