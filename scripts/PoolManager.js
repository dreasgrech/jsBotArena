"use strict";

const PoolManager = (function() {
    const MAX_POSITIONS_TO_RESERVE_PER_POOL = 100; // The maximum allowed per pool

    let nextPoolIndex = 0;

    // The array that contains all the elements of all the pools
    // 
    //const poolsAllocatedTotals = []; // TODO: wasn't sure if I should have a separate array for the pools allocated totals, or just use spaces in the main pools array like having the total as the first number before the elements, but then I'm thinking if I have the totals in their own array, then they'll be next to each other in memory

    const pool_elements = [];
    const pool_elementsTotals = [];
    const pool_names = [];
    const pool_createElementHooks = [];
    const pool_beforePushHooks = [];
    const pool_afterPopHooks = [];
    const pool_currentlyPrePopulating = [];

    const handlePop = function(poolIndex, element) {
        pool_elementsTotals[poolIndex]--;
        pool_afterPopHooks[poolIndex](element);
        element.outOfPool = true;
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

    const poolManager = {
        createPool: function({ poolName, createElement, beforePush, afterPop }) {
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
            pool_elementsTotals[poolIndex] = 0;
            pool_names[poolIndex] = formattedPoolName;
            pool_createElementHooks[poolIndex] = createElement;
            pool_beforePushHooks[poolIndex] = beforePush;
            pool_afterPopHooks[poolIndex] = afterPop;
            pool_currentlyPrePopulating[poolIndex] = false;

            nextPoolIndex++;

            return poolIndex;
        },
        prePopulate: function(poolIndex, total) {
            pool_currentlyPrePopulating[poolIndex] = true;
            const createElement = pool_createElementHooks[poolIndex];
            const pool = pool_elements[poolIndex];
            for (let i = 0; i < total; i++) {
                const element = createElement();
                poolManager.push(poolIndex, element);
            }
            pool_currentlyPrePopulating[poolIndex] = false;
        },
        push: function(poolIndex, element) {
            /* DEBUG */
            if (!element.outOfPool) {
                if (!pool_currentlyPrePopulating[poolIndex]) {
                    throw "Trying to return the wrong element to the pool: " + element;
                }
            }
            /********/

            pool_beforePushHooks[poolIndex](element);
            pool_elements[poolIndex].push(element);
            pool_elementsTotals[poolIndex]++;
        },
        pop: function(poolIndex) {
            if (pool_elementsTotals[poolIndex] <= 0) {
                warn(poolIndex, "No more elements in pool so creating a new one");
                const element = pool_createElementHooks[poolIndex]();
                pool_elementsTotals[poolIndex]++;

                return handlePop(poolIndex, element);
            }

            const element = pool_elements[poolIndex].pop();
            return handlePop(poolIndex, element);
        }
    };
    return poolManager;
}());

const MatterBodyPoolManager = (function() {
    const poolPositionX = 200,
        poolPositionY = 200;

    const pool_createElementHooks = [];

    const createMatterBody = function(poolIndex) {
        // Create the body
        const matterBody = pool_createElementHooks[poolIndex]();

        // Disable it and move it out of view
        matterBody.setPosition(poolPositionX, poolPositionY);
        PhysicsBodies.disableMatterGameObject(matterBody);

        return matterBody;
    };

    const matterBodyPoolManager = {
        createMatterBodyPool: function({ poolName, createElement, beforePush, afterPop }) {
            //const poolIndex = PoolManager.createPool(...arguments); // TODO: <-- Try this
            const poolIndex = PoolManager.createPool(
                {
                    poolName: poolName,
                    createElement: createMatterBody,
                    beforePush: beforePush,
                    afterPop: afterPop
                });

            pool_createElementHooks[poolIndex] = createElement;

            return poolIndex;
        },
        prePopulate: function(poolIndex, total) {
            return PoolManager.prePopulate(poolIndex, total);
        },
        push: function(poolIndex, matterBody) {
            PoolManager.push(poolIndex, matterBody);
            PhysicsBodies.disableMatterGameObject(matterBody);
            matterBody.setPosition(poolPositionX, poolPositionY);
        },
        pop: function(poolIndex) {
            return PoolManager.pop(poolIndex);
        }
    };

    return matterBodyPoolManager;
}());
