"use strict";

const UIRobotInfoPanel = (function() {
    const panelWidth = 300; // Width of the panel
    const panelHeight = 600; // Height of the panel

    const panelY = 0; // Y position of the panel

    const robotIds = [];
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
            panelGraphics.fillStyle(0x333333, 0.8); // Set panel background color and alpha
            panelGraphics.fillRect(panelX, panelY, panelWidth, panelHeight); // Draw the panel background

            // Create a Text object for the panel title
            titleText = gameContext.add.text(panelX + panelWidth / 2,
                panelY + 10,
                'Robot Information',
                {
                    fontSize: '24px',
                    color: '#ffffff'
                }).setOrigin(0.5, 0);
            titleText.depth = panelTextDepth;
        },
        add: function(robotIndex) {
            const gameContext = GameContextHolder.gameContext;

            robotIds.push(robotIndex);

            const panelX = gameContext.cameras.main.width - panelWidth; // X position of the panel

            const infoText = gameContext.add.text(panelX + 10,
                panelY + 50 + robotIndex * 100,
                '',
                {
                    fontSize: '16px',
                    color: '#ffffff'
                });
            infoText.depth = panelTextDepth;
            robotInfoTexts.push(infoText);
        },
        update: function() {
            for (let j = 0; j < robotIds.length; j++) {
                let i = robotIds[j];

                const id = RobotsData_Instance.ids[i];
                const name = RobotsData_Instance.names[i];
                const positionX = RobotsData_CurrentData.positionXs[i];
                const positionY = RobotsData_CurrentData.positionYs[i];
                const angle = RobotsData_CurrentData.currentRobotAngles_degrees[i];
                const radarAngle = RobotsData_CurrentData.currentRadarAngles_degrees[i];
                const turretRotation = RobotsData_CurrentData.currentTurretAngles[i];

                const infoText = `
Robot ${id}: ${name}
Position: (${positionX.toFixed(2)}, ${positionY.toFixed(2)})
Angle: ${angle.toFixed(2)}°
Radar Angle: ${radarAngle.toFixed(2)}°
Turret Rotation: ${turretRotation.toFixed(2)}°
`;
//Turret Rotation: ${Phaser.Math.RadToDeg(turretRotation).toFixed(2)}°
                robotInfoTexts[i].setText(infoText);

            }
        }
    };

    return obj;
}());

