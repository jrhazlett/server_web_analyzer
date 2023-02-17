/*
Note: This all runs on a secondary thread
*/
//
// Libraries - native
//
import { isMainThread, parentPort } from "node:worker_threads";
//
// Libraries - downloaded
//
import axios from "axios";
import prettyPrinterForHumans from "pretty_printer_for_humans";
//
// Libraries - custom
//
// Debugging
//
// console.log( `workerThreads.isMainThread = ${workerThreads.isMainThread}` )
//
// Localized helper for moving message values to the callback
//
class _helperLocal {
    /**
     * This function...
     * Grabs all the arguments with the 'arg' prefix from the callback
     * It uses those argument names to lookup the arguments passed via argMessageReceived
     * Then it returns the array of arguments for unpacking later
     *
     * @param {Function} argCallback
     * @param {Object} argMessageReceived
     * @returns {any[]}
     * */
    static getArrayOfArgs = (argCallback, argMessageReceived) => {
        // Reminder: This attribute is necessary because the community seems really fuzzy about whether
        // the properties of a given object will always maintain their original order.
        let arrayOfStringNamesInOrder =
            argMessageReceived.argArrayOfKeysInOrder;
        let setOfStringNamesFromCallback = new Set(
            _helperLocal
                .getArrayOfNamesForParameters(argCallback)
                .filter(
                    (itemStringName) =>
                        itemStringName !== "argStringNameForFunction"
                )
        );
        const arrayToReturn = new Array(arrayOfStringNamesInOrder.length);
        let itemIntIndex = -1;
        const intLength = arrayOfStringNamesInOrder.length;
        while (++itemIntIndex < intLength) {
            const itemStringName = arrayOfStringNamesInOrder[itemIntIndex];
            if (setOfStringNamesFromCallback.has(itemStringName)) {
                arrayToReturn[itemIntIndex] =
                    argMessageReceived[itemStringName];
            }
        }
        return arrayToReturn;
    };

    /**
     * @param {Function} argFunction
     * @returns {string[]}
     * */
    static getArrayOfNamesForParameters = (argFunction) => {
        const stringFromCallback = argFunction
            .toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, ``);
        const arrayToReturn = stringFromCallback
            .slice(
                stringFromCallback.indexOf("(") + 1,
                stringFromCallback.indexOf(")")
            )
            .match(/([^\s,]+)/g);
        return arrayToReturn === null
            ? []
            : arrayToReturn.filter((itemStringNameArg) =>
                  itemStringNameArg.startsWith("arg")
              );
    };

    /**
     * This function extracts the associated callback identified by name.
     *
     * @param {Object} argObject
     * @param {Object} argMessageReceived
     * @returns Function
     * */
    static getCallback = (argObject, argMessageReceived) =>
        argObject[argMessageReceived.argStringNameForFunction];
}
//
// NOTE: This runs on the 2nd thread
//
// Reminders: argMessage is an object, which accepts string keys
//
parentPort.once("message", (argMessageReceived) => {
    //
    // Get callback from an imported library
    //
    const callback = _helperLocal.getCallback(
        prettyPrinterForHumans,
        argMessageReceived
    );
    //
    // Get array of args to unpack into callback
    // This calls the callback and then unpacks an array of args into it
    //
    parentPort.postMessage(
        callback(..._helperLocal.getArrayOfArgs(callback, argMessageReceived))
    );
});
