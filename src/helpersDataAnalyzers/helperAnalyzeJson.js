/*
Optimizations:
- Arrays have sizes defined at declaration
- Extensive use of int and switch statements to streamline evaluations
- Avoid unnecessary recursions
*/
class _enumSignificantDataTypes {

    static fieldArray = 1
    static fieldObject = 2
    static fieldEitherNonIterableOrString = 3

    /**
     * @param {any} arg
     * @returns number
     * */
    static getEnumDataType = ( arg ) => {

        // Check if array
        if ( Array.isArray( arg ) ) { return _enumSignificantDataTypes.fieldArray
        } else {

            // Check if object
            if ( arg ) {

                if( arg instanceof Object ) {

                    // If constructor is an Object then return the object as the type
                    return arg.constructor === Object ? _enumSignificantDataTypes.fieldObject : _enumSignificantDataTypes.fieldEitherNonIterableOrString

                } else { return _enumSignificantDataTypes.fieldEitherNonIterableOrString }

            } else { return _enumSignificantDataTypes.fieldEitherNonIterableOrString }
        }
    }
}
//
// Public
//
export default class helperAnalyzeJson {
    //
    // Public
    //
    static fieldEnumSignificantDataTypes = _enumSignificantDataTypes
    //
    // Public - get
    //
    /**
     * This method returns the same data type as argInputRoot
     *
     * @param {any} argInputRoot
     * @returns any
     * */
    static getTreeCopied = ( argInputRoot ) => {

        let outputRoot
        const enumIntDataType = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( argInputRoot )
        switch ( enumIntDataType ) {

            case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                outputRoot = []
                break

            case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                outputRoot = {}
                break

            default: return argInputRoot
        }

        const arrayStack = [ [ argInputRoot, outputRoot, enumIntDataType, ] ]
        while ( arrayStack.length !== 0 ) {

            const [ itemInput, itemOutput, itemEnumDataType, ] = arrayStack.pop()
            switch ( itemEnumDataType ) {

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                    helperAnalyzeJson._processArray( itemInput, itemOutput, arrayStack, )
                    break

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                    helperAnalyzeJson._processObject( itemInput, itemOutput, arrayStack, )
                    break

                // If itemInput isn't iterable, then do nothing because we already added the necessary values
                default: break
            }
        }
        return outputRoot
    }

    /**
     * @param {[]} argArrayInput
     * @param {[]} argOutputToUpdate
     * @param {[]} argArrayStackToUpdate
     * */
    static _processArray = ( argArrayInput, argOutputToUpdate, argArrayStackToUpdate ) => {

        for ( let itemIntIndex = 0, intLength = argArrayInput.length; itemIntIndex < intLength; itemIntIndex++ ) {

            const itemInputSub = argArrayInput[ itemIntIndex ]

            const itemEnumDataTypeInputSub = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( itemInputSub )
            switch ( itemEnumDataTypeInputSub ) {

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                    // Create array and add it to output
                    const itemOutputSubArray = new Array( itemInputSub.length )
                    argOutputToUpdate[ itemIntIndex ] = itemOutputSubArray
                    // Prep next iteration
                    argArrayStackToUpdate.push( [ itemInputSub, itemOutputSubArray, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray, ] )
                    break

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                    // Create object and add it to output
                    const itemOutputSubObject = {}
                    argOutputToUpdate[ itemIntIndex ] = itemOutputSubObject
                    // Prep next iteration
                    argArrayStackToUpdate.push( [ itemInputSub, itemOutputSubObject, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject, ] )
                    break

                default:

                    argOutputToUpdate.push( itemInputSub )
                    break
            }
        }
    }

    /**
     * @param {object} argObjectInput
     * @param {object} argOutputToUpdate
     * @param {[]} argArrayStackToUpdate
     * */
    static _processObject = ( argObjectInput, argOutputToUpdate, argArrayStackToUpdate ) => {

        const arrayKeys = Object.keys( argObjectInput )
        for ( let itemIntIndex = 0, intLength = arrayKeys.length; itemIntIndex < intLength; itemIntIndex++ ) {

            const itemKey = arrayKeys[ itemIntIndex ]
            const itemInputSub = argObjectInput[ itemKey ]

            const itemEnumDataTypeInputSub = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( itemInputSub )
            switch ( itemEnumDataTypeInputSub ) {

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                    // Create array and add it to output
                    const itemOutputSubArray = new Array( itemInputSub.length )
                    argOutputToUpdate[ itemKey ] = itemOutputSubArray

                    // Prep next iteration
                    argArrayStackToUpdate.push( [ itemInputSub, itemOutputSubArray, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray, ] )
                    break

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                    // Create object and add it to output
                    const itemOutputSubObject = {}
                    argOutputToUpdate[ itemKey ] = itemOutputSubObject
                    // Prep next iteration
                    argArrayStackToUpdate.push( [ itemInputSub, itemOutputSubObject, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject, ] )
                    break

                default:

                    // If data type isn't iterable or is a string, then just add it to output
                    argOutputToUpdate[ itemKey ] = itemInputSub
                    break
            }
        }
    }

