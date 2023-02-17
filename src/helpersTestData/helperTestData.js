//
// Public
//
export default class helperTestData {
    //
    // Public - get - arrays
    //
    /**
     * @returns any[]
     * */
    static getArrayNestedSimple = () => [
        "zero",
        "one",
        "two",
        "three",
        ["four", "five", "six"],
        "seven",
        "eight",
        "nine",
    ];
    /**
     * @param {number} argIntSize
     * @returns {number[]}
     * */
    static getArrayOfNumbers = (argIntSize) => [...Array(argIntSize).keys()];
    /**
     * @returns {string[]}
     * */
    static getArraySimple = () => ["one", "two", "three"];
    //
    // Public - get - object
    //
    /**
     * @returns {object}
     * */
    static getObjectNestedComplex = () => ({
        //
        // Single values
        //
        int: 1,
        string: "testString",
        zero: 0,
        //
        // Arrays
        //
        array: ["array.0", "array.1", "array.2"],
        arrayOfArrays: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ],
        //
        // Object
        //
        object: {
            "object.0": 0,
            "object.1": 1,
            "object.2": 2,
        },
        objectOfObjects: {
            "objectOfObjects.0": {
                "objectSub.0.0": 0,
                "objectSub.0.1": 1,
                "objectSub.0.2": 2,
            },
            "objectOfObjects.1": {
                "objectSub.1.3": 3,
                "objectSub.1.4": 4,
                "objectSub.1.5": 5,
            },
            "objectOfObjects.2": {
                "objectSub.2.6": 6,
                "objectSub.2.7": 7,
                "objectSub.2.8": 8,
            },
        },
    });
    /**
     * @returns {object}
     * */
    static getObjectNestedSimple = () => ({
        //
        // Single values
        //
        int: 1,
        string: "testString",
        zero: 0,
        //
        // Arrays
        //
        array: ["array.0", "array.1", "array.2"],
        //
        // Object
        //
        object: {
            "object.0": 0,
            "object.1": 1,
            "object.2": 2,
        },
    });
    //
    // Public - string
    //
    /**
     * @returns string
     * */
    static getStringUrlExampleCom = () => "http://example.com/";
}
