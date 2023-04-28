"use script";


const ProjectileManager = (function() {
    let projectilesCollisionData;
    let gameContext;

    // const projectileGroups = {};

    const pools = {};


    const obj = {
        onCreate: function() {
            gameContext = GameContextHolder.gameContext;

            projectilesCollisionData = gameContext.cache.json.get('Projectiles_CollisionData');
            // console.log("projectilesCollisionData", projectilesCollisionData);

            for (let projectileTypeField in ProjectileTypes) {
                if (!ProjectileTypes.hasOwnProperty(projectileTypeField)) {
                    continue;
                }

                const projectileType = ProjectileTypes[projectileTypeField];

                const pool = PoolFactory.createPool({
                    poolName: `Projectiles (${projectileType})`,
                    createElement: function() {
                        console.log("creating projectile", projectileType);
                        const projectileImage = gameContext.matter.add.sprite(
                            300,
                            300,
                            projectileType,
                            null,
                            {
                                shape: projectilesCollisionData[projectileType]
                            });
                        projectileImage.setCollisionCategory(null);
                        projectileImage.setActive(false);
                        projectileImage.setVisible(false);
                        return projectileImage;
                    },
                    //    beforePush: function(){},
                    //    afterPop: function(){},
                });

                pool.prePopulate(10);

                pools[projectileType] = pool;

                // const projectileTypeValue = ProjectileTypes[projectileType];

                //    const group = PhaserGroupFactory.createGroup({
                //        key:projectileTypeValue,
                //        maxSize: 10,
                //        onCreate: function(item){console.log('onCreate', item)},
                //        onRemove: function(){}
                //    });
                //    projectileGroups[projectileTypeValue] = group;
                //    console.log("creating group", projectileTypeValue, group);
            }
        },
        fireRobotProjectile: function(robotIndex, projectileType) {
            const turret = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
            // const angle = turret.angle - 90;
            const angle = turret.angle;

            const robotPositionX = RobotsData_CurrentData.positionXs[robotIndex];
            const robotPositionY = RobotsData_CurrentData.positionYs[robotIndex];

            /*
            const turretTipPosition = new Phaser.Math.Vector2();
            turret.getTopLeft(turretTipPosition); // Get the turret's top-left position
            //turretTipPosition.x += turret.width*.2;// * Math.cos(Phaser.Math.DegToRad(angle)); // Calculate the tip's x position
            // turretTipPosition.y += turret.width * Math.sin(Phaser.Math.DegToRad(angle)); // Calculate the tip's y position

            //const x = turretTipPosition.x;
            //const y = turretTipPosition.y;
            */
            const x = robotPositionX;
            const y = robotPositionY;

            // const gameContext = GameContextHolder.gameContext;

            //const opts = {
            //    //shape: projectilesCollisionData[projectileType]
            //};

            //const group = projectileGroups[projectileType];
            //console.log("group", group, projectileType);

            //const bullet = gameContext.matter.add.sprite(
            //    x,
            //    y,
            //    projectileType,
            //    null,
            //    opts);
            // console.log(`group.get(${x}, ${y}, ${projectileType}, ${null}, ${true})`);
            // const bullet = group.get(x, y, projectileType, null, true);
            const pool = pools[projectileType];
            const bullet = pool.pop();
            // console.log("bullet", bullet);
            bullet.setPosition(x, y);
            bullet.setActive(true);
            bullet.setVisible(true);

            bullet.setBody(projectilesCollisionData[projectileType], null);
            bullet.depth = GameObjectDepths.Projectile;
            bullet.setDensity(5);
            bullet.setAngle(angle);
            bullet.setFrictionAir(0);
            bullet.setBounce(0);

            const robotID = RobotsData_Instance.ids[robotIndex];
            // Logger.log("Setting group of projectile to", -robotID);
            PhysicsHelperFunctions.setCollisionProperties({
                physicsObject: bullet.body,
                // group: 0,
                group: -robotID,
                category: CollisionCategories.RobotProjectile,
                collidesWithCategories: CollisionCategories.RobotBody |
                    CollisionCategories.Arena |
                    CollisionCategories.RobotProjectile
            });

            const bulletPhysicsBody = bullet.body;

            PhysicsBodies.addArenaPhysicsBodies(CollisionCategories.RobotProjectile, [bulletPhysicsBody]); // Add all the bodies from the arena to the arena bodies collection

            const speed = 100;
            /*
            const velocity = {
                x: Math.cos(Phaser.Math.DegToRad(angle-90)) * 1, // Adjust bullet speed (multiplier) as needed
                y: Math.sin(Phaser.Math.DegToRad(angle-90)) * 1, // Adjust bullet speed (multiplier) as needed
            };
    
            bullet.setVelocity(velocity.x, velocity.y);
            */

            const angleRad = Phaser.Math.DegToRad(angle - 90);
            const force = new Phaser.Math.Vector2(Math.cos(angleRad) * speed, Math.sin(angleRad) * speed);
            bullet.applyForce(force);
        }
    };

    return obj;
}());
