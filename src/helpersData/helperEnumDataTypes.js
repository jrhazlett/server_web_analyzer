"use strict";
/*
This is used for identifying and encoding data types.

Its 100% static, so it should only exist in memory once.
*/
//
// Public
//
export default class helperEnumDataTypes {
    // These data types are iterated through, but aren't actually directly printed to output
    static fieldArray = 1;
    static fieldObject = 2;

    // These data types trigger debugging messages
    static fieldError = 3;
    static fieldPromise = 4;
    static fieldCircularReference = 5;

    // This data type requires special formatting to avoid dumping the function
    // defs onto the screen
    static fieldFunction = 6;

    // This data type is generally what gets printed to the output
    static fieldEitherNonIterableOrString = 7;

    static fieldSymbol = 8;

    static fieldMap = 9;

    static fieldSet = 10;

    /**
     * @param {any} arg
     * @returns number
     * */
    static getEnumDataType = (arg) => {
        switch (typeof arg) {
            //
            // Function
            //
            case "function": return helperEnumDataTypes.fieldFunction;
            //
            // Object
            //
            case "object": return helperEnumDataTypes._getEnumDataTypeForObject(arg);
            //
            // Symbol
            //
            // Reminder: This is important because symbols do *not* support `${}` string conversions
            case "symbol": return helperEnumDataTypes.fieldSymbol;

            case "undefined": return helperEnumDataTypes.fieldEitherNonIterableOrString;
            //
            // All other cases
            //
            // If we get this far, then all other possibilities have been ruled out
            default: return helperEnumDataTypes.fieldEitherNonIterableOrString;
        }
    };

    /**
     * @param {Object} argObject
     * @return number
     * */
    static _getEnumDataTypeForObject = (argObject) => {
        switch (true) {
            case Array.isArray(argObject): return helperEnumDataTypes.fieldArray;
            case argObject instanceof Error: return helperEnumDataTypes.fieldError;
            case argObject instanceof Map: return helperEnumDataTypes.fieldMap;
            case argObject === null: return helperEnumDataTypes.fieldEitherNonIterableOrString;
            case argObject instanceof Promise: return helperEnumDataTypes.fieldPromise;
            case argObject instanceof Set: return helperEnumDataTypes.fieldSet;
            default: return helperEnumDataTypes.fieldObject;
        }
    };

    /**
     * @param {any} arg
     * @returns string
     * */
    static getStringDataType = (arg) => {
        const stringDataType = typeof arg;

        switch (stringDataType) {
            case "object":
                switch (true) {
                    case Array.isArray(arg): return "array";
                    case arg instanceof Error: return "error";
                    case arg instanceof Map: return "map";
                    case arg === null: return "null";
                    case arg instanceof Promise: return "promise";
                    case arg instanceof Set: return "set";
                    default: return "object";
                }
            default: return stringDataType;
        }
    };

    static fieldSetOfEnumsComplexTypes = new Set([
        helperEnumDataTypes.fieldArray,
        helperEnumDataTypes.fieldMap,
        helperEnumDataTypes.fieldObject,
        helperEnumDataTypes.fieldSet,
    ]);

    /**
     * @param {any} arg
     * @returns boolean
     * */
    static isComplexArg = (arg) => { return helperEnumDataTypes.fieldSetOfEnumsComplexTypes.has( helperEnumDataTypes.getEnumDataType(arg) ); };

    /**
     * @param {number} argEnumType
     * @returns boolean
     * */
    static isComplexEnumType = (argEnumType) => { return helperEnumDataTypes.fieldSetOfEnumsComplexTypes.has(argEnumType); };
}































