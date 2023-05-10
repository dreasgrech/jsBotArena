"use strict";

const NumberOperations = (function() {

    const numberOperations = {
        lerp: function(a, b, t) {
            return (1 - t) * a + t * b;
        }
    };

    return numberOperations;
}());
