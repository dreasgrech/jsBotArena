const JSObjectOperations = (function() {
    const jsObjectOperations = {
        // Only used for debug purposes
        getObjectTypeName: function(obj) {
            return obj.constructor.name;
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

    return jsObjectOperations;
}());
