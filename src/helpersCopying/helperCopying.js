"use strict";
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
    //static fieldCircularReference = 5;
    //
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

    static fieldSetOfTypesToProcess = new Set([
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
    static getEnumDataType = (arg) => {
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
    static _getEnumDataTypeForObject = (argObject) => {
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
    static isEnumTypeToProcess = (argEnumType) => {
        return _helperEnumDataTypes.fieldSetOfTypesToProcess.has(argEnumType)
    }
}
//
// Public
//
export class HelperStackItem {

    constructor(
        argInput,
        argInputKey,
        argInputType,
        argOutput,
        argOutputKey,
        argMapToPreventCircularReferences,
        argStackToProcess,
    ) {
        this.fieldInput = argInput
        this.fieldInputKey = argInputKey
        this.fieldInputType = argInputType
        this.fieldOutput = argOutput
        this.fieldOutputKey = argOutputKey
        this.fieldMapToPreventCircularReferences = argMapToPreventCircularReferences
        this.fieldStackToProcess = argStackToProcess
    }
}
//
// Public
//
export default class helperCopying {
    //
    // Public
    //
    /**
     * @param {any} argInput
     * @returns any
     * */
    static getCopy = ( argInput ) => {
        //
        // Reminders:
        // This should *not* attempt to copy promises
        // Error objects, I'm on the fence about
        //
        const mapToPreventCircularReferences = new Map()

        // If arg isn't complex, then its immutable, so just return arg
        const enumType = _helperEnumDataTypes.getEnumDataType( argInput )
        if ( !_helperEnumDataTypes.isEnumTypeToProcess( enumType ) ) { return argInput }

        const outputToReturn = _helperEnumDataTypes.getEmptyValueOfComplexTypeViaEnumType( enumType )

        const stackToProcess = [  ]
        const startingStackItem = new HelperStackItem(
            argInput,
            undefined,
            enumType,
            outputToReturn,
            undefined,
            mapToPreventCircularReferences,
            stackToProcess,
        )
        stackToProcess.push( startingStackItem )
        while ( stackToProcess.length > 0 ) {

            const itemHelperItemForStack = stackToProcess.pop()
            //
            // Process the data types
            //
            switch ( itemHelperItemForStack.fieldInputType ) {
                //
                // Array
                //
                case _helperEnumDataTypes.fieldArray:
                    helperCopying._processArray( itemHelperItemForStack )
                    break
                //
                //
                //
                case _helperEnumDataTypes.fieldError:
                    helperCopying._processError( itemHelperItemForStack )
                    break
                //
                // Map
                //
                case _helperEnumDataTypes.fieldMap:
                    helperCopying._processMap( itemHelperItemForStack )
                    break
                //
                // Object
                //
                case _helperEnumDataTypes.fieldObject:
                    helperCopying._processObject( itemHelperItemForStack )
                    break
                //
                // Set
                //
                case _helperEnumDataTypes.fieldSet:
                    helperCopying._processSet( itemHelperItemForStack )
                    break
                //
                // All other data types
                //
                default: break
            }
        }
        return outputToReturn
    }
    //
    // Private
    //
    /**
     * @param {HelperStackItem} argHelperStackItem
     * */
    static _processArray = ( argHelperStackItem ) => {

        const inputToReference = argHelperStackItem.fieldInput
        const mapToPreventCircularReferencesToUpdate = argHelperStackItem.fieldMapToPreventCircularReferences
        const outputToUpdate = argHelperStackItem.fieldOutput
        const stackToProcess = argHelperStackItem.fieldStackToProcess

        for ( let itemIndex = 0, intLength = inputToReference.length; itemIndex < intLength; itemIndex++ ) {

            const itemInput = inputToReference[ itemIndex ]

            const [ itemOutputNew, itemEnumType ] = helperCopying._getOutput( itemInput )
            if ( _helperEnumDataTypes.isEnumTypeToProcess( itemEnumType ) ) {

                if ( mapToPreventCircularReferencesToUpdate.has( itemInput ) ) {
                    outputToUpdate.push( mapToPreventCircularReferencesToUpdate.get( itemInput ) )
                } else {
                    mapToPreventCircularReferencesToUpdate.set( itemInput, itemOutputNew, )
                    outputToUpdate.push( itemOutputNew )
                    argHelperStackItem.fieldStackToProcess.push(
                        new HelperStackItem(
                            itemInput,
                            itemIndex,
                            itemEnumType,
                            itemOutputNew,
                            itemIndex,
                            mapToPreventCircularReferencesToUpdate,
                            stackToProcess,
                        )
                    )
                }
            } else { outputToUpdate.push( itemOutputNew ) }
        }
    }

    /**
     * @param {HelperStackItem} argHelperStackItem
     * */
    static _processError = ( argHelperStackItem ) => {

        const arrayOfStringNameAttributes = [
            "code",
            "errno",
            "message",
            "stack",
            "syscall",
        ]
        for ( let itemIndex = 0, intLength = arrayOfStringNameAttributes.length; itemIndex < intLength; itemIndex++ ) {
            //
            // If input has the attribute, then add that attribute to argInput
            //
            let itemStringName = arrayOfStringNameAttributes[ itemIndex ]
            if ( argHelperStackItem.fieldInput.hasOwnProperty( itemStringName ) ) {
                argHelperStackItem.fieldOutput[ itemStringName ] = argHelperStackItem.fieldInput[ itemStringName ]
            }
        }
    }

    /**
     * @param {HelperStackItem} argHelperStackItem
     * */
    static _processMap = ( argHelperStackItem ) => {

        const inputToReference = argHelperStackItem.fieldInput
        const mapToPreventCircularReferencesToUpdate = argHelperStackItem.fieldMapToPreventCircularReferences
        const outputToUpdate = argHelperStackItem.fieldOutput
        const stackToUpdate = argHelperStackItem.fieldStackToProcess

        const arrayOfKeys = inputToReference.keys()
        for ( let itemIndex = 0, intLength = arrayOfKeys.length; itemIndex < intLength; itemIndex++ ) {

            const itemKey = arrayOfKeys[ itemIndex ]
            const itemInput = inputToReference.get( itemKey )

            const [ itemOutput, itemEnumType ] = helperCopying._getOutput( itemInput )
            if ( _helperEnumDataTypes.isEnumTypeToProcess( itemEnumType ) ) {

                if ( mapToPreventCircularReferencesToUpdate.has( itemInput ) ) {
                    outputToUpdate.set( itemKey, mapToPreventCircularReferencesToUpdate.get( itemInput ) )
                } else {
                    mapToPreventCircularReferencesToUpdate.set( itemInput, itemOutput, )
                    outputToUpdate.set( itemKey, itemOutput, )
                    stackToUpdate.push(
                        new HelperStackItem(
                            itemInput,
                            itemKey,
                            itemEnumType,
                            itemOutput,
                            itemKey,
                            mapToPreventCircularReferencesToUpdate,
                            stackToUpdate,
                        )
                    )
                }
            } else { outputToUpdate.set( itemKey, itemOutput, ) }
        }
    }

    /**
     * @param {HelperStackItem} argHelperStackItem
     * */
    static _processObject = ( argHelperStackItem ) => {

        const inputToReference = argHelperStackItem.fieldInput
        const mapToPreventCircularReferences = argHelperStackItem.fieldMapToPreventCircularReferences
        const outputToUpdate = argHelperStackItem.fieldOutput
        const stackToUpdate = argHelperStackItem.fieldStackToProcess

        const arrayOfKeys = Object.keys( inputToReference )
        for ( let itemIndex = 0, intLength = arrayOfKeys.length; itemIndex < intLength; itemIndex++ ) {

            const itemKey = arrayOfKeys[ itemIndex ]
            const itemInput = inputToReference[ itemKey ]

            const [ itemOutputNew, itemEnumType ] = helperCopying._getOutput( itemInput )
            if ( _helperEnumDataTypes.isEnumTypeToProcess( itemEnumType ) ) {

                if ( mapToPreventCircularReferences.has( itemInput ) ) {
                    outputToUpdate[ itemKey ] = mapToPreventCircularReferences.get( itemInput )
                } else {
                    mapToPreventCircularReferences.set( itemInput, itemOutputNew, )
                    outputToUpdate[ itemKey ] = itemOutputNew
                    stackToUpdate.push(
                        new HelperStackItem(
                            itemInput,
                            itemKey,
                            itemEnumType,
                            itemOutputNew,
                            itemKey,
                            mapToPreventCircularReferences,
                            stackToUpdate,
                        )
                    )
                }
            } else { outputToUpdate[ itemKey ] = itemOutputNew }
        }
    }

    /**
     * @param {HelperStackItem} argHelperStackItem
     * */
    static _processSet = ( argHelperStackItem ) => {

        const inputToReference = argHelperStackItem.fieldInput
        const mapToPreventCircularReferencesToUpdate = argHelperStackItem.fieldMapToPreventCircularReferences
        const outputToUpdate = argHelperStackItem.fieldOutput
        const stackToUpdate = argHelperStackItem.fieldStackToProcess

        const arrayFromSet = Array.from( inputToReference )
        for ( let itemIndex = 0, intLength = arrayFromSet.length; itemIndex < intLength; itemIndex++ ) {

            const itemInput = arrayFromSet[ itemIndex ]

            const [ itemOutput, itemEnumType ] = helperCopying._getOutput( itemInput )
            if ( _helperEnumDataTypes.isEnumTypeToProcess( itemEnumType ) ) {

                if ( mapToPreventCircularReferencesToUpdate.has( itemInput ) ) {
                    outputToUpdate.add( mapToPreventCircularReferencesToUpdate.get( itemInput ) )
                } else {
                    mapToPreventCircularReferencesToUpdate.set( itemInput, itemOutput, )
                    outputToUpdate.add( itemOutput )
                    stackToUpdate.push(
                        new HelperStackItem(
                            itemInput,
                            itemIndex,
                            itemEnumType,
                            itemOutput,
                            itemIndex,
                            mapToPreventCircularReferencesToUpdate,
                            stackToUpdate,
                        )
                    )
                }
            } else { outputToUpdate.add( itemOutput ) }
        }
    }
    //
    // Private - get
    //
    /**
     * @param {any} arg
     * @returns any
     * */
    static _getOutput = ( arg ) => {

        const enumType = _helperEnumDataTypes.getEnumDataType( arg )
        const emptyValue = _helperEnumDataTypes.getEmptyValueOfComplexTypeViaEnumType( enumType )
        const valueToReturn = emptyValue !== undefined ? emptyValue : arg

        return [ valueToReturn, enumType, ]
    }
}











































