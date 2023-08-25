"use strict";

const UIRobotInfoPanel = (function() {
    const PANEL_WIDTH = 230; // Width of the panel
    const PANEL_HEIGHT = 900; // Height of the panel

    const PANEL_Y = 0; // Y position of the panel
    
    const PANEL_DEPTH = GameObjectDepths.UI_RobotInformationPanel;
    const PANEL_TEXT_DEPTH = PANEL_DEPTH + 1;

    const robotsIndex = [];
    const robotInfoTexts = [];

    /**
     * @type {Phaser.GameObjects.Graphics}
     */
    let panelGraphics;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    let titleText;

    const obj = {
        create: function() {
            const gameContext = GameContextHolder.scene;

            const panelX = gameContext.cameras.main.width - PANEL_WIDTH; // X position of the panel

            // Create a Graphics object for the panel background
            panelGraphics = gameContext.add.graphics();
            panelGraphics.depth = PANEL_DEPTH;
            panelGraphics.fillStyle(0x333333, 0.3); // Set panel background color and alpha
            panelGraphics.fillRect(panelX, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT); // Draw the panel background

            // Create a Text object for the panel title
            titleText = gameContext.add.text(panelX + PANEL_WIDTH / 2,
                PANEL_Y + 10,
                'Robot Information',
                {
                    fontSize: '19px',
                    color: '#ffffff'
                }).setOrigin(0.5, 0);
            titleText.depth = PANEL_TEXT_DEPTH;
        },
        add: function(robotIndex) {
            const gameContext = GameContextHolder.scene;

            const panelX = gameContext.cameras.main.width - PANEL_WIDTH; // X position of the panel

            const infoText = gameContext.add.text(panelX + 10,
                PANEL_Y + 30 + robotIndex * 90,
                '',
                {
                    fontSize: '10px',
                    color: '#ffffff'
                });
            infoText.depth = PANEL_TEXT_DEPTH;
            //robotInfoTexts.push(infoText);
            
            robotsIndex.push(robotIndex);
            robotInfoTexts[robotIndex] = infoText;
        },
        update: function() {
            for (let j = 0; j < robotsIndex.length; j++) {
                let robotIndex = robotsIndex[j];

                const id = RobotsData_Instance_ids[robotIndex];
                const name = RobotsData_Instance_names[robotIndex];
                const positionX = RobotsData_CurrentData_positions[robotIndex * 2 + 0];
                const positionY = RobotsData_CurrentData_positions[robotIndex * 2 + 1];
                const angle = RobotsData_CurrentData_currentRobotAngles_degrees[robotIndex];
                const projectileSensor = RobotsData_PhysicsBodies_robotProjectileSensorBodies[robotIndex];
                // const projectileSensorAngle = Phaser.Math.RadToDeg(projectileSensor.angle);
                const radarAngle = RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex];
                const turretRotation = RobotsData_CurrentData_currentTurretAngles_degrees[robotIndex];
                const robotHealth = RobotsData_CurrentData_health[robotIndex];

//                 const infoText = `
// Robot ${id}: ${name}
// Health: ${robotHealth}
// Position: (${positionX.toFixed(2)}, ${positionY.toFixed(2)})
// Angle: ${angle.toFixed(2)}�
// Sensor Angle: ${projectileSensorAngle.toFixed(2)}�
// Radar Angle: ${radarAngle.toFixed(2)}�
// Turret Rotation: ${turretRotation.toFixed(2)}�
// `;
                const infoText = `
Robot ${id}: ${name}
Health: ${robotHealth}
Position: (${positionX.toFixed(2)}, ${positionY.toFixed(2)})
Angle: ${angle.toFixed(2)}�
Radar Angle: ${radarAngle.toFixed(2)}�
Turret Rotation: ${turretRotation.toFixed(2)}�
`;
//Turret Rotation: ${Phaser.Math.RadToDeg(turretRotation).toFixed(2)}�
                robotInfoTexts[robotIndex].setText(infoText);
                if (robotHealth === 0) {
                    robotInfoTexts[robotIndex].setColor('#282c34');
                }
                //Logger.log(robotInfoTexts[robotIndex]);

            }
        },
        //system_unloadLevel: function(){
        clearPanel: function(){
            for (let i = 0; i < robotsIndex.length; i++) {
                let robotIndex = robotsIndex[i];
                const robotInfoText = robotInfoTexts[robotIndex];
                robotInfoText.destroy();
            }

            titleText.destroy();
            panelGraphics.destroy();
            
            robotsIndex.length = 0;
            robotInfoTexts.length = 0;
        }
    };

    return obj;
}());

