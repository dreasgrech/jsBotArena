"use script";

const EnumHelpers = (function() {
    const obj = {
        // Usage: const directions = EnumHelpers.createEnum(['Up', 'Down', 'Left', 'Right']);
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
