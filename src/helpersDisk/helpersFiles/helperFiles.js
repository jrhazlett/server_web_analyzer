//
// Libraries - downloaded
//
import fs from "fs";
//
// Class
//
export default class helperFiles {
    //
    // Public - get
    //
    /**
     * @param {string} argStringPathFile
     * */
    static getStringFromFile = ( argStringPathFile ) => {

        return fs.readFileSync(
            argStringPathFile,
            "utf-8"
        )
    }
}


















































