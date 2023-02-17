//
// Libraries - downloaded
//
import * as path from "path";
//
// Public
//
export default class helperPaths {
    //
    // Public - get
    //
    /**
     * @param {string[]} argArrayOfStrings
     * @returns string
     * */
    static getPathByCombiningStrings = (argArrayOfStrings) =>
        path.join(...argArrayOfStrings);
    //
    // Public - is
    //
    /**
     * @param {string} argStringPath
     * @returns boolean
     * */
    static isPathAbsolute = (argStringPath) => path.isAbsolute(argStringPath);
}
