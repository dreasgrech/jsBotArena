"use strict";

/*
 * Pools that serves Phaser GameObjects
 */
const GameObjectPoolsManager = (function() {
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
                        // gameObject.setPosition(poolPositionX, poolPositionY);

                        //gameObject.setActive(false);
                        //gameObject.setVisible(false);

                        return gameObject;
                    },
                    beforePush: beforePush,
                    afterPop: afterPop
                });

            return poolIndex;
        },
        prePopulateGameObjectsPool: function(poolIndex, total) {
            for (let i = 0; i < total; i++) {
                const element = gameObjectPoolManager.createNewGameObject(poolIndex);
                gameObjectPoolManager.returnGameObjectToPool(poolIndex, element);
            }
        },
        fetchGameObjectFromPool: poolIndex => {
            const gameObject = PoolsManager.fetchElementFromPool(poolIndex);
            gameObject.setActive(true);
            gameObject.setVisible(true);
            return gameObject;
        },
        returnGameObjectToPool: function(poolIndex, gameObject) {
            if (!BitmaskableObjectOperations.has(gameObject.pool, POOL_TYPE)) {
                PoolsManager.error("Returning the element to the wrong pool", gameObject);
                return;
            }

            // move it out of view
            gameObject.setPosition(poolPositionX, poolPositionY);

            gameObject.setActive(false);
            gameObject.setVisible(false);

            PoolsManager.returnElementToPool(poolIndex, gameObject);
        },
        createNewGameObject: function(poolIndex) {
            const element = PoolsManager.createNewElement(poolIndex);
            return element;
        }
    };

    return gameObjectPoolManager;
}());
