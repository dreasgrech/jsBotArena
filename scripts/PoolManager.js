"use strict";

const PoolType = BitmaskableObjectOperations.populateBitmaskableObject({
    Generic: 0,
    GameObject: 0,
    MatterGameObject: 0
});

/*
 * Pools that serves any time of JavaScript object
 */
const PoolsManager = (function() {
    const POOL_TYPE = PoolType.Generic;

    let nextPoolIndex = 0;

    const pool_elements = [];
    const pool_names = [];
    const pool_createElementHooks = [];
    const pool_beforePushHooks = [];
    const pool_afterPopHooks = [];
    const pool_currentlyPrePopulating = [];

    const handleAfterPop = function(poolIndex, element) {
        pool_afterPopHooks[poolIndex](element);
        element.outOfPool = true;
        element.pool = BitmaskableObjectOperations.add(element.pool, POOL_TYPE);
        return element;
    };

    const createNewElement = function(poolIndex) {
        // Execute the pool's createElement hook
        const element = pool_createElementHooks[poolIndex]();

        // Set some pool-specific data that help us debug issues
        element.outOfPool = true;
        element.pool = BitmaskableObjectOperations.add(element.pool, POOL_TYPE);

        return element;
    }

    const poolManager = {
        createElementsPool: function({ poolName, createElement, beforePush, afterPop }) {
            const formattedPoolName = `[${poolName} Pool]`;

            if (createElement == null) {
                throw `${formattedPoolName} createElement is required`;
            }

            // If any of the hooks are empty, fill them with empty functions so we avoid if-checks in hot paths
            if (beforePush == null) {
                beforePush = function() {};
            }

            if (afterPop == null) {
                afterPop = function() {};
            }

            const poolIndex = nextPoolIndex;

            pool_elements[poolIndex] = [];
            pool_names[poolIndex] = formattedPoolName;
            pool_createElementHooks[poolIndex] = createElement;
            pool_beforePushHooks[poolIndex] = beforePush;
            pool_afterPopHooks[poolIndex] = afterPop;

            // poolManager.log(poolIndex, "creating pool", pool_createElementHooks);

            nextPoolIndex++;

            return poolIndex;
        },
        prePopulateElementsPool: function(poolIndex, total) {
            for (let i = 0; i < total; i++) {
                const element = createNewElement(poolIndex);
                poolManager.returnElementToPool(poolIndex, element);
            }
        },
        returnElementToPool: function(poolIndex, element) {
            /* DEBUG */
            if (!BitmaskableObjectOperations.has(element.pool, POOL_TYPE)) {
                poolManager.error("Returning the element to the wrong pool", element, element.pool);
                return;
            }

            if (!element.outOfPool) {
                poolManager.error("Returning the element which wasn't marked as out-of-pool", element, element.pool);
                return;
            }
            /********/

            element.outOfPool = false;

            pool_beforePushHooks[poolIndex](element);
            pool_elements[poolIndex].push(element);
        },
        fetchElementFromPool: function(poolIndex) {
            if (pool_elements[poolIndex].length <= 0) {
                poolManager.warn(poolIndex, "No more elements in pool so creating a new one");
                const element = createNewElement(poolIndex);

                return handleAfterPop(poolIndex, element);
            }

            const element = pool_elements[poolIndex].pop();
            return handleAfterPop(poolIndex, element);
        },
        log: function(poolIndex) {
            // Prepend the arguments with the pool name
            Array.prototype.unshift.call(arguments, pool_names[poolIndex]);
            Logger.log.apply(null, arguments);
        },
        warn: function(poolIndex) {
            // Prepend the arguments with the pool name
            Array.prototype.unshift.call(arguments, pool_names[poolIndex]);
            Logger.warn.apply(null, arguments);
        },
        error: function(poolIndex) {
            // Prepend the arguments with the pool name
            Array.prototype.unshift.call(arguments, pool_names[poolIndex]);
            Logger.error.apply(null, arguments);
        }
    };

    return poolManager;
}());

/*
 * Pools that serves Phaser GameObjects
 */
const GameObjectPoolManager = (function() {
    const POOL_TYPE = PoolType.GameObject;

    const poolPositionX = 200, poolPositionY = 200;

    const gameObjectPoolManager = {
        createGameObjectPool: function({ poolName, createElement, beforePush, afterPop }) {
            // Create the pool
            const poolIndex = PoolsManager.createElementsPool(
                {
                    poolName: poolName,
                    createElement: function() {
                        // Create the body
                        const gameObject = createElement();
                        gameObject.pool = BitmaskableObjectOperations.add(gameObject.pool, POOL_TYPE);

                        // move it out of view
                        gameObject.setPosition(poolPositionX, poolPositionY);

                        return gameObject;
                    },
                    beforePush: beforePush,
                    afterPop: afterPop
                });

            return poolIndex;
        },
        prePopulateGameObjectsPool: PoolsManager.prePopulateElementsPool,
        fetchGameObjectFromPool: PoolsManager.fetchElementFromPool,
        returnGameObjectToPool: function(poolIndex, gameObject) {
            if (!BitmaskableObjectOperations.has(gameObject.pool, POOL_TYPE)) {
                PoolsManager.error("Returning the element to the wrong pool", gameObject);
                return;
            }

            // move it out of view
            gameObject.setPosition(poolPositionX, poolPositionY);

            PoolsManager.returnElementToPool(poolIndex, gameObject);
        }
    };

    return gameObjectPoolManager;
}());

/*
 * Pools that serves Matter GameObjects
 */
const MatterGameObjectPoolManager = (function() {
    const POOL_TYPE = PoolType.MatterGameObject;

    const matterGameObjectPoolManager = {
        createMatterGameObjectPool: function({ poolName, createElement, beforePush, afterPop }) {
            const poolIndex = GameObjectPoolManager.createGameObjectPool(
                {
                    poolName: poolName,
                    createElement: function() {
                        // Create the body
                        const matterGameObject = createElement();
                        matterGameObject.pool = BitmaskableObjectOperations.add(matterGameObject.pool, POOL_TYPE);

                        // Disable the physics
                        PhysicsBodies.disableMatterGameObject(matterGameObject);

                        return matterGameObject;
                    },
                    beforePush: beforePush,
                    afterPop: afterPop
                });

            return poolIndex;
        },
        prePopulateMatterGameObjectsPool: GameObjectPoolManager.prePopulateGameObjectsPool,
        fetchMatterGameObjectFromPool: GameObjectPoolManager.fetchGameObjectFromPool,
        returnMatterGameObjectToPool: function(poolIndex, matterGameObject) {
            if (!BitmaskableObjectOperations.has(matterGameObject.pool, POOL_TYPE)) {
                PoolsManager.error("Returning the element to the wrong pool", matterGameObject);
                return;
            }

            // Disable and hide the gameObject
            PhysicsBodies.disableMatterGameObject(matterGameObject);

            GameObjectPoolManager.returnGameObjectToPool(poolIndex, matterGameObject);
        }
    };

    return matterGameObjectPoolManager;
}());

