"use strict";

const RobotMatterFactory = (function() {

    const robotsTrackLeftAnimationSpriteIndex = [];
    const robotsTrackRightAnimationSpriteIndex = [];

    const createProjectileSensor = function (robotIndex) {
        const gameContext = GameContextHolder.gameContext;

        // Get the robot's vertices
        const vertices = RobotsBoundsHelpers.getHullBounds(robotIndex);

        // Create a custom-shaped sensor using the vertices
        const sensorBody = gameContext.matter.add.fromVertices(300, 300, vertices, {
            isSensor: true // Set the body to be a sensor
        });

        // Add a constraint between the hull body and the sensor body so that the sensor moves with the hull
        const constraint = gameContext.matter.add.constraint(RobotsData_PhysicsBodies_robotBodyImages[robotIndex].body, sensorBody, 0, 1);
        RobotsData_PhysicsBodies_robotProjectileSensorConstraints[robotIndex] = constraint;

        const robotID = RobotsData_Instance_ids[robotIndex];
        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: sensorBody,
            group: -robotID, // -robotID so that it doesn't collide with the firing robot
            category: CollisionCategories.RobotProjectileSensor,
            collidesWithCategories:
                CollisionCategories.RobotProjectile
        });

        // Store the sensor in your RobotsData for future reference or updates
        RobotsData_PhysicsBodies_robotProjectileSensorBodies[robotIndex] = sensorBody;

        // Map the sensor body id to the robot index so that we can later resolve the robot index from it
        PhysicsBodies.mapProjectileSensorBodyIDToRobotIndex(sensorBody.id, robotIndex);
    };

    const createRobot = function({ currentRobotIndex, x, y, scale, robotSetup }) {
        const gameContext = GameContextHolder.gameContext;

        const shapes = gameContext.cache.json.get('Hulls_CollisionData');

        const hullSetup = robotSetup.hull;
        const turretSetup = robotSetup.turret;

        const hullType = hullSetup.hullType;
        // const hullColor = hullSetup.hullColor;
        const turretType = turretSetup.turretType;
        // const turretColor = turretSetup.turretColor;

        const hullsDB = RobotPartsDatabase.hulls;
        const hullPhaserImageKey = hullsDB.phaserImageKeys[hullType];
        const hullPhysicsShapeName = hullsDB.physicsEditorSpriteNames[hullType];

        // ROBOT HULL
        //const hullImage = gameContext.matter.add.image(
        const hullImage = gameContext.matter.add.sprite(
            x,
            y,
            ImageDatabase.GameElementsSpritesheetKey,
            hullPhaserImageKey
        );
        const hullColors = hullSetup.colors;
        // hullImage.setBody(shapes[`Hull_${hullType}`], null);
        hullImage.setBody(shapes[hullPhysicsShapeName], null);
        hullImage.setScale(scale);
        //hullImage.setTint(hullColors.topLeft, hullColors.topRight, hullColors.bottomLeft, hullColors.bottomRight);
        //hullImage.setTint(hullColors.topRight, hullColors.bottomRight, hullColors.topLeft, hullColors.bottomLeft);
        hullImage.setTint(hullColors.bottomLeft, hullColors.topLeft, hullColors.bottomRight, hullColors.topRight);
        hullImage.setAngle(0);
        // hullImage.setFrictionAir(0.2);
        hullImage.setFrictionAir(0.15);
        hullImage.depth = GameObjectDepths.RobotBody;

        const hullImagePhysicsBody = hullImage.body;

        //const area = hullImagePhysicsBody.area;
        const density = 1;
        hullImage.setDensity(density);
        //Logger.log("Robot area", area, "density", hullImagePhysicsBody.density, "mass", hullImagePhysicsBody.mass);

        const robotID = RobotsData_Instance_ids[currentRobotIndex];
        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: hullImagePhysicsBody,
            group: -robotID,
            category: CollisionCategories.RobotBody,
            collidesWithCategories:
                CollisionCategories.RobotBody
                    | CollisionCategories.Arena
                    //| CollisionCategories.RobotProjectile
        });

        const hullImagePhysicsBodyID = hullImagePhysicsBody.id;

        RobotsData_PhysicsBodies_robotBodyImages[currentRobotIndex] = hullImage;
        RobotsData_PhysicsBodies_robotHullBodyIDs[currentRobotIndex] = hullImagePhysicsBodyID;

        RobotsData_Instance_hullTurretHoleOffsetX[currentRobotIndex] = hullsDB.TurretHoleOffsetsX[hullType];
        RobotsData_Instance_hullTurretHoleOffsetY[currentRobotIndex] = hullsDB.TurretHoleOffsetsY[hullType];

        // Add the robot's body to the arena bodies collection
        PhysicsBodies.addArenaPhysicsBodies(CollisionCategories.RobotBody, [hullImagePhysicsBody], true); // Add all the bodies from the arena to the arena bodies collection

        // Make a reference to the current robot index from the matter object id
        PhysicsBodies.mapHullImageBodyIDToRobotIndex(hullImagePhysicsBodyID, currentRobotIndex);
        // Logger.log(`Mapping hullImage.id ${hullImagePhysicsBodyID} to currentRobotIndex ${currentRobotIndex}`);

        // Create the Projectile Sensor for the robot which detects which projectiles hit this robot
        createProjectileSensor(currentRobotIndex);

        const turretsDB = RobotPartsDatabase.turrets;
        const turretPhaserImageKey = turretsDB.phaserImageKeys[turretType];

        // ROBOT TURRET
        //const turretImage = GameContextHolder.gameContext.add.image(
        const turretImage = GameContextHolder.gameContext.add.sprite(
            hullImage.x,
            hullImage.y,
            ImageDatabase.GameElementsSpritesheetKey,
            turretPhaserImageKey
        );

        // turretImage.setOrigin(0.3, 0.5); // Set the origin of the turret to the base of the turret
        //turretImage.setOrigin(0.2, 0.5); // Set the origin of the turret to the base of the turret
        turretImage.setOrigin(turretsDB.originsX[turretType], turretsDB.originsY[turretType]); // Set the origin of the turret to the base of the turret
        turretImage.depth = GameObjectDepths.RobotTurret;
        turretImage.setScale(scale);
        turretImage.setAngle(0);

        const turretColors = turretSetup.colors;
        turretImage.setTint(turretColors.bottomLeft, turretColors.topLeft, turretColors.bottomRight, turretColors.topRight);

        //hullImage.alpha = 0.1;// TODO: setting this while calibrating hull turret hole offset
        //turretImage.alpha = 1;// TODO: setting this while calibrating hull turret hole offset

        RobotsData_PhysicsBodies_robotTurretImages[currentRobotIndex] = turretImage;

        // Anchor the turret image to the robot so that it moves and rotates with it
        const anchorageIndex = ObjectAnchorManager.anchorToGameObject(
            turretImage,
            hullImage,
            RobotsData_Instance_hullTurretHoleOffsetX[currentRobotIndex],
            RobotsData_Instance_hullTurretHoleOffsetY[currentRobotIndex]);
        RobotsData_Instance_hullTurretAnchorageIndex[currentRobotIndex] = anchorageIndex;


        // const exhaustAnimationSpriteIndex = AnimationManager.fetchSpriteForAnimation(AnimationEffects.TankAnimationEffects.Exhaust_01);
        //const exhaustAnimationSpriteIndex = AnimationManager.playAnimation(AnimationEffects.TankAnimationEffects.Exhaust_01);
        // TODO: continue here
        // TODO: continue here
        // TODO: continue here
        // TODO: continue here
        //AnimationManager.playAnimationOnSprite()
        //Logger.log("exhaustAnimationSpriteIndex", exhaustAnimationSpriteIndex);
        //console.log("creating robot");

        const trackType = AnimationEffects.TankAnimationEffects.Track_2;
        const trackLeftAnimationSpriteIndex = createTrackAnimationSprite(
            trackType,
            hullImage,
            hullsDB.TracksSpriteScale[hullType],
            hullsDB.TracksLeftOffsetX[hullType] * ROBOT_SCALE,
            hullsDB.TracksLeftOffsetY[hullType] * ROBOT_SCALE
        );
        const trackRightAnimationSpriteIndex = createTrackAnimationSprite(
            trackType,
            hullImage,
            hullsDB.TracksSpriteScale[hullType],
            hullsDB.TracksRightOffsetX[hullType] * ROBOT_SCALE,
            hullsDB.TracksRightOffsetY[hullType] * ROBOT_SCALE
            );

        robotsTrackLeftAnimationSpriteIndex[currentRobotIndex] = trackLeftAnimationSpriteIndex;
        robotsTrackRightAnimationSpriteIndex[currentRobotIndex] = trackRightAnimationSpriteIndex;
    };

    const createTrackAnimationSprite = function(trackType, hullImage, tracksScale, tracksLeftOffsetX, tracksLeftOffsetY) {
        const trackAnimationSpriteIndex = AnimationManager.fetchSpriteForAnimation(trackType);
        AnimationManager.setSpriteDetails(
            trackAnimationSpriteIndex,
            GameObjectDepths.RobotBody - 1,
            ROBOT_SCALE * tracksScale
        );
        AnimationManager.playAnimationOnSprite(
            trackAnimationSpriteIndex,
            trackType);

        //AnimationManager.setTimescale(trackLeftAnimationSpriteIndex, 0.1);
        AnimationManager.anchorAnimationTo(
            trackAnimationSpriteIndex,
            hullImage,
            tracksLeftOffsetX,
            tracksLeftOffsetY,
            true);

        return trackAnimationSpriteIndex;
    };

    const robotMatterFactory = {
        //system_create: function() {
        //    GameContextHolder.gameContext.matter.world.on('afterupdate', function() {
        //        //console.log('afterupdate');
        //    });
        //},
        createRobot: createRobot,
        updateParts: function(robotIndex) {

            /*
            // Update the position of the turret to remain attached to the robot based on the hull's rotation
            const robotTurretImage = RobotsData_PhysicsBodies_robotTurretImages[robotIndex];
            const robotPositionX = RobotsData_CurrentData_positionXs[robotIndex];
            const robotPositionY = RobotsData_CurrentData_positionYs[robotIndex];

            // Get the hull's rotation
            const hullAngle_radians = RobotsData_CurrentData_currentRobotAngles_radians[robotIndex];

            const offsetX = RobotsData_Instance_hullTurretHoleOffsetX[robotIndex];
            const offsetY = RobotsData_Instance_hullTurretHoleOffsetY[robotIndex];

            // Apply the rotation transformation to the offset
            const rotatedOffsetX = ROBOT_SCALE * offsetX * Math.cos(hullAngle_radians) - offsetY * Math.sin(hullAngle_radians);
            const rotatedOffsetY = ROBOT_SCALE * offsetX * Math.sin(hullAngle_radians) + offsetY * Math.cos(hullAngle_radians);

            // Add the rotated offset to the robot's position
            const turretPositionX = robotPositionX + rotatedOffsetX;
            const turretPositionY = robotPositionY + rotatedOffsetY;
            robotTurretImage.setPosition(turretPositionX, turretPositionY);
            */

            // Match the projectile sensor's angle to the robot hull's angle
            const projectileSensor = RobotsData_PhysicsBodies_robotProjectileSensorBodies[robotIndex];
            projectileSensor.angle = RobotsData_CurrentData_currentRobotAngles_radians[robotIndex];
        },
        destroyRobot: function(robotIndex) {
            const hullImage = RobotsData_PhysicsBodies_robotBodyImages[robotIndex];

            // Remove the hull's body from the arena
            PhysicsBodies.removeArenaPhysicsBody(hullImage.body);

            // Disable and hide the hull image and its collider
            //PhysicsBodies.disableMatterGameObject(hullImage);
            hullImage.destroy();

            const gameContext = GameContextHolder.gameContext;

            // Remove the projectile sensor
            gameContext.matter.world.remove(RobotsData_PhysicsBodies_robotProjectileSensorBodies[robotIndex]);
            // Remove the projectile sensor constraint that ties it with the hull body
            gameContext.matter.world.remove(RobotsData_PhysicsBodies_robotProjectileSensorConstraints[robotIndex]);

            // Hide the turret image
            const turretImage = RobotsData_PhysicsBodies_robotTurretImages[robotIndex];
            //turretImage.setActive(false);
            //turretImage.setVisible(false);
            turretImage.destroy();

            // Remove the anchor between the turret and the hull
            ObjectAnchorManager.removeAnchor(RobotsData_Instance_hullTurretAnchorageIndex[robotIndex]);

            // Remove the anchors between the tracks and the hull
            const trackLeftAnimationSpriteIndex = robotsTrackLeftAnimationSpriteIndex[robotIndex];
            const trackRightAnimationSpriteIndex = robotsTrackRightAnimationSpriteIndex[robotIndex];

            // Destroy the tracks sprites
            AnimationManager.destroySpriteAnimation(trackLeftAnimationSpriteIndex);
            AnimationManager.destroySpriteAnimation(trackRightAnimationSpriteIndex);
        }
    };

    return robotMatterFactory;
}());
