"use strict";

//const BitmaskableObjectOperator = function() {
//    let state;

//    const bitmaskableObjectOperator = {
//        add: function(mask) {
//            state |= mask;
//        },
//        remove: function(mask) {
//            state &= ~mask;
//        },
//        toggle: function(mask) {
//            state ^= mask;
//        },
//        has: function(mask) {
//            return (state & mask) !== 0;
//        }
//    };

//    return bitmaskableObjectOperator;
//};

const BitmaskableObjectOperations = (function() {

    const bitmaskableObjectOperations = {
        add: function(state, mask) {
            state |= mask;
            return state;
        },
        remove: function(state, mask) {
            state &= ~mask;
            return state;
        },
        toggle: function(state, mask) {
            state ^= mask;
            return state;
        },
        has: function(state, mask) {
            return (state & mask) !== 0;
        },
        populateBitmaskableObject: function(obj) {
            // Assign the correct 2^n value to each category
            var i = 0;
            for (let field in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, field)) {
                    const value = Math.pow(2, i);
                    // Logger.log(field, `value ${value} = pow(2, ${i})`);
                    obj[field] = value;
                    i++;
                }
            }

            return obj;
        }
    };

    return bitmaskableObjectOperations;
}());
