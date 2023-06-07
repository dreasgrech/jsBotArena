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

            return matterGameObject;
        },
        returnMatterGameObjectToPool: function(poolIndex, matterGameObject) {
            if (!BitmaskableObjectOperations.has(matterGameObject.pool, POOL_TYPE)) {
                PoolsManager.error("Returning the element to the wrong pool", matterGameObject);
                return;
            }

            // Disable and hide the matter gameObject
            PhysicsBodiesManager.disableMatterGameObject(matterGameObject);

            GameObjectPoolsManager.returnGameObjectToPool(poolIndex, matterGameObject);
        },
        createNewMatterGameObject: function(poolIndex) {
            const matterGameObject = GameObjectPoolsManager.createNewGameObject(poolIndex);
            return matterGameObject;
        }
    };

    return matterGameObjectPoolManager;
}());