    /**
     * This method returns the same data type as argInputRoot
     *
     * @param {any} argInputRoot
     * @param {Function} argCallback
     * @returns any
     * */
    static getTreeCopiedWithValuesProcessedViaCallback = ( argInputRoot, argCallback ) => {
        //
        // Process single values
        //
        let outputRoot
        const enumIntDataType = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( argInputRoot )
        switch ( enumIntDataType ) {

            case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                outputRoot = []
                break

            case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                outputRoot = {}
                break

            default: return argCallback( argInputRoot )
        }
        //
        // Process values throughout tree
        //
        const arrayStack = [ [ argInputRoot, outputRoot, enumIntDataType, ] ]
        while ( arrayStack.length !== 0 ) {

            const [ itemInput, itemOutput, itemIntEnumDataType, ] = arrayStack.pop()
            switch ( itemIntEnumDataType ) {

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                    helperAnalyzeJson._processArrayWithCallback( itemInput, itemOutput, argCallback, arrayStack, )
                    break

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                    helperAnalyzeJson._processObjectWithCallback( itemInput, itemOutput, argCallback, arrayStack, )
                    break

                // If itemInput isn't iterable, then do nothing because we already added the necessary values
                default : break
            }
        }
        return outputRoot
    }

    /**
     * @param {[]} argArrayInput
     * @param {[]} argOutputToUpdate
     * @param {Function} argCallback
     * @param {[]} argArrayStackToUpdate
     * */
    static _processArrayWithCallback = ( argArrayInput, argOutputToUpdate, argCallback, argArrayStackToUpdate ) => {

        for ( let itemIntIndex = 0, intLength = argArrayInput.length; itemIntIndex < intLength; itemIntIndex++ ) {

            const itemInputSub = argArrayInput[ itemIntIndex ]

            const itemEnumDataTypeInputSub = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( itemInputSub )
            switch ( itemEnumDataTypeInputSub ) {

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                    // Create array and add to output
                    const itemOutputSubArray = new Array( itemInputSub.length )
                    argOutputToUpdate[ itemIntIndex ] = itemOutputSubArray

                    // Prep next iteration
                    argArrayStackToUpdate.push( [ itemInputSub, itemOutputSubArray, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray, ] )
                    break

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                    // Create object and add to output
                    const itemOutputSubObject = {}
                    argOutputToUpdate[ itemIntIndex ] = itemOutputSubObject

                    // Prep next iteration
                    argArrayStackToUpdate.push( [ itemInputSub, itemOutputSubObject, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject, ] )
                    break

                default:

                    // Process value and add to output
                    argOutputToUpdate[ itemIntIndex ] = argCallback( itemInputSub )
                    break
            }
        }
    }

    /**
     * @param {object} argObjectInput
     * @param {object} argOutputToUpdate
     * @param {Function} argCallback
     * @param {[]} argArrayStackToUpdate
     * */
    static _processObjectWithCallback = ( argObjectInput, argOutputToUpdate, argCallback, argArrayStackToUpdate ) => {

        const arrayKeys = Object.keys( argObjectInput )
        for ( let itemIntIndex = 0, intLength = arrayKeys.length; itemIntIndex < intLength; itemIntIndex++ ) {

            const itemKey = arrayKeys[ itemIntIndex ]
            const itemInputSub = argObjectInput[ itemKey ]

            const itemEnumDataTypeInputSub = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( itemInputSub )
            switch ( itemEnumDataTypeInputSub ) {

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                    // Create array and add to output
                    const itemOutputSubArray = new Array( itemInputSub.length )
                    argOutputToUpdate[ itemKey ] = itemOutputSubArray

                    // Prep next iteration
                    argArrayStackToUpdate.push( [ itemInputSub, itemOutputSubArray, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray, ] )
                    break

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                    // Create object and add to output
                    const itemOutputSubObject = {}
                    argOutputToUpdate[ itemKey ] = itemOutputSubObject

                    // Prep next iteration
                    argArrayStackToUpdate.push( [ itemInputSub, itemOutputSubObject, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject, ] )
                    break

                default:

                    // Process value and add to output
                    argOutputToUpdate[ itemKey ] = argCallback( itemInputSub )
                    break
            }
        }
    }

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
            const itemEnum = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( item )

