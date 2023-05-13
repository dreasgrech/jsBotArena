"use strict";

const ImageDatabase = (function() {
    const baseImagesDirectory = 'images';
    const robotImagesDirectory = `${baseImagesDirectory}/robots`;
    const projectileImagesDirectory = `${baseImagesDirectory}/Projectiles`;
    const tracksImagesDirectory = `${baseImagesDirectory}/Tracks`;

    const hullsImagesDirectory = `${robotImagesDirectory}/Hulls`;
    const turretsImagesDirectory = `${robotImagesDirectory}/Turrets`;

    const totalTracks = 4;

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

        // Load the tracks images
        for (let i = 0; i < totalTracks; i++) {
            let track = `Track_${i + 1}`;
            let trackAIdentifier = `${track}_A`;
            let trackBIdentifier = `${track}_B`;

            loadImage(trackAIdentifier, `${tracksImagesDirectory}/${trackAIdentifier}.png`);
            loadImage(trackBIdentifier, `${tracksImagesDirectory}/${trackBIdentifier}.png`);
        }
    };

    return {
        system_preload: loadAllImages,
        loadProjectileImages: function(filenames, keys) {
            loadImageList(filenames, keys, projectileImagesDirectory);
        },
        loadHullImages: function(filenames, keys) {
            loadImageList(filenames, keys, hullsImagesDirectory);
        },
        loadTurretImages: function(filenames, keys) {
            loadImageList(filenames, keys, turretsImagesDirectory);
        }
    };
}());

