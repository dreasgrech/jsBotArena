"use strict";

const EnumHelpers = (function() {
    const enumHelpers = {
        // Usage: const directions = EnumHelpers.createEnum(['Up', 'Down', 'Left', 'Right']);
        createEnumWithStringValues: function(values) {
            const enumObject = {};
            for (const val of values) {
                enumObject[val] = val;
            }

            return Object.freeze(enumObject);
        },
        // Usage: const directions = EnumHelpers.createEnum(['Up', 'Down', 'Left', 'Right']);
        createEnumWithNumberValues: function(values) {
            let currentValue = 0;
            const enumObject = {};
            for (const val of values) {
                enumObject[val] = currentValue++;
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
        },
        getRandomKey: function(obj) {
            const keys = Object.keys(obj);

            return keys[Math.floor(Math.random() * keys.length)];
        },
        getRandomValue: function(obj) {
            const values = Object.values(obj);

            return values[Math.floor(Math.random() * values.length)];
        }
    };

    return enumHelpers;
}());
