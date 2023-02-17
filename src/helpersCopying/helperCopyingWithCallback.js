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
     * @param {any} argInput
     * @param {any} argOutput
     * @param {number} argEnumDataType
     * @param {Function} argCallback
     * @param {_HelperItemForStack[]} argStack
     * */
    constructor(argInput, argOutput, argEnumDataType, argCallback, argStack) {
        this.fieldInput = argInput;
        this.fieldOutput = argOutput;
        this.fieldEnumDataType = argEnumDataType;
        this.fieldCallback = argCallback;
        this.fieldStack = argStack;
    }
}
//
// Public
//
export default class helperCopyingWithCallback {
    //
    // Public - get - getTreeCopiedWithValuesProcessedViaCallback
    //
    /**
     * This method returns the same data type as argInputRoot
     *
     * @param {any} argInputRoot
     * @param {Function} argCallback
     * @returns any
     * */
    static getTreeCopiedWithValuesProcessedViaCallback = (
        argInputRoot,
        argCallback
    ) => {
        //
        // Process single values
        //
        let outputRoot;
        const enumIntDataType =
            _helperEnumDataTypes.getEnumDataType(argInputRoot);
        switch (enumIntDataType) {
            case _helperEnumDataTypes.fieldArray:
                outputRoot = [];
                break;
            case _helperEnumDataTypes.fieldObject:
                outputRoot = {};
                break;
            default:
                return argCallback(argInputRoot);
        }
        //
        // Setup stack
        //
        const arrayStack = [];
        arrayStack.push(
            new _HelperItemForStack(
                argInputRoot,
                outputRoot,
                enumIntDataType,
                argCallback,
                arrayStack
            )
        );
        //
        // Process values throughout tree
        //
        while (arrayStack.length !== 0) {
            const itemHelperItemForStack = arrayStack.pop();
            switch (itemHelperItemForStack.fieldInputOneEnumDataType) {
                case _helperEnumDataTypes.fieldArray:
                    helperCopyingWithCallback._processArrayWithCallback(
                        itemHelperItemForStack
                    );
                    break;
                case _helperEnumDataTypes.fieldObject:
                    helperCopyingWithCallback._processObjectWithCallback(
                        itemHelperItemForStack
                    );
                    break;
                // If itemInput isn't iterable, then do nothing because we already added the necessary values
                default:
                    break;
            }
        }
        return outputRoot;
    };
    //
    // Private
    //
    /**
     * @param {_HelperItemForStack} argHelperItemForStack
     * */
    static _processArrayWithCallback = (argHelperItemForStack) => {
        const callback = argHelperItemForStack.fieldCallback;
        const input = argHelperItemForStack.fieldInput;
        const output = argHelperItemForStack.fieldOutput;
        const stack = argHelperItemForStack.fieldStack;

        let itemIntIndex = -1;
        const intLength = input.length;
        while (++itemIntIndex < intLength) {
            const itemInputSub = input[itemIntIndex];
            const itemEnumDataTypeInputSub =
                _helperEnumDataTypes.getEnumDataType(itemInputSub);
            switch (itemEnumDataTypeInputSub) {
                case _helperEnumDataTypes.fieldArray:
                    //
                    // Create array and add to output
                    //
                    const itemOutputSubArray = new Array(itemInputSub.length);
                    output[itemIntIndex] = itemOutputSubArray;
                    //
                    // Prep next iteration
                    //
                    stack.push(
                        new _HelperItemForStack(
                            itemInputSub,
                            itemOutputSubArray,
                            _helperEnumDataTypes.fieldArray,
                            callback,
                            stack
                        )
                    );
                    break;
                case _helperEnumDataTypes.fieldObject:
                    //
                    // Create object and add to output
                    //
                    const itemOutputSubObject = {};
                    output[itemIntIndex] = itemOutputSubObject;
                    //
                    // Prep next iteration
                    //
                    stack.push(
                        new _HelperItemForStack(
                            itemInputSub,
                            itemOutputSubObject,
                            _helperEnumDataTypes.fieldObject,
                            callback,
                            stack
                        )
                    );
                    break;
                default:
                    output[itemIntIndex] = callback(itemInputSub);
                    break;
            }
        }
    };

    /**
     * @param {_HelperItemForStack} argHelperItemForStack
     * */
    static _processObjectWithCallback = (argHelperItemForStack) => {
        const callback = argHelperItemForStack.fieldCallback;
        const input = argHelperItemForStack.fieldInput;
        const output = argHelperItemForStack.fieldOutput;
        const stack = argHelperItemForStack.fieldStack;

        const arrayKeys = Object.keys(input);

        let itemIntIndex = -1;
        const intLength = arrayKeys.length;
        while (++itemIntIndex < intLength) {
            const itemKey = arrayKeys[itemIntIndex];
            const itemInputSub = input[itemKey];
            const itemEnumDataTypeInputSub =
                _helperEnumDataTypes.getEnumDataType(itemInputSub);
            switch (itemEnumDataTypeInputSub) {
                case _helperEnumDataTypes.fieldArray:
                    //
                    // Create array and add to output
                    //
                    const itemOutputSubArray = new Array(itemInputSub.length);
                    output[itemKey] = itemOutputSubArray;
                    //
                    // Prep next iteration
                    //
                    stack.push(
                        new _HelperItemForStack(
                            itemInputSub,
                            itemOutputSubArray,
                            _helperEnumDataTypes.fieldArray,
                            callback,
                            stack
                        )
                    );
                    break;
                case _helperEnumDataTypes.fieldObject:
                    //
                    // Create object and add to output
                    //
                    const itemOutputSubObject = {};
                    output[itemKey] = itemOutputSubObject;
                    //
                    // Prep next iteration
                    //
                    stack.push(
                        new _HelperItemForStack(
                            itemInputSub,
                            itemOutputSubObject,
                            _helperEnumDataTypes.fieldObject,
                            callback,
                            stack
                        )
                    );
                    break;
                default:
                    output[itemKey] = callback(itemInputSub);
                    break;
            }
        }
    };
}
