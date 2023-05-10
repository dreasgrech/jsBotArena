"use strict";

const RobotSetupFactory = (function() {

    const robotSetupFactory = {
        createRobotSetup: function() {
            const robotSetup = {
                hull: {
                    hullType: EnumHelpers.getRandomValue(RobotHullTypes),
                    colors: {
                        //topLeft: 0xff0000, 
                        //topRight: 0x00ff00, 
                        //bottomLeft: 0x0000ff, 
                        //bottomRight: 0xffffff 
                        topLeft: Phaser.Display.Color.RandomRGB().color, 
                        topRight: Phaser.Display.Color.RandomRGB().color, 
                        bottomLeft: Phaser.Display.Color.RandomRGB().color, 
                        bottomRight: Phaser.Display.Color.RandomRGB().color 
                    }
                },
                turret: {
                    turretType: EnumHelpers.getRandomValue(RobotTurretTypes),
                    colors: {
                        //topLeft: 0xff0000, 
                        //topRight: 0x00ff00, 
                        //bottomLeft: 0x0000ff, 
                        //bottomRight: 0xffffff 
                        topLeft: Phaser.Display.Color.RandomRGB().color, 
                        topRight: Phaser.Display.Color.RandomRGB().color, 
                        bottomLeft: Phaser.Display.Color.RandomRGB().color, 
                        bottomRight: Phaser.Display.Color.RandomRGB().color 
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
