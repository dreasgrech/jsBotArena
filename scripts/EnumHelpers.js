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
        },
        // Creates a lookup key based on two numbers.  
        // Inversing the numbers returns the same results
        createLookupKey: function(number1, number2) {
            var key = Math.min(number1, number2) * 1000 + Math.max(number1, number2);
            if (isNaN(key)) {
                throw `${number1} and ${number2} have created a NaN key!`;
            }

            return key;
        }
    };

    return obj;
}());
