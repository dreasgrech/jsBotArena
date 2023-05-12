"use strict";

const PoolType = BitmaskableObjectOperations.populateBitmaskableObject({
    Generic: 0,
    GameObject: 0,
    MatterGameObject: 0
});

const PoolsManager = (function() {
    const POOL_TYPE = PoolType.Generic;

    let nextPoolIndex = 0;

    const pool_elements = [];
    // const pool_elementsTotals = [];
    const pool_names = [];
    const pool_createElementHooks = [];
    const pool_beforePushHooks = [];
    const pool_afterPopHooks = [];
    const pool_currentlyPrePopulating = [];

    const handleAfterPop = function(poolIndex, element) {
        // pool_elementsTotals[poolIndex]--;
        pool_afterPopHooks[poolIndex](element);
        element.outOfPool = true;
        element.pool = BitmaskableObjectOperations.add(element.pool, POOL_TYPE);
        return element;
    };

    const log = function(poolIndex) {
            // Prepend the arguments with the pool name
            Array.prototype.unshift.call(arguments, pool_names[poolIndex]);
            Logger.log.apply(null, arguments);
        },
        warn = function(poolIndex) {
            // Prepend the arguments with the pool name
            Array.prototype.unshift.call(arguments, pool_names[poolIndex]);
            Logger.warn.apply(null, arguments);
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
            // pool_elementsTotals[poolIndex] = 0;
            pool_names[poolIndex] = formattedPoolName;
            pool_createElementHooks[poolIndex] = createElement;
            pool_beforePushHooks[poolIndex] = beforePush;
            pool_afterPopHooks[poolIndex] = afterPop;
            //pool_currentlyPrePopulating[poolIndex] = false;

            // log(poolIndex, "creating pool", pool_createElementHooks);

            nextPoolIndex++;

            return poolIndex;
        },
        prePopulateElementsPool: function(poolIndex, total) {
            // log(poolIndex, "prepopulating", poolIndex, total);
            //pool_currentlyPrePopulating[poolIndex] = true;
            // const createElement = pool_createElementHooks[poolIndex];
            for (let i = 0; i < total; i++) {
                // const element = createElement();
                const element = createNewElement(poolIndex);
                //element.outOfPool = false;
                //element.pool = BitmaskableObjectOperations.add(element.pool, POOL_TYPE);
                // poolManager.push(poolIndex, element);
                poolManager.returnElementToPool(poolIndex, element);
            }
            //pool_currentlyPrePopulating[poolIndex] = false;
        },
        returnElementToPool: function(poolIndex, element) {
            /* DEBUG */
            if (!BitmaskableObjectOperations.has(element.pool, POOL_TYPE)) {
                Logger.error("Returning the element to the wrong pool", element, element.pool);
                return;
            }

            if (!element.outOfPool) {
                Logger.error("Returning the element which wasn't marked as out-of-pool", element, element.pool);
                return;
            }
            /********/

            element.outOfPool = false;
            element.pool = 0;

            pool_beforePushHooks[poolIndex](element);
            pool_elements[poolIndex].push(element);
            // pool_elementsTotals[poolIndex]++;
        },
        fetchElementFromPool: function(poolIndex) {
            // if (pool_elementsTotals[poolIndex] <= 0) {
            if (pool_elements[poolIndex].length <= 0) {
                warn(poolIndex, "No more elements in pool so creating a new one");
                const element = createNewElement(poolIndex);
                //pool_elementsTotals[poolIndex]++;

                return handleAfterPop(poolIndex, element);
            }

            const element = pool_elements[poolIndex].pop();
            return handleAfterPop(poolIndex, element);
        }
    };
    return poolManager;
}());

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
        returnGameObjectToPool: function(poolIndex, gameObject) {
            if (!BitmaskableObjectOperations.has(gameObject.pool, POOL_TYPE)) {
                Logger.error("Returning the element to the wrong pool", gameObject);
                return;
            }

            PoolsManager.returnElementToPool(poolIndex, gameObject);

            // move it out of view
            gameObject.setPosition(poolPositionX, poolPositionY);
        },
        fetchGameObjectFromPool: function(poolIndex) {
            const element = PoolsManager.fetchElementFromPool(poolIndex);
            element.pool = BitmaskableObjectOperations.add(element.pool, POOL_TYPE);
            return element;
        }
    };

    return gameObjectPoolManager;
}());

const MatterGameObjectPoolManager = (function() {
    const POOL_TYPE = PoolType.MatterGameObject;

    const matterGameObjectPoolManager = {
        createMatterGameObjectPool: function({ poolName, createElement, beforePush, afterPop }) {
            // Create the pool
            const poolIndex = GameObjectPoolManager.createGameObjectPool(
                {
                    poolName: poolName,
                    createElement: function() {
                        // Create the body
                        const matterGameObject = createElement();

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
        returnMatterGameObjectToPool: function(poolIndex, matterGameObject) {
            if (!BitmaskableObjectOperations.has(matterGameObject.pool, POOL_TYPE)) {
                Logger.error("Returning the element to the wrong pool", matterGameObject);
                return;
            }

            // Disable and hide the gameObject
            PhysicsBodies.disableMatterGameObject(matterGameObject);

            GameObjectPoolManager.returnGameObjectToPool(poolIndex, matterGameObject);
        },
        fetchMatterGameObjectFromPool: function(poolIndex) {
            const element = GameObjectPoolManager.fetchGameObjectFromPool(poolIndex);
            element.pool = BitmaskableObjectOperations.add(element.pool, POOL_TYPE);
            return element;
        }
    };

    return matterGameObjectPoolManager;
}());

