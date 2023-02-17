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
    static getEmptyValueOfComplexTypeViaEnumType = (argEnumType) => {
        switch (argEnumType) {
            case _helperEnumDataTypes.fieldArray:
                return [];
            case _helperEnumDataTypes.fieldError:
                return new Error();
            case _helperEnumDataTypes.fieldMap:
                return new Map();
            case _helperEnumDataTypes.fieldObject:
                return {};
            case _helperEnumDataTypes.fieldSet:
                return new Set();
            default:
                return undefined;
        }
    };

    /**
     * @param {any} arg
     * @returns number
     * */
    static getEnumDataType = (arg) => {
        switch (typeof arg) {
            case "function":
                return _helperEnumDataTypes.fieldFunction;
            case "object":
                return _helperEnumDataTypes._getEnumDataTypeForObject(arg);
            case "symbol":
                return _helperEnumDataTypes.fieldSymbol;
            case "undefined":
                return _helperEnumDataTypes.fieldEitherNonIterableOrString;
            default:
                return _helperEnumDataTypes.fieldEitherNonIterableOrString;
        }
    };

    /**
     * @param {Object} argObject
     * @return number
     * */
    static _getEnumDataTypeForObject = (argObject) => {
        switch (true) {
            case Array.isArray(argObject):
                return _helperEnumDataTypes.fieldArray;
            case argObject instanceof Error:
                return _helperEnumDataTypes.fieldError;
            case argObject instanceof Map:
                return _helperEnumDataTypes.fieldMap;
            case argObject === null:
                return _helperEnumDataTypes.fieldEitherNonIterableOrString;
            case argObject instanceof Promise:
                return _helperEnumDataTypes.fieldPromise;
            case argObject instanceof Set:
                return _helperEnumDataTypes.fieldSet;
            default:
                return _helperEnumDataTypes.fieldObject;
        }
    };

    /**
     * @param {number} argEnumType
     * @returns boolean
     * */
    static isEnumTypeToProcess = (argEnumType) =>
        _helperEnumDataTypes.fieldSetOfTypesToProcess.has(argEnumType);
}
//
// Class
//
class _HelperItemForStack {
    //
    // Setup
    //
    /**
     * @param {any} argInputOne
     * @param {number} argInputOneEnumDataType
     * @param {any} argInputTwo
     * @param {number} argInputTwoEnumDataType
     * @param {[]} argStack
     * @param {Set} argSetTrackerForCircularReferences
     * */
    constructor(
        argInputOne,
        argInputOneEnumDataType,
        argInputTwo,
        argInputTwoEnumDataType,
        argStack,
        argSetTrackerForCircularReferences
    ) {
        this.fieldInputOne = argInputOne;
        this.fieldInputOneEnumDataType = argInputOneEnumDataType;

        this.fieldInputTwo = argInputTwo;
        this.fieldInputTwoEnumDataType = argInputTwoEnumDataType;

        this.fieldStack = argStack;

        this.fieldSetTrackerForCircularReferences =
            argSetTrackerForCircularReferences;
    }
}
//
// Public
//
export default class helperCompareTrees {
    //
    // Public - is
    //
    /**
     * @param {any} argRootInputOne
     * @param {any} argRootInputTwo
     * @returns boolean
     * */
    static isTreeContentsEqual = (argRootInputOne, argRootInputTwo) => {
        const setTrackerForCircularReferences = new Set();

        const enumTypeForArgTreeOne =
            _helperEnumDataTypes.getEnumDataType(argRootInputOne);
        const enumTypeForArgTreeTwo =
            _helperEnumDataTypes.getEnumDataType(argRootInputTwo);
        //
        // Return false if roots are not the same type
        //
        if (enumTypeForArgTreeOne !== enumTypeForArgTreeTwo) {
            return false;
        }
        //
        // If roots are not iterable then do a simple comparison
        //
        if (
            enumTypeForArgTreeOne ===
            _helperEnumDataTypes.fieldEitherNonIterableOrString
        ) {
            return argRootInputOne === argRootInputTwo;
        }
        //
        // Setup stack
        //
        const arrayStackToProcess = [];
        arrayStackToProcess.push(
            new _HelperItemForStack(
                argRootInputOne,
                enumTypeForArgTreeOne,
                argRootInputTwo,
                enumTypeForArgTreeTwo,
                arrayStackToProcess,
                setTrackerForCircularReferences
            )
        );
        //
        // Process stack
        //
        while (arrayStackToProcess.length !== 0) {
            const itemHelperItemForStack = arrayStackToProcess.pop();
            if (itemHelperItemForStack !== undefined) {
                const itemInputOneEnumDataType =
                    itemHelperItemForStack.fieldInputOneEnumDataType;
                //
                // If the data types don't match, then return false
                //
                if (
                    itemInputOneEnumDataType !==
                    itemHelperItemForStack.fieldInputTwoEnumDataType
                ) {
                    return false;
                }
                //
                // Once we get this far, we verified both data types already match
                // Need to do a more in-depth analysis
                //
                switch (itemInputOneEnumDataType) {
                    case _helperEnumDataTypes.fieldArray:
                        //
                        // Compare the children and return false if there's a mismatch detected
                        //
                        if (
                            !helperCompareTrees._processArrayForCompare(
                                itemHelperItemForStack
                            )
                        ) {
                            return false;
                        }
                        break;

                    case _helperEnumDataTypes.fieldObject:
                        //
                        // Compare the children and return false if there's a mismatch detected
                        //
                        if (
                            !helperCompareTrees._processObjectForCompare(
                                itemHelperItemForStack
                            )
                        ) {
                            return false;
                        }
                        break;
                    //
                    // If itemInputOne is neither an array or an object, then do a basic comparison
                    // This should theoretically never run, except possibly on the first iteration
                    //
                    default:
                        if (
                            itemHelperItemForStack.fieldInputOne !==
                            itemHelperItemForStack.fieldInputTwo
                        ) {
                            return false;
                        }
                        break;
                }
            }
        }
        return true;
    };
    //
    // Private
    //
    /**
     * Return true if all diff checks pass; return false if one of them fails
     * Add to the stack if necessary
     *
     * @param {_HelperItemForStack} argHelperItemForStack
     * */
    static _processArrayForCompare = (argHelperItemForStack) => {
        const inputOne = argHelperItemForStack.fieldInputOne;
        const inputTwo = argHelperItemForStack.fieldInputTwo;
        const stackToUpdate = argHelperItemForStack.fieldStack;
        const setTrackerForCircularReferences =
            argHelperItemForStack.fieldSetTrackerForCircularReferences;
        //
        // If both arrays aren't the same length, then they can't be equal.
        //
        if (inputOne.length !== inputTwo.length) {
            return false;
        }

        for (
            let itemIntIndex = 0, intLength = inputOne.length;
            itemIntIndex < intLength;
            itemIntIndex++
        ) {
            const itemInputSubOne = inputOne[itemIntIndex];
            const itemInputSubTwo = inputTwo[itemIntIndex];

            const itemEnumDataTypeInputSubOne =
                _helperEnumDataTypes.getEnumDataType(itemInputSubOne);
            //
            // If two data types aren't the same, then they can't be equal. Return false.
            //
            if (
                itemEnumDataTypeInputSubOne !==
                _helperEnumDataTypes.getEnumDataType(itemInputSubTwo)
            ) {
                return false;
            }
            switch (itemEnumDataTypeInputSubOne) {
                case _helperEnumDataTypes.fieldArray:
                    if (!setTrackerForCircularReferences.has(itemInputSubOne)) {
                        //
                        // Add memory id to set to prevent circular references
                        //
                        setTrackerForCircularReferences.add(itemInputSubOne);
                        //
                        // Add child to stack
                        //
                        stackToUpdate.push(
                            new _HelperItemForStack(
                                itemInputSubOne,
                                _helperEnumDataTypes.fieldArray,
                                itemInputSubTwo,
                                _helperEnumDataTypes.fieldArray,
                                stackToUpdate,
                                setTrackerForCircularReferences
                            )
                        );
                    }
                    break;

                case _helperEnumDataTypes.fieldObject:
                    if (!setTrackerForCircularReferences.has(itemInputSubOne)) {
                        //
                        // Add memory id to set to prevent circular references
                        //
                        setTrackerForCircularReferences.add(itemInputSubOne);
                        //
                        // Add child to stack
                        //
                        stackToUpdate.push(
                            new _HelperItemForStack(
                                itemInputSubOne,
                                _helperEnumDataTypes.fieldObject,
                                itemInputSubTwo,
                                _helperEnumDataTypes.fieldObject,
                                stackToUpdate,
                                setTrackerForCircularReferences
                            )
                        );
                    }
                    break;

                default:
                    if (itemInputSubOne !== itemInputSubTwo) {
                        return false;
                    }
                    break;
            }
        }
        return true;
    };

