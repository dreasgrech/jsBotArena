"use strict";

const ImageDatabase = (function() {

    // TODO: Replace with a json database which contains all the spritesheets which need to be loaded
    const GameElementsSpritesheetKey = "GameElementsSpritesheet",
        GameElementsSpritesheetAtlasFilePath = "./images/Spritesheets/GameSpritesheet.json",
        GameElementsSpritesheetTextureDirectory = "./images/Spritesheets/";

    // const loadImage = function(identifier, filePath) {
    //     GameContextHolder.scene.load.image(identifier, filePath);
    //     // console.log(identifier, filePath);
    // };

    // Loads all the filenames in the directory
    //const loadImageList = function(filenames, imagesKeys, directory) {
    //    console.assert(filenames.length === imagesKeys.length);
    //    for (let i = 0; i < filenames.length; i++) {
    //        const filename = filenames[i];
    //        const fullPath = `${directory}/${filename}`;
    //        const imageIdentifier = imagesKeys[i];

    //        // Load the image
    //        loadImage(imageIdentifier, fullPath);
    //    }
    //};

    return {
        system_preloadOnce: function(){
            //Load the game elements spritesheet
            const gameContext = GameContextHolder.scene;
            //gameContext.load.on(`filecomplete-multiatlas-${GameElementsSpritesheetKey}`, function (key, type, data) {
            //    //console.log("finished loading", key, type, data, savedThis.textures.get(pt.Tiles).frames);
            //    console.log("finished loading", key, type, data);
            //});
            gameContext.load.multiatlas(
                GameElementsSpritesheetKey,
                GameElementsSpritesheetAtlasFilePath,
                GameElementsSpritesheetTextureDirectory);
            
        },
        get GameElementsSpritesheetKey() {
            return GameElementsSpritesheetKey;
        }
    };
}());

