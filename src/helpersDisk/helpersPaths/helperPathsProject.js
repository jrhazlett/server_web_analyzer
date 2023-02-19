//
// Libraries - downloaded
//
import fs from "fs";
import path from "path";
//
// Libraries - custom
//
import helperErrors from "../../helpersErrors/helperErrors.js";
import helperStrings from "../../helpersStrings/helperStrings.js";
//
// Public
//
class HelperPathsProject {
    //
    // Public - get
    //
    /**
     * @param {string} argStringPath
     * @returns {string}
     * */
    getStringPathAncestor = (argStringPath) => { return path.dirname(argStringPath); }

    /**
     * @param {string} argStringPath
     * @returns {Error|undefined}
     * */
    getErrorIfPathIsOutsideProject = (argStringPath) => {
        if (!argStringPath.startsWith(this.fieldStringPathDirProject)) {
            throw Error(
                helperStrings.getStringByCombiningArray(
                    [
                        "argStringPath is outside the project.",
                        `argStringPath = ${argStringPath}`,
                        `this.fieldStringPathDirProject = ${this.fieldStringPathDirProject}`,
                        `argStringPath.startsWith( this.fieldStringPathDirProject ) = ${argStringPath.startsWith(
                            this.fieldStringPathDirProject
                        )}`,
                    ],
                    "\n"
                )
            );
        }
        return undefined;
    };

    /**
     * @param {string} argStringPathRel
     * @returns {string}
     * */
    getStringPathAbsolute = (argStringPathRel) => {
        return path.join(this.fieldStringPathDirProject, argStringPathRel);
    }

    /**
     * @param {string} argStringPathRel
     * @returns {string}
     * */
    getStringPathDataInput = (argStringPathRel = undefined) => {
        return argStringPathRel === undefined
            ? this.fieldStringPathDirDataOutput
            : path.join(this.fieldStringPathDirDataOutput, argStringPathRel);
    }

    /**
     * @param {string} argStringPathRel
     * @returns {string}
     * */
    getStringPathDataOutput = (argStringPathRel = undefined) => {
        return argStringPathRel === undefined
            ? this.fieldStringPathDirDataOutput
            : path.join(this.fieldStringPathDirDataOutput, argStringPathRel);
    }

    /**
     * @param {string} argStringPath
     * @returns {boolean}
     * */
    isDirProjectRoot = (argStringPath) => {
        return fs.readdirSync(argStringPath).includes("package.json");
    }
    //
    // Setup
    //
    /***/
    constructor() {
        this.fieldStringPathDirProject = this._getStringPathDirProjectRoot();
        this.fieldStringPathDirData = path.join(
            this.fieldStringPathDirProject,
            "data"
        );
        this.fieldStringPathDirDataOutput = path.join(
            this.fieldStringPathDirData,
            "dataOutput"
        );
    }

    /**
     * This returns the path to the first dir that contains a "package.json" file
     *
     * @returns {string|undefined}
     * */
    _getStringPathDirProjectRoot = () => {
        let stringToReturn = path.resolve("");
        while (true) {
            switch (true) {
                //
                // Return the first dir that contains 'package.json'
                //
                case this.isDirProjectRoot(stringToReturn):
                    return stringToReturn;
                //
                // If we get to the root dir, then obviously this is a major error; return undefined
                //
                case stringToReturn === "/":
                    return undefined;
                default:
                    stringToReturn = path.dirname(stringToReturn);
            }
        }
    };
}
//
// Public
//
let helperPathsProject = new HelperPathsProject();
export default helperPathsProject;
