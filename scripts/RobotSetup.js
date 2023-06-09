"use strict";

const RobotSetupFactory = (function() {

    const robotSetupFactory = {
        createRobotSetup: function() {
            const robotSetup = {
                hull: {
                    hullType: EnumHelpers.getRandomValue(RobotHullTypes),
                    /**
                     * The tint colors to apply to the hull
                     */
                    colors: {
                        //topLeft: 0xff0000, 
                        //topRight: 0x00ff00, 
                        //bottomLeft: 0x0000ff, 
                        //bottomRight: 0xffffff 
                        // topLeft: Phaser.Display.Color.RandomRGB().color, 
                        // topRight: Phaser.Display.Color.RandomRGB().color, 
                        // bottomLeft: Phaser.Display.Color.RandomRGB().color, 
                        // bottomRight: Phaser.Display.Color.RandomRGB().color
                        /** * @type {number} */
                        // topLeft: Phaser.Display.Color.RandomRGB().color,
                        topLeft: -1,
                        /** * @type {number} */
                        // topRight: Phaser.Display.Color.RandomRGB().color,
                        topRight: -1,
                        /** * @type {number} */
                        // bottomLeft: Phaser.Display.Color.RandomRGB().color,
                        bottomLeft: -1,
                        /** * @type {number} */
                        // bottomRight: Phaser.Display.Color.RandomRGB().color
                        bottomRight: -1
                    }
                },
                turret: {
                    turretType: EnumHelpers.getRandomValue(RobotTurretTypes),
                    colors: {
                        //topLeft: 0xff0000, 
                        //topRight: 0x00ff00, 
                        //bottomLeft: 0x0000ff, 
                        //bottomRight: 0xffffff 
                        // topLeft: Phaser.Display.Color.RandomRGB().color, 
                        // topRight: Phaser.Display.Color.RandomRGB().color, 
                        // bottomLeft: Phaser.Display.Color.RandomRGB().color, 
                        // bottomRight: Phaser.Display.Color.RandomRGB().color
                        topLeft: -1,
                        topRight: -1,
                        bottomLeft: -1,
                        bottomRight: -1
                    }
                },
                //    radar: {
                //    }
            };

            return robotSetup;
        }
    };

    return robotSetupFactory;
}());
