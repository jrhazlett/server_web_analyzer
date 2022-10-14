//
// Libraries - custom
//
import helperEnumDataTypes from "./helperEnumDataTypes.js";
import helperStrings from "../helpersNativeDataTypes/helperStrings.js";
//
// Public
//
export default class helperDataJson {

    /**
     * @param {string} argStringJson
     * @returns any
     *
     * Reminder: The return type for this func is the same as JSON.parse()'s return type
     * */
    static getObjectFromJsonString = ( argStringJson ) => { return JSON.parse( argStringJson ) }

    /**
     * This attempts to get the value stored at the end of path
     * If the path fails, then this function returns an Error object answering
     * the following questions:
     * - What key failed?
     * - What is the path used?
     * - Which part of the path exists?
     * - Which part of the path is missing?
     *
     * @param {any} arg
     * @param {[]} argArrayPath
     * @returns any
     * */
    static getValueAtPathInArg = (argArrayPath, arg) => {

        const arrayOfKeysThatExist = [];

        let item = arg;
        for ( let itemIntIndex = 0, intLength = argArrayPath.length; itemIntIndex < intLength; itemIntIndex++ ) {
            let itemKey = argArrayPath[itemIntIndex];
            switch (helperEnumDataTypes.getEnumDataType(item)) {
                //
                // Array
                //
                case helperEnumDataTypes.fieldArray:
                    item = helperDataJson._getValueAtPathInArgArray(
                        item,
                        arrayOfKeysThatExist,
                        argArrayPath,
                        itemKey
                    );
                    if (item instanceof Error) { return item; }
                    break;
                //
                //
                //
                case helperEnumDataTypes.fieldMap:
                    item = helperDataJson._getValueAtPathInArgMap(
                        arrayOfKeysThatExist,
                        argArrayPath,
                        itemKey,
                        item
                    );
                    if (item instanceof Error) { return item; }
                    break;
                //
                // Object
                //
                case helperEnumDataTypes.fieldObject:
                    item = helperDataJson._getValueAtPathInArgObject(
                        arrayOfKeysThatExist,
                        argArrayPath,
                        itemKey,
                        item
                    );
                    if (item instanceof Error) { return item; }
                    break;
                //
                // In all other cases, the path failed
                //
                default:
                    return helperDataJson._getErrorBecausePathFailed(
                        item,
                        argArrayPath,
                        arrayOfKeysThatExist,
                        itemKey
                    );
            }
        }
        //
        // If we get this far, then return the resulting item
        //
        return item;
    };

    /**
     * @param {[]} argArray
     * @param {[]} argArrayOfKeysThatExistToUpdate
     * @param {[]} argArrayPath
     * @param {any} argKey
     * @returns any
     * */
    static _getValueAtPathInArgArray = (
        argArray,
        argArrayOfKeysThatExistToUpdate,
        argArrayPath,
        argKey
    ) => {
        //
        // Convert key to an index for the array
        //
        const intIndex = helperDataJson._getIntIndexFromKey(argKey);
        //
        // If intIndex is defined, then continue processing it. Otherwise,
        // return an Error.
        //
        if (intIndex !== undefined) {
            //
            // If index is within the range of the array, then update...
            // argArray
            // arrayOfKeysThatExist
            //
            // Otherwise, return Error.
            //
            if (0 <= intIndex && intIndex < argArray.length) {
                argArrayOfKeysThatExistToUpdate.push(argKey);
                return argArray[intIndex];
            } else {
                return helperDataJson._getErrorBecausePathFailed(
                    argArray,
                    argArrayPath,
                    argArrayOfKeysThatExistToUpdate,
                    argKey
                );
            }
        } else {
            return helperDataJson._getErrorBecausePathFailed(
                argArray,
                argArrayPath,
                argArrayOfKeysThatExistToUpdate,
                argKey
            );
        }
    };

