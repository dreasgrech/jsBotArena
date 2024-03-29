"use strict";

const RobotMatterFactory = (function() {
    const HULLS_COLLISION_DATA_PATH = './CollisionData/Hulls_CollisionData.json';
    
    let scene;
    
    const robotsTrackLeftAnimationSpriteIndex = [];
    const robotsTrackRightAnimationSpriteIndex = [];

    // const createProjectileSensor = function (robotIndex) {
    //
    //     // Get the robot's vertices
    //     const vertices = RobotsBoundsHelpers.getHullBounds(robotIndex);
    //
    //     // Create a custom-shaped sensor using the vertices
    //     const sensorBody = scene.matter.add.fromVertices(300, 300, vertices, {
    //         isSensor: true // Set the body to be a sensor
    //     });
    //
    //     // Add a constraint between the hull body and the sensor body so that the sensor moves with the hull
    //     const constraint = scene.matter.add.constraint(RobotsData_PhysicsBodies_robotHullGameObjects[robotIndex].body, sensorBody, 0, 1);
    //     RobotsData_PhysicsBodies_robotProjectileSensorConstraints[robotIndex] = constraint;
    //
    //     //const robotID = RobotsData_Instance_ids[robotIndex];
    //     const robotHullMatterGroup = RobotsData_Instance_hullMatterGroup[robotIndex];
    //     PhysicsHelperFunctions.setCollisionProperties({
    //         physicsObject: sensorBody,
    //         //group: -robotID, // -robotID so that it doesn't collide with the firing robot
    //         group: -robotHullMatterGroup, // -robotHullMatterGroup so that it doesn't collide with the firing robot
    //         category: CollisionCategories.RobotProjectileSensor,
    //         collidesWithCategories:
    //             CollisionCategoriesCollidesWith[CollisionCategories.RobotProjectileSensor]
    //     });
    //
    //     // Store the sensor in your RobotsData for future reference or updates
    //     RobotsData_PhysicsBodies_robotProjectileSensorBodies[robotIndex] = sensorBody;
    //
    //     // Map the sensor body id to the robot index so that we can later resolve the robot index from it
    //     PhysicsBodiesManager.mapProjectileSensorBodyIDToRobotIndex(sensorBody.id, robotIndex);
    // };

    const createRobot = function({ currentRobotIndex, x, y, scale, robotSetup }) {
        const shapes = scene.cache.json.get('Hulls_CollisionData');

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
        //const hullImage = scene.matter.add.image(
        const hullImage = scene.matter.add.sprite(
            x,
            y,
            ImageDatabase.GameElementsSpritesheetKey,
            hullPhaserImageKey,
            {
                shape: shapes[hullPhysicsShapeName],
            }
        );
        
        // Logger.log(shapes[hullPhysicsShapeName]);
        // console.log(JSON.stringify(shapes[hullPhysicsShapeName]));
        // console.log(ImageDatabase.GameElementsSpritesheetKey, hullPhaserImageKey);
        
        hullImage.setScale(scale);
        const hullColors = hullSetup.colors;
        //hullImage.setTint(hullColors.topLeft, hullColors.topRight, hullColors.bottomLeft, hullColors.bottomRight);
        //hullImage.setTint(hullColors.topRight, hullColors.bottomRight, hullColors.topLeft, hullColors.bottomLeft);
        hullImage.setTint(hullColors.bottomLeft, hullColors.topLeft, hullColors.bottomRight, hullColors.topRight);
        hullImage.setAngle(0);
        // hullImage.setFrictionAir(0.2);
        hullImage.setFrictionAir(0.15);
        hullImage.depth = GameObjectDepths.RobotBody;

        const hullImagePhysicsBody = hullImage.body;
        RobotsData_PhysicsBodies_robotHullMatterBodies[currentRobotIndex] = hullImagePhysicsBody;

        //const area = hullImagePhysicsBody.area;
        const density = 1;
        hullImage.setDensity(density);
        //Logger.log("Robot area", area, "density", hullImagePhysicsBody.density, "mass", hullImagePhysicsBody.mass);

        //const robotID = RobotsData_Instance_ids[currentRobotIndex];
        const robotHullMatterGroup = RobotsData_Instance_hullMatterGroup[currentRobotIndex];
        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: hullImagePhysicsBody,
            //group: -robotID,
            group: -robotHullMatterGroup,
            category: CollisionCategories.RobotBody,
            collidesWithCategories: CollisionCategoriesCollidesWith[CollisionCategories.RobotBody]
        });

        const hullImagePhysicsBodyID = hullImagePhysicsBody.id;

        RobotsData_PhysicsBodies_robotHullGameObjects[currentRobotIndex] = hullImage;
        RobotsData_PhysicsBodies_robotHullMatterBodyIDs[currentRobotIndex] = hullImagePhysicsBodyID;

        RobotsData_Instance_hullTurretHoleOffset[currentRobotIndex * 2 + 0] = hullsDB.TurretHoleOffsetsX[hullType];
        RobotsData_Instance_hullTurretHoleOffset[currentRobotIndex * 2 + 1] = hullsDB.TurretHoleOffsetsY[hullType];

        // Add the robot's body to the arena bodies collection
        PhysicsBodiesManager.addDynamicArenaPhysicsBodies([hullImagePhysicsBody]); 

        // Make a reference to the current robot index from the matter object id
        PhysicsBodiesManager.mapHullImageBodyIDToRobotIndex(hullImagePhysicsBodyID, currentRobotIndex);
        //Logger.log(`Mapping hullImage.id ${hullImagePhysicsBodyID} to currentRobotIndex ${currentRobotIndex}`);

        // Create the Projectile Sensor for the robot which detects which projectiles hit this robot
        // createProjectileSensor(currentRobotIndex);

        const turretsDB = RobotPartsDatabase.turrets;
        const turretPhaserImageKey = turretsDB.phaserImageKeys[turretType];

        // ROBOT TURRET
        //const turretImage = GameContextHolder.gameContext.add.image(
        const turretImage = GameContextHolder.scene.add.sprite(
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

        RobotsData_PhysicsBodies_robotTurretGameObjects[currentRobotIndex] = turretImage;

        // Anchor the turret image to the robot so that it moves and rotates with it
        const anchorageIndex = ObjectAnchorManager.anchorToGameObject(
            turretImage,
            hullImage,
            RobotsData_Instance_hullTurretHoleOffset[currentRobotIndex * 2 + 0],
            RobotsData_Instance_hullTurretHoleOffset[currentRobotIndex * 2 + 1]
        );
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
        //system_afterPreloadOnce: function() {
        //    GameContextHolder.gameContext.matter.world.on('afterupdate', function() {
        //        //console.log('afterupdate');
        //    });
        //},
        system_preloadOnce: function(){
            scene = GameContextHolder.scene;
            
            scene.load.json('Hulls_CollisionData', HULLS_COLLISION_DATA_PATH);
        },
        createRobot: createRobot,
        updateParts: function(robotIndex) {
            // // Match the projectile sensor's angle to the robot hull's angle
            // const projectileSensor = RobotsData_PhysicsBodies_robotProjectileSensorBodies[robotIndex];
            // projectileSensor.angle = RobotsData_CurrentData_currentRobotAngles_radians[robotIndex];

            // Adjust the tracks animations based on the robot's speed
            const isRobotMoving = RobotQueries.isRobotMoving(robotIndex);
            const tracksAnimationTimescale = isRobotMoving ? 1 : 0;
            AnimationManager.setTimescale(robotsTrackLeftAnimationSpriteIndex[robotIndex], tracksAnimationTimescale);
            AnimationManager.setTimescale(robotsTrackRightAnimationSpriteIndex[robotIndex], tracksAnimationTimescale);
        },
        destroyRobot: function(robotIndex) {
            // Remove the hull's body from the arena
            const robotHullMatterBody = RobotsData_PhysicsBodies_robotHullMatterBodies[robotIndex];
            PhysicsBodiesManager.removeArenaPhysicsBody(robotHullMatterBody);

            // Disable and hide the hull image and its collider
            //PhysicsBodies.disableMatterGameObject(hullImage);
            
            const robotHullGameObject = RobotsData_PhysicsBodies_robotHullGameObjects[robotIndex];
            robotHullGameObject.destroy();

            /*
            // Remove the projectile sensor
            scene.matter.world.remove(RobotsData_PhysicsBodies_robotProjectileSensorBodies[robotIndex]);
            // Remove the projectile sensor constraint that ties it with the hull body
            scene.matter.world.remove(RobotsData_PhysicsBodies_robotProjectileSensorConstraints[robotIndex]);
            */

            // Hide the turret image
            const turretImage = RobotsData_PhysicsBodies_robotTurretGameObjects[robotIndex];
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

