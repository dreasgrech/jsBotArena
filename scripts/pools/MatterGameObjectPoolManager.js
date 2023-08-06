"use strict";

/*
 * Pools that serves Matter GameObjects
 */
const MatterGameObjectPoolManager = (function() {
    const POOL_TYPE = PoolType.MatterGameObject;

    const matterGameObjectPoolManager = {
        createMatterGameObjectPool: function({ poolName, createElement, beforePush, afterPop }) {
            const poolIndex = GameObjectPoolsManager.createGameObjectPool(
                {
                    poolName: poolName,
                    createElement: function() {
                        // Create the body
                        const matterGameObject = createElement();
                        matterGameObject.pool = BitmaskableObjectOperations.add(matterGameObject.pool, POOL_TYPE);

                        // Disable the physics
                        // PhysicsBodies.disableMatterGameObject(matterGameObject);

                        return matterGameObject;
                    },
                    beforePush: beforePush,
                    afterPop: afterPop
                });

            return poolIndex;
        },
        prePopulateMatterGameObjectsPool: function(poolIndex, total) {
            for (let i = 0; i < total; i++) {
                const matterGameObject = matterGameObjectPoolManager.createNewMatterGameObject(poolIndex);
                matterGameObjectPoolManager.returnMatterGameObjectToPool(poolIndex, matterGameObject);
            }
        },
        fetchMatterGameObjectFromPool: poolIndex => {
            const matterGameObject = GameObjectPoolsManager.fetchGameObjectFromPool(poolIndex);
            
            // Enable the matter game object
            PhysicsBodiesManager.enableMatterBody(matterGameObject);
            
            // PoolsManager.log(poolIndex,
            //     "Fetched a matter game object", matterGameObject,
            //     `Pool: ${matterGameObject.pool}`,
            //     `Body: ${matterGameObject.body.id}`,
            // );

            return matterGameObject;
        },
        returnMatterGameObjectToPool: function(poolIndex, matterGameObject) {
            if (!BitmaskableObjectOperations.has(matterGameObject.pool, POOL_TYPE)) {
                PoolsManager.error("Returning the element to the wrong pool", matterGameObject);
                return;
            }

            // PoolsManager.log(poolIndex,
            //     "Returned a matter game object", matterGameObject,
            //     `Pool: ${matterGameObject.pool}`,
            //     `Body: ${matterGameObject.body.id}`,
            // );

            // Disable and hide the matter gameObject
            PhysicsBodiesManager.disableMatterGameObject(matterGameObject);

            // Return the matter gameObject to the gameObject pool
            GameObjectPoolsManager.returnGameObjectToPool(poolIndex, matterGameObject);
        },
        createNewMatterGameObject: function(poolIndex) {
            const matterGameObject = GameObjectPoolsManager.createNewGameObject(poolIndex);
            // PoolsManager.log(poolIndex, "Created a new matter game object", matterGameObject);
            return matterGameObject;
        }
    };

    return matterGameObjectPoolManager;
}());
