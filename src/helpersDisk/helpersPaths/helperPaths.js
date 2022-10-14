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
     * @param {[]} argArrayOfStrings
     * @returns string
     * */
    static getPathByCombiningStrings = ( argArrayOfStrings ) => {
        return path.join( ...argArrayOfStrings )
    }
    //
    // Public - logic
    //
    /**
     * @param {string} argStringPath
     * @returns boolean
     * */
    static logicPathIsAbsolute = ( argStringPath ) => { return path.isAbsolute( argStringPath ) }
}



















































