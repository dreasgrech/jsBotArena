"use strict";

const UIRobotInfoPanel = (function() {
    const panelWidth = 230; // Width of the panel
    const panelHeight = 900; // Height of the panel

    const panelY = 0; // Y position of the panel

    const robotsIndex = [];
    const robotInfoTexts = [];

    const panelDepth = GameObjectDepths.UI_RobotInformationPanel;
    const panelTextDepth = panelDepth + 1;

    let titleText;

    const obj = {
        create: function() {
            const gameContext = GameContextHolder.gameContext;

            const panelX = gameContext.cameras.main.width - panelWidth; // X position of the panel

            // Create a Graphics object for the panel background
            const panelGraphics = gameContext.add.graphics();
            panelGraphics.depth = panelDepth;
            panelGraphics.fillStyle(0x333333, 0.3); // Set panel background color and alpha
            panelGraphics.fillRect(panelX, panelY, panelWidth, panelHeight); // Draw the panel background

            // Create a Text object for the panel title
            titleText = gameContext.add.text(panelX + panelWidth / 2,
                panelY + 10,
                'Robot Information',
                {
                    fontSize: '19px',
                    color: '#ffffff'
                }).setOrigin(0.5, 0);
            titleText.depth = panelTextDepth;
        },
        add: function(robotIndex) {
            const gameContext = GameContextHolder.gameContext;

            robotsIndex.push(robotIndex);

            const panelX = gameContext.cameras.main.width - panelWidth; // X position of the panel

            const infoText = gameContext.add.text(panelX + 10,
                panelY + 30 + robotIndex * 90,
                '',
                {
                    fontSize: '10px',
                    color: '#ffffff'
                });
            infoText.depth = panelTextDepth;
            //robotInfoTexts.push(infoText);
            robotInfoTexts[robotIndex] = infoText;
        },
        update: function() {
            for (let j = 0; j < robotsIndex.length; j++) {
                let robotIndex = robotsIndex[j];

                const id = RobotsData_Instance_ids[robotIndex];
                const name = RobotsData_Instance_names[robotIndex];
                const positionX = RobotsData_CurrentData_positionXs[robotIndex];
                const positionY = RobotsData_CurrentData_positionYs[robotIndex];
                const angle = RobotsData_CurrentData_currentRobotAngles_degrees[robotIndex];
                const projectileSensor = RobotsData_PhysicsBodies_robotProjectileSensorBodies[robotIndex];
                const projectileSensorAngle = Phaser.Math.RadToDeg(projectileSensor.angle);
                const radarAngle = RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex];
                const turretRotation = RobotsData_CurrentData_currentTurretAngles[robotIndex];
                const robotHealth = RobotsData_CurrentData_health[robotIndex];

                const infoText = `
Robot ${id}: ${name}
Health: ${robotHealth}
Position: (${positionX.toFixed(2)}, ${positionY.toFixed(2)})
Angle: ${angle.toFixed(2)}°
Sensor Angle: ${projectileSensorAngle.toFixed(2)}°
Radar Angle: ${radarAngle.toFixed(2)}°
Turret Rotation: ${turretRotation.toFixed(2)}°
`;
//Turret Rotation: ${Phaser.Math.RadToDeg(turretRotation).toFixed(2)}°
                robotInfoTexts[robotIndex].setText(infoText);
                if (robotHealth === 0) {
                    robotInfoTexts[robotIndex].setColor('#ff0000');
                }
                //Logger.log(robotInfoTexts[robotIndex]);

            }
        },
        system_newRoundReset: function(){
            for (let i = 0; i < robotInfoTexts.length; i++) {
                const robotInfoText = robotInfoTexts[i];
                robotInfoText.destroy();
            }
            
        }
    };

    return obj;
}());

