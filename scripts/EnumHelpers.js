"use script";

var EnumHelpers = (function() {
    var obj = {
        // Usage: var directions = EnumHelpers.createEnum(['Up', 'Down', 'Left', 'Right']);
        createEnum: function(values) {
            const enumObject = {};
            for (const val of values) {
                enumObject[val] = val;
            }

            return Object.freeze(enumObject);
        }
    };

    return obj;
}());
