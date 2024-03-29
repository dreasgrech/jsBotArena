"use strict";

// This enum is used when verifying that an item belongs to the correct pool it was spawned from
const PoolType = BitmaskableObjectOperations.populateBitmaskableObject({
    Generic: 0,
    GameObject: 0,
    MatterGameObject: 0
});

/** The values of how many elements are pre-populated */
const PoolsPrepopulateValues = {
    Projectiles: 50,
    //Projectiles: 0,
    Animations: 50, // TODO: this needs to be split into different values
    //Animations: 0, // TODO: this needs to be split into different values
};

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
    
    // const poolsTweakpaneFolders = [];
    let poolsTweakpaneFolderID;

    const handleAfterPop = function(poolIndex, element) {
        pool_afterPopHooks[poolIndex](element);
        element.outOfPool = true;
        element.pool = BitmaskableObjectOperations.add(element.pool, POOL_TYPE);
        return element;
    };

    const poolManager = {
        system_preloadOnce: function(){
            poolsTweakpaneFolderID = TweakPaneManager.createFolder("Pools");
        },
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
            
            // // Create the tweakpane folder for this pool
            // const tweakpaneFolderID = TweakPaneManager.createFolder(formattedPoolName)
            // poolsTweakpaneFolders[poolIndex] = tweakpaneFolderID;
            const dataForTweakPane = {
                get poolIndex(){
                    return poolIndex;
                },
                get poolName(){
                    return poolName;
                },
                get elementsTotal(){
                    return pool_elements[poolIndex].length;
                }
            };
            TweakPaneManager.createMonitorInFolder(poolsTweakpaneFolderID, dataForTweakPane, 'poolName');
            TweakPaneManager.createMonitorInFolder(poolsTweakpaneFolderID, dataForTweakPane, 'poolIndex');
            TweakPaneManager.createMonitorInFolder(poolsTweakpaneFolderID, dataForTweakPane, 'elementsTotal');
            TweakPaneManager.createSeparatorFolder(poolsTweakpaneFolderID);

            return poolIndex;
        },
        prePopulateElementsPool: function(poolIndex, total) {
            for (let i = 0; i < total; i++) {
                const element = poolManager.createNewElement(poolIndex);
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
            
            // poolManager.log(poolIndex, "Returned element to pool", element, pool_elements[poolIndex]);
        },
        fetchElementFromPool: function(poolIndex) {
            if (pool_elements[poolIndex].length <= 0) {
                poolManager.warn(poolIndex, "No more elements in pool so creating a new one");
                const element = poolManager.createNewElement(poolIndex);

                return handleAfterPop(poolIndex, element);
            }

            const element = pool_elements[poolIndex].pop();
            // poolManager.log(poolIndex, "Fetched element from pool", element, pool_elements[poolIndex]);
            return handleAfterPop(poolIndex, element);
        },
        createNewElement: function(poolIndex) {
            // Execute the pool's createElement hook
            const element = pool_createElementHooks[poolIndex]();

            // Set some pool-specific data that help us debug issues
            element.outOfPool = true;
            element.pool = BitmaskableObjectOperations.add(element.pool, POOL_TYPE);

            return element;
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
