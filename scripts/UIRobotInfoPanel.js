"use strict";

var UIRobotInfoPanel = (function() {
    var robotInfoTexts = [];
    var titleText;
    var obj = {
        create: function() {
            var gameContext = GameContextHolder.gameContext;

            const panelWidth = 300; // Width of the panel
            const panelHeight = 600; // Height of the panel
            const panelX = gameContext.cameras.main.width - panelWidth; // X position of the panel
            const panelY = 0; // Y position of the panel

            // Create a Graphics object for the panel background
            const panelGraphics = gameContext.add.graphics();
            panelGraphics.fillStyle(0x333333, 0.8); // Set panel background color and alpha
            panelGraphics.fillRect(panelX, panelY, panelWidth, panelHeight); // Draw the panel background

            // Create a Text object for the panel title
            titleText = gameContext.add.text(panelX + panelWidth / 2,
                panelY + 10,
                'Robot Information',
                {
                    fontSize: '24px',
                    color: '#ffffff',
                }).setOrigin(0.5, 0);

            // Create a Text object for each robot
            var totalRobots = RobotsData.totalRobots;
            for (let i = 0; i < totalRobots; i++) {
                const infoText = gameContext.add.text(panelX + 10,
                    panelY + 50 + i * 100,
                    '',
                    {
                        fontSize: '16px',
                        color: '#ffffff'
                    });
                robotInfoTexts.push(infoText);
            }
        },
        update: function() {
            var totalRobots = RobotsData.totalRobots;
            for (let i = 0; i < totalRobots; i++) {
                const id = RobotsData.ids[i];
                const name = RobotsData.names[i];
                const positionX = RobotsData.positionXs[i];
                const positionY = RobotsData.positionYs[i];
                // const angle = RobotsData.robotBodyImages[i].angle;
                const angle = RobotsData.currentRobotAngles[i];
                // const turretRotation = RobotsData.robotTurretImages[i].rotation;
                const turretRotation = RobotsData.currentTurretAngles[i];

                const infoText = `
Robot ${id}: ${name}
Position: (${positionX.toFixed(2)}, ${positionY.toFixed(2)})
Angle: ${angle.toFixed(2)}°
Radar Angle: ${angle.toFixed(2)}°
Turret Rotation: ${turretRotation.toFixed(2)}°
`;
//Turret Rotation: ${Phaser.Math.RadToDeg(turretRotation).toFixed(2)}°
                robotInfoTexts[i].setText(infoText);
            }
        }
    };

    return obj;
}());
