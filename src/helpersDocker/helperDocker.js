//
// Libraries - downloaded
//
import fs from "fs";
//
// Public
//
export default class helperDocker {
    //
    // Public - is
    //
    /**
     * @returns {boolean}
     * */
    static isRunningInDocker = () => { return fs.existsSync("/.dockerenv"); }
}
