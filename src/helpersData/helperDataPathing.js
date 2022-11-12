//
// Libraries - custom
//
import helperErrors from "../helpersErrors/helperErrors.js";
//
// Class
//
class _helperEnumDataTypes {
    //
    // These data types are iterated through, but aren't actually directly printed to output
    //
    static fieldArray = 1;
    static fieldObject = 2;
    //
    // These data types trigger debugging messages
    //
    static fieldError = 3;
    static fieldPromise = 4;
    //
    //static fieldCircularReference = 5;
    // This data type requires special formatting to avoid dumping the function
    // defs onto the screen
    //
    static fieldFunction = 6;
    //
    // This data type is generally what gets printed to the output
    //
    static fieldEitherNonIterableOrString = 7;
    static fieldSymbol = 8;
    static fieldMap = 9;
    static fieldSet = 10;

    static fieldSetOfTypesToProcess =
        new Set([
            _helperEnumDataTypes.fieldArray,
            _helperEnumDataTypes.fieldError,
            _helperEnumDataTypes.fieldMap,
            _helperEnumDataTypes.fieldObject,
            _helperEnumDataTypes.fieldSet,
        ]);

    /**
     * @param {number} argEnumType
     * @returns {any}
     * */
    static getEmptyValueOfComplexTypeViaEnumType = ( argEnumType ) => {
        switch ( argEnumType ) {
            case _helperEnumDataTypes.fieldArray: return []
            case _helperEnumDataTypes.fieldError: return new Error()
            case _helperEnumDataTypes.fieldMap: return new Map()
            case _helperEnumDataTypes.fieldObject: return {}
            case _helperEnumDataTypes.fieldSet: return new Set()
            default: return undefined
        }
    }

    /**
     * @param {any} arg
     * @returns number
     * */
    static getEnumDataType = ( arg ) => {
        switch (typeof arg) {
            //
            // Function
            //
            case "function": return _helperEnumDataTypes.fieldFunction;
            //
            // Object
            //
            case "object": return _helperEnumDataTypes._getEnumDataTypeForObject(arg);
            //
            // Symbol
            //
            // Reminder: This is important because symbols do *not* support `${}` string conversions
            case "symbol": return _helperEnumDataTypes.fieldSymbol;

            case "undefined": return _helperEnumDataTypes.fieldEitherNonIterableOrString;
            //
            // All other cases
            //
            // If we get this far, then all other possibilities have been ruled out
            default: return _helperEnumDataTypes.fieldEitherNonIterableOrString;
        }
    };

    /**
     * @param {Object} argObject
     * @return number
     * */
    static _getEnumDataTypeForObject = ( argObject ) => {
        switch (true) {
            case Array.isArray(argObject): return _helperEnumDataTypes.fieldArray;
            case argObject instanceof Error: return _helperEnumDataTypes.fieldError;
            case argObject instanceof Map: return _helperEnumDataTypes.fieldMap;
            case argObject === null: return _helperEnumDataTypes.fieldEitherNonIterableOrString;
            case argObject instanceof Promise: return _helperEnumDataTypes.fieldPromise;
            case argObject instanceof Set: return _helperEnumDataTypes.fieldSet;
            default: return _helperEnumDataTypes.fieldObject;
        }
    };

