"use strict";

var FilePathHelpers = (function() {

    return {
        removeFileExtension: function(fileName) {
            const lastDotIndex = fileName.lastIndexOf('.');
            if (lastDotIndex === -1) {
                return fileName;
            }

            return fileName.slice(0, lastDotIndex);
        }
    };
}());