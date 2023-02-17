/*
Notes: Everything here runs in the 'main' thread
*/
//
// Libraries - downloaded?
//
import { isMainThread, Worker } from "node:worker_threads";
//
// Debugging
//
//console.log( "isMainThread =", isMainThread, )
//
// Worker
//
const stringPathWorker = "./src/helpersWorkers/worker.js";
//
// Public
//
export default class helperSpawnerForWorkers {
    //
    // Public - get
    //
    /***
     * @param {any} arg
     * @param {any[]} argArrayPath
     * @returns {Promise}
     */
    static getPromiseForSpawnedWorker = async (arg, argArrayPath) =>
        new Promise((resolve, reject) => {
            const worker = new Worker(stringPathWorker, { type: "module" });
            //
            // Return on success
            //
            worker.once("message", (argForMessage) => resolve(argForMessage));
            //
            // Return on error
            //
            worker.onerror = (err) =>
                reject(`${stringPathWorker}: err = ${err}`);
            //
            // Pass arg to worker
            //
            worker.postMessage({
                arg: arg,
                argArrayPath: argArrayPath,
                argArrayOfKeysInOrder: ["argArrayPath", "arg"],
                argStringNameForFunction: "getValueAtPathInArg",
            });
        });
}