    /**
     * @param {number} argEnumType
     * @returns boolean
     * */
    static isEnumTypeToProcess = ( argEnumType ) => { return _helperEnumDataTypes.fieldSetOfTypesToProcess.has(argEnumType) }
}
//
// Public
//
export default class helperDataPathing {
    //
    // Public
    //
    /**
     * This is used for getting values from paths within data structures whose schema is unreliable
     *
     * @param {[]} argArrayPath
     * @param {object} arg
     * @returns any
     * */
    static getValueAtPath = ( argArrayPath, arg ) => {

        let intIndexLast = argArrayPath.length - 1

        let item = arg
        for ( let itemIntIndexForArgArrayPath = 0, intLength = argArrayPath.length; itemIntIndexForArgArrayPath < intLength; itemIntIndexForArgArrayPath++ ) {

            const itemKey = argArrayPath[ itemIntIndexForArgArrayPath ]
            const itemEnum = _helperEnumDataTypes.getEnumDataType( item )

            switch ( itemEnum ) {
                case _helperEnumDataTypes.fieldArray:
                    //
                    // If anything here fails, then something about the path or object is bad
                    //
                    const itemKeyNumber = Number( itemKey )
                    //
                    // If itemKeyNumber is NaN then the conversion failed. Return an error.
                    //
                    if ( isNaN( itemKeyNumber ) ) {
                        return helperDataPathing._getErrorBecausePathFailed(
                            argArrayPath,
                            itemIntIndexForArgArrayPath,
                            arg,
                            item,
                        )
                    } else {
                        //
                        // If itemKeyNumber is outside the range of item, then return an error
                        //
                        if ( 0 > itemKeyNumber || itemKeyNumber >= item.length ) {
                            return helperDataPathing._getErrorBecausePathFailed(
                                argArrayPath,
                                itemIntIndexForArgArrayPath,
                                arg,
                                item,
                            )
                        } else { item = item[ itemKeyNumber ] }
                    }
                    break

                case _helperEnumDataTypes.fieldObject:
                    //
                    // If key doesn't exist here, then return Error
                    //
                    const itemKeyString = JSON.stringify( itemKey )
                    if ( Object.keys( item ).includes( itemKeyString ) ) { item = item[ itemKeyString ]
                    } else {
                        return helperDataPathing._getErrorBecausePathFailed(
                            argArrayPath,
                            itemIntIndexForArgArrayPath,
                            arg,
                            item,
                        )
                    }
                    break

                //
                // Make sure we don't try to index a non-object
                //
                default:
                    return itemIntIndexForArgArrayPath >= intIndexLast
                        ? item
                        : helperDataPathing._getErrorBecausePathFailed(
                            argArrayPath,
                            itemIntIndexForArgArrayPath,
                            arg,
                            item,
                        )
            }
        }
        //
        // If we get this far with no error, then return itemObject
        //
        return item
    }
    //
    // Private
    //
    /**
     * @param {[]} argArrayPath
     * @param {number} argIntIndexOfFailure
     * @param {object} argObjectRoot
     * @param {object} argObjectOfFailure
     * @returns Error
     * */
    static _getErrorBecausePathFailed(
        argArrayPath,
        argIntIndexOfFailure,
        argObjectRoot,
        argObjectOfFailure
    ) {
        const arrayOfStrings = [
            `Failed to get value at path.`,
            `Path = ${argArrayPath}`,
            `Array path that exists = ${ argArrayPath.slice( 0, argIntIndexOfFailure, ) }`,
            `Failed key = ${ argArrayPath[ argIntIndexOfFailure ] }`,
            `Failed index = ${ argIntIndexOfFailure }`,
            `Object at failure's type = ${ typeof argObjectOfFailure }`,
            `Is root object defined? ${ argObjectRoot !== undefined && argObjectRoot !== null ? 'yes' : 'no' }`,
        ]

        switch ( _helperEnumDataTypes.getEnumDataType( argObjectOfFailure ) ) {

            case _helperEnumDataTypes.fieldArray:
                arrayOfStrings.push( `Array object's size = ${ argObjectOfFailure.length }` )
                break

            case _helperEnumDataTypes.fieldObject:
                arrayOfStrings.push( `Object's keys = ${ Object.keys( argObjectOfFailure ).sort() }` )
                break

            default:
                arrayOfStrings.push( `Object at failure isn't a container.` )
                break
        }
        return helperErrors.raiseError( Error( helperDataPathing._getStringByCombiningArray( arrayOfStrings, "\n", ) ) )
    }

    /**
     * @param {[]} argArrayOfStrings
     * @param {string} argStringDelimiter
     * */
    static _getStringByCombiningArray = ( argArrayOfStrings, argStringDelimiter = "" ) => {
        return argArrayOfStrings.length === 0
            ? ""
            : argArrayOfStrings.reduce(
                ( itemStringPrev, itemString ) => {
                    return itemStringPrev + argStringDelimiter + itemString
                } )
    }
}
























































