"use strict";
//
// Class
//
class helperEnumDataTypes {

    // These data types are iterated through, but aren't actually directly printed to output
    static fieldArray = 1;
    static fieldObject = 2;
    // These data types trigger debugging messages
    static fieldError = 3;
    static fieldPromise = 4;
    //static fieldCircularReference = 5;
    // This data type requires special formatting to avoid dumping the function
    // defs onto the screen
    static fieldFunction = 6;
    // This data type is generally what gets printed to the output
    static fieldEitherNonIterableOrString = 7;
    static fieldSymbol = 8;
    static fieldMap = 9;
    static fieldSet = 10;

    static fieldSetOfTypesToProcess = new Set([
        helperEnumDataTypes.fieldArray,
        helperEnumDataTypes.fieldError,
        helperEnumDataTypes.fieldMap,
        helperEnumDataTypes.fieldObject,
        helperEnumDataTypes.fieldSet,
    ]);

    /**
     * @param {number} argEnumType
     * @returns {any}
     * */
    static getEmptyValueOfComplexTypeViaEnumType = ( argEnumType ) => {
        switch ( argEnumType ) {
            case helperEnumDataTypes.fieldArray: return []
            case helperEnumDataTypes.fieldError: return new Error()
            case helperEnumDataTypes.fieldMap: return new Map()
            case helperEnumDataTypes.fieldObject: return {}
            case helperEnumDataTypes.fieldSet: return new Set()
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
     * @param {number} argEnumType
     * @returns boolean
     * */
    static isEnumTypeToProcess = (argEnumType) => { return helperEnumDataTypes.fieldSetOfTypesToProcess.has(argEnumType); };
}
//
// Public
//
export default class helperCopying {

    /**
     * @param {any} arg
     * @returns any
     * */
    static getCopy = ( arg ) => {
        //
        // Reminders:
        // This should *not* attempt to copy promises
        // Error objects, I'm on the fence about
        //
        const mapToPreventCircularReferences = new Map()

        // If arg isn't complex, then its immutable, so just return arg
        const enumType = helperEnumDataTypes.getEnumDataType( arg )
        if ( !helperEnumDataTypes.isEnumTypeToProcess( enumType ) ) { return arg }

        const valueToReturn = helperEnumDataTypes.getEmptyValueOfComplexTypeViaEnumType( enumType )
        const stackToProcess = [ [ arg, valueToReturn, enumType, ] ]
        while ( stackToProcess.length > 0 ) {

            const [ itemInput, itemOutput, itemEnumType ] = stackToProcess.pop()
            switch ( itemEnumType ) {
                //
                // Array
                //
                case helperEnumDataTypes.fieldArray:
                    helperCopying._processArray(
                        itemInput,
                        itemOutput,
                        stackToProcess,
                        mapToPreventCircularReferences,
                    )
                    break
                //
                //
                //
                case helperEnumDataTypes.fieldError:
                    helperCopying._processError(
                        itemInput,
                        itemOutput,
                    )
                    break
                //
                // Map
                //
                case helperEnumDataTypes.fieldMap:
                    helperCopying._processMap(
                        itemInput,
                        itemOutput,
                        stackToProcess,
                        mapToPreventCircularReferences,
                    )
                    break
                //
                // Object
                //
                case helperEnumDataTypes.fieldObject:
                    helperCopying._processObject(
                        itemInput,
                        itemOutput,
                        stackToProcess,
                        mapToPreventCircularReferences,
                    )
                    break
                //
                // Set
                //
                case helperEnumDataTypes.fieldSet:
                    helperCopying._processSet(
                        itemInput,
                        itemOutput,
                        stackToProcess,
                        mapToPreventCircularReferences,
                    )
                    break
                //
                // All other data types
                //
                default: break
            }
        }
        return valueToReturn
    }

    /**
     * @param {[]} argInput
     * @param {[]} argOutputToUpdate
     * @param {[]} argStackToUpdate
     * @param {Map} argMapToPreventCircularReferencesToUpdate
     * */
    static _processArray = ( argInput, argOutputToUpdate, argStackToUpdate, argMapToPreventCircularReferencesToUpdate ) => {

        for ( let itemIndex = 0, intLength = argInput.length; itemIndex < intLength; itemIndex++ ) {

            const itemInput = argInput[ itemIndex ]

            const [ itemOutput, itemEnumType ] = helperCopying._getOutput( itemInput )
            if ( helperEnumDataTypes.isEnumTypeToProcess( itemEnumType ) ) {

                if ( argMapToPreventCircularReferencesToUpdate.has( itemInput ) ) { argOutputToUpdate.push( argMapToPreventCircularReferencesToUpdate.get( itemInput ) )
                } else {
                    argMapToPreventCircularReferencesToUpdate.set( itemInput, itemOutput, )
                    argOutputToUpdate.push( itemOutput )
                    argStackToUpdate.push( [ itemInput, itemOutput, itemEnumType, ] )
                }
            } else { argOutputToUpdate.push( itemOutput ) }
        }
    }

    /**
     * @param {Error} argInput
     * @param {Error} argOutputToUpdate
     * */
    static _processError = ( argInput, argOutputToUpdate ) => {

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
            if ( argInput.hasOwnProperty( itemStringName ) ) { argOutputToUpdate[ itemStringName ] = argInput[ itemStringName ] }
        }
    }

    /**
     * @param {Map} argInput
     * @param {Map} argOutputToUpdate
     * @param {[]} argStackToUpdate
     * @param {Map} argMapToPreventCircularReferencesToUpdate
     * */
    static _processMap = ( argInput, argOutputToUpdate, argStackToUpdate, argMapToPreventCircularReferencesToUpdate ) => {

        const arrayOfKeys = argInput.keys()
        for ( let itemIndex = 0, intLength = arrayOfKeys.length; itemIndex < intLength; itemIndex++ ) {

            const itemKey = arrayOfKeys[ itemIndex ]
            const itemInput = argInput.get( itemKey )

            const [ itemOutput, itemEnumType ] = helperCopying._getOutput( itemInput )
            if ( helperEnumDataTypes.isEnumTypeToProcess( itemEnumType ) ) {

                if ( argMapToPreventCircularReferencesToUpdate.has( itemInput ) ) { argOutputToUpdate.set( itemKey, argMapToPreventCircularReferencesToUpdate.get( itemInput ) )
                } else {
                    argMapToPreventCircularReferencesToUpdate.set( itemInput, itemOutput, )
                    argOutputToUpdate.set( itemKey, itemOutput, )
                    argStackToUpdate.push( [ itemInput, itemOutput, itemEnumType, ] )
                }
            } else { argOutputToUpdate.set( itemKey, itemOutput, ) }
        }
    }

    /**
     * @param {{}} argInput
     * @param {{}} argOutputToUpdate
     * @param {[]} argStackToUpdate
     * @param {Map} argMapToPreventCircularReferencesToUpdate
     * */
    static _processObject = ( argInput, argOutputToUpdate, argStackToUpdate, argMapToPreventCircularReferencesToUpdate ) => {

        const arrayOfKeys = Object.keys( argInput )
        for ( let itemIndex = 0, intLength = arrayOfKeys.length; itemIndex < intLength; itemIndex++ ) {

            const itemKey = arrayOfKeys[ itemIndex ]
            const itemInput = argInput[ itemKey ]

            const [ itemOutput, itemEnumType ] = helperCopying._getOutput( itemInput )
            if ( helperEnumDataTypes.isEnumTypeToProcess( itemEnumType ) ) {

                if ( argMapToPreventCircularReferencesToUpdate.has( itemInput ) ) { argOutputToUpdate[ itemKey ] = argMapToPreventCircularReferencesToUpdate.get( itemInput )
                } else {
                    argMapToPreventCircularReferencesToUpdate.set( itemInput, itemOutput, )
                    argOutputToUpdate[ itemKey ] = itemOutput
                    argStackToUpdate.push( [ itemInput, itemOutput, itemEnumType, ] )
                }
            } else { argOutputToUpdate[ itemKey ] = itemOutput }
        }
    }

    /**
     * @param {Set} argInput
     * @param {Set} argOutputToUpdate
     * @param {[]} argStackToUpdate
     * @param {Map} argMapToPreventCircularReferencesToUpdate
     * @returns Set
     * */
    static _processSet = ( argInput, argOutputToUpdate, argStackToUpdate, argMapToPreventCircularReferencesToUpdate ) => {

        const arrayFromSet = Array.from( argInput )
        for ( let itemIndex = 0, intLength = arrayFromSet.length; itemIndex < intLength; itemIndex++ ) {

            const itemInput = arrayFromSet[ itemIndex ]

            const [ itemOutput, itemEnumType ] = helperCopying._getOutput( itemInput )
            if ( helperEnumDataTypes.isEnumTypeToProcess( itemEnumType ) ) {

                if ( argMapToPreventCircularReferencesToUpdate.has( itemInput ) ) { argOutputToUpdate.add( argMapToPreventCircularReferencesToUpdate.get( itemInput ) )
                } else {
                    argMapToPreventCircularReferencesToUpdate.set( itemInput, itemOutput, )
                    argOutputToUpdate.add( itemOutput )
                    argStackToUpdate.push( [ itemInput, itemOutput, itemEnumType, ] )
                }
            } else { argOutputToUpdate.add( itemOutput ) }
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

        const enumType = helperEnumDataTypes.getEnumDataType( arg )
        const emptyValue = helperEnumDataTypes.getEmptyValueOfComplexTypeViaEnumType( enumType )
        const valueToReturn = emptyValue !== undefined ? emptyValue : arg

        return [ valueToReturn, enumType, ]
    }
}











































