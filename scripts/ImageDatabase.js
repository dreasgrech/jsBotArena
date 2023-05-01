"use strict";

const ImageDatabase = (function() {
    const baseImagesDirectory = 'images';
    const robotImagesDirectory = `${baseImagesDirectory}/robots`;
    const projectileImagesDirectory = `${baseImagesDirectory}/Projectiles`;
    const tracksImagesDirectory = `${baseImagesDirectory}/Tracks`;

    // const projectileFilenames = ['Granade_Shell.png', 'Heavy_Shell.png', 'Light_Shell.png', 'Medium_Shell.png', 'Shotgun_Shells.png'];

    const totalHullsColors = 4, totalHullsVariations = 8;
    const totalWeaponsColors = 4, totalWeaponsVariations = 8;
    const totalTracks = 4;

    const loadImage = function(identifier, filePath) {
        GameContextHolder.gameContext.load.image(identifier, filePath);
        // console.log(identifier, filePath);
    };

    // Loads all the filenames in the directory
    const loadImageList = function(filenames, directory) {
        for (let i = 0; i < filenames.length; i++) {
            let filename = filenames[i];
            let fullPath = `${directory}/${filename}`;
            let imageIdentifier = FilePathHelpers.removeFileExtension(filename);

            // Load the image
            loadImage(imageIdentifier, fullPath);
        }
    };

    const loadAllImages = function() {

        // Load arena images
        loadImage('floor_image', 'images/Floor - Dirt 2 64x64.png');
        loadImage('wall_image', 'images/Wall - Brick 2 64x64.png');

        // Iterate Hulls colors
        for (let i = 0; i < totalHullsColors; i++) {
            let characterCode = 65 + i; // 'A' = 65, 'B' = 66, etc.
            let directoryName = `Hulls_Color_${String.fromCharCode(characterCode)}`;
            // Iterate Hulls variations
            for (let j = 0; j < totalHullsVariations; j++) {
                let fileName = `Hull_0${j + 1}`;
                let fullPath = `${robotImagesDirectory}/${directoryName}/${fileName}.png`;

                let imageIdentifier = `${directoryName}/${fileName}`;

                // load the hull image
                loadImage(imageIdentifier, fullPath);
            }
        }

        // Iterate weapons colors
        for (let i = 0; i < totalWeaponsColors; i++) {
            let characterCode = 65 + i; // 'A' = 65, 'B' = 66, etc.
            let directoryName = `Weapon_Color_${String.fromCharCode(characterCode)}`;
            // Iterate weapons variations
            for (let j = 0; j < totalWeaponsVariations; j++) {
                let fileName = `Gun_0${j + 1}`;
                let fullPath = `${robotImagesDirectory}/${directoryName}/${fileName}.png`;

                let imageIdentifier = `${directoryName}/${fileName}`;

                // load the weapon image
                loadImage(imageIdentifier, fullPath);
            }
        }

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
        loadProjectileImages: function(projectilesImageFilenames) {
            loadImageList(projectilesImageFilenames, projectileImagesDirectory);
        }
    };
}());

