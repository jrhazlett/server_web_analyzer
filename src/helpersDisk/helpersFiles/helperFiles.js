//
// Libraries - downloaded
//
import fs from "fs";
import os from "os";
//
// Public
//
export default class helperFiles {
    //
    // Public - get
    //
    /**
     * @param {string} argStringPathFile
     * @returns {Object}
     * */
    static getObjectFromFile = ( argStringPathFile ) => JSON.parse( fs.readFileSync( argStringPathFile, { encoding: "utf-8" }, ) )

    /**
     * @param {string} argStringPathFile
     * @returns {string}
     * */
    static getStringFromFile = (argStringPathFile) => { return fs.readFileSync(argStringPathFile, "utf-8"); }
    //
    // Public - raise
    //
    /**
     * @param {string} argStringPath
     * */
    static raiseErrorIfPathIsNotInHome = (argStringPath) => {
        if (!argStringPath.startsWith(os.homedir())) {
            throw new Error(
                [
                    "Error: argStringPath is not in HOME dir.",
                    `argStringPath = ${argStringPath}`,
                    `os.homedir() = ${os.homedir()}`,
                    `argStringPath.startsWith( os.homedir() ) = ${argStringPath.startsWith(
                        os.homedir()
                    )}`,
                    " ",
                ].reduce(
                    (itemStringPrev, itemString) =>
                        `${itemStringPrev}\n${itemString}`
                )
            );
        }
    };
    //
    // Public - write
    //
    /**
     * @param {string} argStringPathFile
     * @param {Object} argObject
     * */
    static writeObjectToFile = async (argStringPathFile, argObject) => {
        helperFiles.raiseErrorIfPathIsNotInHome(argStringPathFile);
        fs.writeFileSync(
            argStringPathFile,
            JSON.stringify(argObject, null, 4),
            { encoding: "utf-8" }
        );
    };
}
