"use strict";

const ObjectAnchorManager = (function () {

    let objectsAnchoredToGameObjects_anchoredGameObjects = new Map();
    let objectsAnchoredToGameObjects_anchorGameObjects = new Map();
    let objectsAnchoredToGameObjects_originOffsetX = new Map();
    let objectsAnchoredToGameObjects_originOffsetY = new Map();
    let lastAnchorageIndexCreated = -1;

    const objectAnchorManager = {
        update: function () {
            for (let index of objectsAnchoredToGameObjects_anchoredGameObjects.keys()) {
                const anchoredGameObject = objectsAnchoredToGameObjects_anchoredGameObjects.get(index);
                const anchorGameObject = objectsAnchoredToGameObjects_anchorGameObjects.get(index);
                const originOffsetX = objectsAnchoredToGameObjects_originOffsetX.get(index);
                const originOffsetY = objectsAnchoredToGameObjects_originOffsetY.get(index);

                const anchorGameObjectPosition = anchorGameObject.getCenter();
                const anchorGameObjectRotation_radians = anchorGameObject.rotation;

                const rotatedOffsetX = ROBOT_SCALE * originOffsetX * Math.cos(anchorGameObjectRotation_radians) - originOffsetY * Math.sin(anchorGameObjectRotation_radians);
                const rotatedOffsetY = ROBOT_SCALE * originOffsetX * Math.sin(anchorGameObjectRotation_radians) + originOffsetY * Math.cos(anchorGameObjectRotation_radians);

                const gameObjectPositionX = anchorGameObjectPosition.x + rotatedOffsetX;
                const gameObjectPositionY = anchorGameObjectPosition.y + rotatedOffsetY;
                anchoredGameObject.setPosition(gameObjectPositionX, gameObjectPositionY);
            }
        },
        anchorToGameObject: function (anchoredGameObject, anchorGameObject, originOffsetX, originOffsetY) {
            const anchorageIndex = ++lastAnchorageIndexCreated;
            objectsAnchoredToGameObjects_anchoredGameObjects.set(anchorageIndex, anchoredGameObject);
            objectsAnchoredToGameObjects_anchorGameObjects.set(anchorageIndex, anchorGameObject);
            objectsAnchoredToGameObjects_originOffsetX.set(anchorageIndex, originOffsetX);
            objectsAnchoredToGameObjects_originOffsetY.set(anchorageIndex, originOffsetY);
            return anchorageIndex;
        },
        removeAnchor: function (anchorageIndex) {
            objectsAnchoredToGameObjects_anchoredGameObjects.delete(anchorageIndex);
            objectsAnchoredToGameObjects_anchorGameObjects.delete(anchorageIndex);
            objectsAnchoredToGameObjects_originOffsetX.delete(anchorageIndex);
            objectsAnchoredToGameObjects_originOffsetY.delete(anchorageIndex);
        }
    };

    return objectAnchorManager;
}());
