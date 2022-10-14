"use strict";
/*
Note: This all runs on a secondary thread

REMINDER: This runs on the 2nd thread

How this module works...

This is designed to be a 'universal' worker.

The worker gets the callback passed via argMessageReceived.argStringNameForFunction.
Then it extracts a list of argument names from the function's signature.
It uses these names to construct an array of argument values.
It then unpacks these values into the callback.
*/
import { parentPort } from "node:worker_threads";
import helperGlobals from "../helpersSupport/helperGlobals.js";

import prettyPrinterForHumans from "../../src/prettyPrinterForHumans.js";

class _helperLocal {
  /**
   * This function...
   * Grabs all the arguments with the 'arg' prefix from the callback
   * It uses those argument names to lookup the arguments passed via argMessageReceived
   * Then it returns the array of arguments for unpacking later
   *
   * @param {Function} argCallback
   * @param {Object} argMessageReceived
   * @returns []
   * */
  static getArrayOfArgs = (argCallback, argMessageReceived) => {
    // Reminder: This attribute is necessary because the community seems really fuzzy about whether
    // or not the properties of a given object will always maintain their original order.
    let arrayOfStringNamesInOrder = argMessageReceived.argArrayOfKeysInOrder;
    let setOfStringNamesFromCallback = new Set(
      helperGlobals
        .getArrayOfNamesForParameters(argCallback)
        .filter(
          (itemStringName) => itemStringName !== "argStringNameForFunction"
        )
    );
    const arrayToReturn = new Array(arrayOfStringNamesInOrder.length);
    for (
      let itemIntIndex = 0, intLength = arrayOfStringNamesInOrder.length;
      itemIntIndex < intLength;
      itemIntIndex++
    ) {
      const itemStringName = arrayOfStringNamesInOrder[itemIntIndex];
      if (setOfStringNamesFromCallback.has(itemStringName)) {
        arrayToReturn[itemIntIndex] = argMessageReceived[itemStringName];
      }
    }
    return arrayToReturn;
  };

  /**
   * This function extracts the associated callback identified by name.
   *
   * @param {Object} argMessageReceived
   * @returns Function
   * */
  static getCallback = (argMessageReceived) => {
    return prettyPrinterForHumans[argMessageReceived.argStringNameForFunction];
  };
}
//
// Public
//
parentPort.once(`message`, (argMessageReceived) => {
  const callback = _helperLocal.getCallback(argMessageReceived);
  //
  // Unpack the array of arguments into the callback
  //
  parentPort.postMessage(
    callback(..._helperLocal.getArrayOfArgs(callback, argMessageReceived))
  );
});



































