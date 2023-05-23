"use strict";

// TODO: Create a json database which contains all the spritesheets which need to be loaded

const ImageDatabase = (function() {
    const baseImagesDirectory = 'images';
    const robotImagesDirectory = `${baseImagesDirectory}/robots`;
    const projectileImagesDirectory = `${baseImagesDirectory}/Projectiles`;
    const tracksImagesDirectory = `${baseImagesDirectory}/Tracks`;

    const hullsImagesDirectory = `${robotImagesDirectory}/Hulls`;
    const turretsImagesDirectory = `${robotImagesDirectory}/Turrets`;

    // const totalTracks = 4;

    // TODO: Replace with a json database which contains all the spritesheets which need to be loaded
    const GameElementsSpritesheetKey = "GameElementsSpritesheet",
        GameElementsSpritesheetAtlasFilePath = "./images/Spritesheets/GameSpritesheet.json",
        GameElementsSpritesheetTextureDirectory = "./images/Spritesheets/";

    const loadImage = function(identifier, filePath) {
        GameContextHolder.gameContext.load.image(identifier, filePath);
        // console.log(identifier, filePath);
    };

    // Loads all the filenames in the directory
    const loadImageList = function(filenames, imagesKeys, directory) {
        console.assert(filenames.length === imagesKeys.length);
        for (let i = 0; i < filenames.length; i++) {
            let filename = filenames[i];
            let fullPath = `${directory}/${filename}`;
            let imageIdentifier = imagesKeys[i];

            // Load the image
            loadImage(imageIdentifier, fullPath);
        }
    };

    const loadAllImages = function() {

        // Load arena images
        loadImage('floor_image', 'images/Arena/Floor - Dirt 2 64x64.png');
        loadImage('wall_image', 'images/Arena/Wall - Brick 2 64x64.png');

        //    // Load the tracks images
        //    for (let i = 0; i < totalTracks; i++) {
        //        let track = `Track_${i + 1}`;
        //        let trackAIdentifier = `${track}_A`;
        //        let trackBIdentifier = `${track}_B`;

        //        loadImage(trackAIdentifier, `${tracksImagesDirectory}/${trackAIdentifier}.png`);
        //        loadImage(trackBIdentifier, `${tracksImagesDirectory}/${trackBIdentifier}.png`);
        //    }

        //Load the game elements spritesheet
        const gameContext = GameContextHolder.gameContext;
        //gameContext.load.on(`filecomplete-multiatlas-${GameElementsSpritesheetKey}`, function (key, type, data) {
        //    //console.log("finished loading", key, type, data, savedThis.textures.get(pt.Tiles).frames);
        //    console.log("finished loading", key, type, data);
        //});
        gameContext.load.multiatlas(
            GameElementsSpritesheetKey,
            GameElementsSpritesheetAtlasFilePath,
            GameElementsSpritesheetTextureDirectory);
    };

    return {
        system_preload: loadAllImages,
        //loadProjectileImages: function(filenames, keys) {
        //    loadImageList(filenames, keys, projectileImagesDirectory);
        //},
        ////loadHullImages: function(filenames, keys) {
        ////    loadImageList(filenames, keys, hullsImagesDirectory);
        ////},
        //loadTurretImages: function(filenames, keys) {
        //    //loadImageList(filenames, keys, turretsImagesDirectory);
        //},
        get GameElementsSpritesheetKey() {
            return GameElementsSpritesheetKey;
        }
    };
}());

