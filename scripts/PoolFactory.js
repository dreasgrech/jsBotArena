"use strict";

/*
const PhaserGroupFactory = (function () {
    const groups = {};

    const phaserGroupFactory = {
        createGroup: function({key, maxSize, onCreate, onRemove}) {
            if (groups[key]) {
                throw `We already have a group called ${key}`;
            }

            const gameContext = GameContextHolder.gameContext;

            // Create the group
            const group = gameContext.add.group({
                defaultKey: key,
                maxSize: maxSize,
                createCallback: onCreate,
                removeCallback: onRemove,
                classType: Phaser.Physics.Matter.Sprite,
                active: false
            });

            console.log("created group", key);

            // Prepopulate the group
            //group.createMultiple({
            //    active: false,
            //    visible: false,
            //    key: key,
            //    repeat: maxSize - 1,
            //});

            for (let i = 0; i < maxSize; i++) {
                console.log('before');
                // const sprite = gameContext.matter.add.sprite(-0+((i+1)*40), 200, key, null, { });
                const sprite = gameContext.matter.add.sprite(0, 0, key, null, { });
                // new Phaser.Physics.Matter.Sprite(this.world, x, y, key, frame, options);
                sprite.setCollisionCategory(null);
                sprite.setActive(false);
                //sprite.setVisible(false);
                group.add(sprite);
                console.log('after', sprite.body);
            }

            groups[key] = group;

            //console.log(group);

            return group;
        }
    };

    return phaserGroupFactory;
}());
*/

const PoolFactory = (function() {
    // const pools = {};

    const poolFactory = {
        createPool: function({ poolName, createElement, beforePush, afterPop }) {
            Logger.log("Creating pool", poolName);
            return (function() {
                const elements = [];
                let elementsLength = 0;

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

                const log = function() {
                    // Prepend the arguments with the pool name
                    Array.prototype.unshift.call(arguments, formattedPoolName);
                    Logger.log.apply(null, arguments);
                }, warn = function() {
                    // Prepend the arguments with the pool name
                    Array.prototype.unshift.call(arguments, formattedPoolName);
                    Logger.warn.apply(null, arguments);
                };

                const handlePop = function(element) {
                    elementsLength--;
                    afterPop(element);
                    return element;
                };

                const pool = {
                    prePopulate: function(total) {
                        log('Prepopulating:', total);
                        for (let i = 0; i < total; i++) {
                            const element = createElement();
                            pool.push(element);
                        }
                    },
                    push: function(element) {
                        beforePush(element);
                        elements.push(element);
                        elementsLength++;
                    },
                    pop: function() {
                        if (elementsLength <= 0) {
                            warn("No more elements in pool so creating a new one");
                            const element = createElement();
                            elementsLength++;
                            return handlePop(element);
                        }

                        const element = elements.pop();
                        return handlePop(element);
                    }
                };

                return pool;
            }({ poolName, createElement, beforePush, afterPop }));
        }
    };

    return poolFactory;
}());