            switch ( itemEnum ) {

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:
                    //
                    // If anything here fails, then something about the path or object is bad
                    //
                    const itemKeyNumber = Number( itemKey )
                    //
                    // If itemKeyNumber is NaN then the conversion failed. Return an error.
                    //
                    if ( isNaN( itemKeyNumber ) ) {
                        return helperAnalyzeJson._getErrorBecausePathFailed( argArrayPath, itemIntIndexForArgArrayPath, arg, item, )
                    } else {
                        //
                        // If itemKeyNumber is outside the range of item, then return an error
                        //
                        if ( 0 > itemKeyNumber || itemKeyNumber >= item.length ) {
                            return helperAnalyzeJson._getErrorBecausePathFailed( argArrayPath, itemIntIndexForArgArrayPath, arg, item, )
                        } else { item = item[ itemKeyNumber ] }
                    }
                    break

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:
                    //
                    // If key doesn't exist here, then return Error
                    //
                    const itemKeyString = JSON.stringify(itemKey)
                    if ( Object.keys( item ).includes( itemKeyString ) ) { item = item[ itemKeyString ]
                    } else {
                        return helperAnalyzeJson._getErrorBecausePathFailed( argArrayPath, itemIntIndexForArgArrayPath, arg, item, )
                    }
                    break

                //
                // Make sure we don't try to index a non-object
                //
                default:
                    return itemIntIndexForArgArrayPath >= intIndexLast
                        ? item
                        : helperAnalyzeJson._getErrorBecausePathFailed( argArrayPath, itemIntIndexForArgArrayPath, arg, item, )
            }
        }
        //
        // If we get this far with no error, then return itemObject
        //
        return item
    }

    /**
     * @param {[]} argArrayPath
     * @param {number} argIntIndexOfFailure
     * @param {object} argObjectRoot
     * @param {object} argObjectOfFailure
     * @returns Error
     * */
    static _getErrorBecausePathFailed( argArrayPath, argIntIndexOfFailure, argObjectRoot, argObjectOfFailure ) {

        const arrayOfStrings = [

            `Failed to get value at path.`,
            `Path = ${argArrayPath}`,
            `Array path that exists = ${ argArrayPath.slice( 0, argIntIndexOfFailure, ) }`,
            `Failed key = ${ argArrayPath[ argIntIndexOfFailure ] }`,
            `Failed index = ${ argIntIndexOfFailure }`,
            `Object at failure's type = ${ typeof argObjectOfFailure }`,
            `Is root object defined? ${ argObjectRoot !== undefined && argObjectRoot !== null ? 'yes' : 'no' }`,

        ]

        switch ( helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( argObjectOfFailure ) ) {

            case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                arrayOfStrings.push( `Array object's size = ${ argObjectOfFailure.length }` )
                break

            case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                arrayOfStrings.push( `Object's keys = ${ Object.keys( argObjectOfFailure ).sort() }` )
                break

            default:

                arrayOfStrings.push( `Object at failure isn't a container.` )
                break
        }
        return Error( arrayOfStrings.reduce( ( itemStringPrev, itemString ) => `${itemStringPrev}\n${itemString}` ) )
    }

    //
    // Public - logic
    //
    /**
     * @param {any} argRootInputOne
     * @param {any} argRootInputTwo
     * @returns boolean
     * */
    static logicTreeContentsAreEqual = ( argRootInputOne, argRootInputTwo ) => {

        const enumTypeForArgTreeOne = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( argRootInputOne )
        const enumTypeForArgTreeTwo = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( argRootInputTwo )

        // Return false if roots are not the same type
        if ( enumTypeForArgTreeOne !== enumTypeForArgTreeTwo ) { return false }

        // If roots are not iterable then do a simple comparison
        if ( enumTypeForArgTreeOne === helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldEitherNonIterableOrString ) { return argRootInputOne === argRootInputTwo }
        //
        // Complex comparison starts here
        //
        const arrayStackToProcess = [ [
            [ argRootInputOne, enumTypeForArgTreeOne, ],
            [ argRootInputTwo, enumTypeForArgTreeTwo, ],
        ] ]

        while ( arrayStackToProcess.length !== 0 ) {

            const itemPackage = arrayStackToProcess.pop()

            if ( itemPackage !== undefined ) {

                const [ [ itemInputOne, itemEnumTypeForInputOne, ], [ itemInputTwo, itemEnumTypeForInputTwo, ], ] = itemPackage

                if ( itemEnumTypeForInputOne !== itemEnumTypeForInputTwo ) { return false }

                switch ( itemEnumTypeForInputOne ) {

                    case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                        if ( !helperAnalyzeJson._processArrayForCompare( itemInputOne, itemInputTwo, arrayStackToProcess, ) ) { return false }
                        break

                    case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                        if ( !helperAnalyzeJson._processObjectForCompare( itemInputOne, itemInputTwo, arrayStackToProcess, ) ) { return false }
                        break

                    // If itemInputOne is neither an array or an object, then do a basic comparison
                    // This should theoretically never run, except possibly on the first iteration
                    default:

                        if ( itemInputOne !== itemInputTwo ) { return false }
                        break
                }
            }
        }
        return true
    }

    /**
     * Return true if all diff checks pass; return false if one of them fails
     * Add to the stack if necessary
     *
     * @param {[]} argArrayInputOne
     * @param {[]} argArrayInputTwo
     * @param {[]} argArrayStackToUpdate
     * */
    static _processArrayForCompare = ( argArrayInputOne, argArrayInputTwo, argArrayStackToUpdate ) => {

        if ( argArrayInputOne.length !== argArrayInputTwo.length ) { return false }

        for ( let itemIntIndex = 0, intLength = argArrayInputOne.length; itemIntIndex < intLength; itemIntIndex++ ) {

            const itemInputSubOne = argArrayInputOne[ itemIntIndex ]
            const itemInputSubTwo = argArrayInputTwo[ itemIntIndex ]

            const itemEnumDataTypeInputSubOne = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( itemInputSubOne )
            const itemEnumDataTypeInputSubTwo = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( itemInputSubTwo )

            if ( itemEnumDataTypeInputSubOne !== itemEnumDataTypeInputSubTwo ) { return false }

            switch ( itemEnumDataTypeInputSubOne ) {

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                    argArrayStackToUpdate.push( [
                        [ itemInputSubOne, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray, ],
                        [ itemInputSubTwo, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray, ],
                    ] )
                    break

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                    argArrayStackToUpdate.push( [
                        [ itemInputSubOne, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject, ],
                        [ itemInputSubTwo, helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject, ],
                    ] )
                    break

                default:

                    if ( itemInputSubOne !== itemInputSubTwo ) { return false }
                    break
            }
        }
        return true
    }

    /**
     * Return true if all diff checks pass; return false if one of them fails
     * Add to the stack if necessary
     *
     * @param {object} argObjectInputOne
     * @param {object} argObjectInputTwo
     * @param {[]} argArrayStackToUpdate
     * */
    static _processObjectForCompare = ( argObjectInputOne, argObjectInputTwo, argArrayStackToUpdate ) => {

        const arrayOfKeysInputOne = Object.keys( argObjectInputOne )
        const arrayOfKeysInputTwo = Object.keys( argObjectInputTwo )

        if ( arrayOfKeysInputOne.length !== arrayOfKeysInputTwo.length ) { return false }

        for ( let itemIntIndex = 0, intLength = arrayOfKeysInputOne.length; itemIntIndex < intLength; itemIntIndex++ ) {

            const itemKeyInputOne = arrayOfKeysInputOne[ itemIntIndex ]
            const itemKeyInputTwo = arrayOfKeysInputTwo[ itemIntIndex ]

            if ( itemKeyInputOne !== itemKeyInputTwo ) { return false }

            const itemInputOneSub = argObjectInputOne[ itemKeyInputOne ]
            const itemInputTwoSub = argObjectInputTwo[ itemKeyInputTwo ]

            const itemInputOneSubType = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( itemInputOneSub )
            const itemInputTwoSubType = helperAnalyzeJson.fieldEnumSignificantDataTypes.getEnumDataType( itemInputTwoSub )

            if ( itemInputOneSubType !== itemInputTwoSubType ) { return false }

            switch ( itemInputOneSubType ) {

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldArray:

                    argArrayStackToUpdate.push( [
                        [ itemInputOneSub, itemInputOneSubType, ],
                        [ itemInputTwoSub, itemInputTwoSubType, ],
                    ] )
                    break

                case helperAnalyzeJson.fieldEnumSignificantDataTypes.fieldObject:

                    argArrayStackToUpdate.push( [
                        [ itemInputOneSub, itemInputOneSubType, ],
                        [ itemInputTwoSub, itemInputTwoSubType, ],
                    ] )
                    break

                default:

                    if ( itemInputOneSub !== itemInputTwoSub ) { return false }
                    break
            }
        }
        return true
    }
}












