    /**
     * @param {[]} argArrayOfKeysThatExistToUpdate
     * @param {[]} argArrayPath
     * @param {any} argKey
     * @param {Map} argMap
     * */
    static _getValueAtPathInArgMap = (
        argArrayOfKeysThatExistToUpdate,
        argArrayPath,
        argKey,
        argMap
    ) => {
        //
        // If the key exists, then update item and arrayOfKeysThatExist
        // Otherwise, return Error.
        //
        if (argMap.has(argKey)) {
            argArrayOfKeysThatExistToUpdate.push(argKey);
            return argMap.get(argKey);
        } else {
            return helperDataJson._getErrorBecausePathFailed(
                argMap,
                argArrayPath,
                argArrayOfKeysThatExistToUpdate,
                argKey
            );
        }
    };

    /**
     * @param {[]} argArrayOfKeysThatExistToUpdate
     * @param {[]} argArrayPath
     * @param {any} argKey
     * @param {Object} argObject
     * @returns any
     * */
    static _getValueAtPathInArgObject = (
        argArrayOfKeysThatExistToUpdate,
        argArrayPath,
        argKey,
        argObject
    ) => {
        //
        // If the key exists, then update item and arrayOfKeysThatExist
        // Otherwise, return Error.
        //
        if (argObject.hasOwnProperty(argKey)) {
            argArrayOfKeysThatExistToUpdate.push(argKey);
            return argObject[argKey];
        } else {
            return helperDataJson._getErrorBecausePathFailed(
                argObject,
                argArrayPath,
                argArrayOfKeysThatExistToUpdate,
                argKey
            );
        }
    };

    /**
     * @param {any} arg
     * @param {[]} argArrayPath
     * @param {[]} argArrayPathThatExists
     * @param {any} argKeyAtFailure
     * @returns Error
     * */
    static _getErrorBecausePathFailed = (
        arg,
        argArrayPath,
        argArrayPathThatExists,
        argKeyAtFailure
    ) => {
        const arrayToReturn = [
            `Failed to navigate path`,
            `keyAtFailure = ${helperStrings.getStringFromArg(argKeyAtFailure)}`,
            `arrayPath = ${helperStrings.getStringPrintableFromIterable( argArrayPath )}`,
            `arrayPathThatExists = ${argArrayPathThatExists}`,
            `arrayPathMissing = ${helperStrings.getStringPrintableFromIterable( argArrayPath.slice(argArrayPathThatExists.length) )}`,
        ];

        switch (typeof arg) {
            case "object":
                switch (true) {
                    case arg === null:
                        arrayToReturn.push(`No keys available because node is null`);
                        break;
                    case Array.isArray(arg):
                        arrayToReturn.push( `rangeOfIndexesAvailable = 0 - ${arg.length - 1}` );
                        break;
                    case arg instanceof Map:
                        arrayToReturn.push( `arrayOfAvailableKeysAtFailure = ${helperStrings.getStringPrintableFromIterable( arg.keys() )}` );
                        break;
                    default:
                        arrayToReturn.push( `arrayOfAvailableKeysAtFailure = ${helperStrings.getStringPrintableFromIterable( Object.keys(arg) )}` );
                        break;
                }
                break;
            default:
                arrayToReturn.push( `No keys available because node is not a type of object` );
                break;
        }
        arrayToReturn.push( `dataTypeAtFailure = ${helperEnumDataTypes.getStringDataType(arg)}` );
        return Error( arrayToReturn.reduce( (itemStringPrev, itemString) => itemStringPrev + "\n" + itemString ) );
    };

    /**
     * @param {any} argKey
     * */
    static _getIntIndexFromKey = (argKey) => {
        switch (typeof argKey) {
            //
            // Reminder: In tests, this appears to be 'ok' for using to reference arrays
            //
            case "bigint": return argKey;
            //
            // If the data type is a number, then it needs to be an int to be valid
            //
            case "number": return Number.isInteger(argKey) ? argKey : undefined;
            //
            // If the key is a string, then check it for only digits and return the
            // the resulting int
            //
            case "string": return /^\d+$/.test(argKey) ? parseInt(argKey) : undefined;
            //
            // In all other cases, return undefined
            //
            default: return undefined;
        }
    };
}
















