    /**
     * Return true if all diff checks pass; return false if one of them fails
     * Add to the stack if necessary
     *
     * @param {_HelperItemForStack} argHelperItemForStack
     * */
    static _processObjectForCompare = (argHelperItemForStack) => {
        const objectInputOne = argHelperItemForStack.fieldInputOne;
        const objectInputTwo = argHelperItemForStack.fieldInputTwo;
        const stackToUpdate = argHelperItemForStack.fieldStack;

        const arrayOfKeysInputOne = Object.keys(objectInputOne);
        const arrayOfKeysInputTwo = Object.keys(objectInputTwo);

        const setTrackerForCircularReferences =
            argHelperItemForStack.fieldSetTrackerForCircularReferences;
        //
        // If the lengths are not the same, then the objects can't be equal
        //
        if (arrayOfKeysInputOne.length !== arrayOfKeysInputTwo.length) {
            return false;
        }

        let itemIntIndex = -1;
        const intLength = arrayOfKeysInputOne.length;
        while (++itemIntIndex < intLength) {
            const itemInputOneSub =
                objectInputOne[arrayOfKeysInputOne[itemIntIndex]];
            const itemInputTwoSub =
                objectInputTwo[arrayOfKeysInputTwo[itemIntIndex]];
            const itemInputOneSubType =
                _helperEnumDataTypes.getEnumDataType(itemInputOneSub);
            const itemInputTwoSubType =
                _helperEnumDataTypes.getEnumDataType(itemInputTwoSub);
            //
            // If the data types aren't the same, then they can't be equal.
            //
            if (itemInputOneSubType !== itemInputTwoSubType) {
                return false;
            }

            switch (itemInputOneSubType) {
                case _helperEnumDataTypes.fieldArray:
                    if (!setTrackerForCircularReferences.has(itemInputOneSub)) {
                        //
                        // Add memory id to set to prevent circular references
                        //
                        setTrackerForCircularReferences.add(itemInputOneSub);
                        //
                        // Add child to stack
                        //
                        stackToUpdate.push(
                            new _HelperItemForStack(
                                itemInputOneSub,
                                itemInputOneSubType,
                                itemInputTwoSub,
                                itemInputTwoSubType,
                                stackToUpdate,
                                setTrackerForCircularReferences
                            )
                        );
                    }
                    break;
                case _helperEnumDataTypes.fieldObject:
                    if (!setTrackerForCircularReferences.has(itemInputOneSub)) {
                        //
                        // Add memory id to set to prevent circular references
                        //
                        setTrackerForCircularReferences.add(itemInputOneSub);
                        //
                        // Add child to stack
                        //
                        stackToUpdate.push(
                            new _HelperItemForStack(
                                itemInputOneSub,
                                itemInputOneSubType,
                                itemInputTwoSub,
                                itemInputTwoSubType,
                                stackToUpdate,
                                setTrackerForCircularReferences
                            )
                        );
                    }
                    break;
                default:
                    if (itemInputOneSub !== itemInputTwoSub) {
                        return false;
                    }
                    break;
            }
        }
        return true;
    };
}
