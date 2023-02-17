/*
Reminder:

This class is pretty much in response to an xpath bug:
//dev//h1 ... which *should* have been //div//h1
*/
//
// Libraries - downloaded
//
// Libraries - custom
//
import helperErrors from "../helpersErrors/helperErrors.js";
import helperStrings from "../helpersStrings/helperStrings.js";
//
// Public
//
export default class helperValidatorHtmlTags {
    //
    // Public - get
    //
    /**
     * @param {string} argStringXpath
     * @returns { Error | undefined }
     *
     * Example valid path: //div//h1
     * Example invalid path: //dev//h1
     * */
    static getErrorIfXpathDoesNotHaveOnlyStandardTasks = (argStringXpath) => {
        const arrayOfInvalidTags =
            helperValidatorHtmlTags._getArrayOfInvalidTags(argStringXpath);
        return arrayOfInvalidTags.length <= 0
            ? undefined
            : helperErrors.raiseError(
                  Error(
                      helperStrings.getStringByCombiningArray(
                          [
                              "argStringXpath is not exclusively standard tags",
                              `argStringXpath = ${argStringXpath}`,
                              `arrayOfInvalidTags = ${helperStrings.getStringPrintableFromIterable(
                                  arrayOfInvalidTags
                              )}`,
                              " ",
                          ],
                          "\n"
                      )
                  )
              );
    };

    /**
     * @param {string} argStringXpath
     * @returns {string[]}
     * */
    static _getArrayOfInvalidTags = (argStringXpath) => {
        const arrayOfSubStrings = argStringXpath.split("/");
        const arrayToReturn = [];
        let itemIndex = -1;
        const intLength = arrayOfSubStrings.length;
        while (++itemIndex < intLength) {
            let itemString = arrayOfSubStrings[itemIndex];
            if (itemString.length > 0) {
                itemString =
                    helperValidatorHtmlTags._getStringMostLikelyTag(itemString);
                if (
                    !helperValidatorHtmlTags.logicStringIsValidHtmlTagNoAngleBrackets(
                        itemString
                    )
                ) {
                    arrayToReturn.push(itemString);
                }
            }
        }
        return arrayToReturn;
    };

    /**
     * @param {string} argString
     * @returns {string}
     * */
    static _getStringMostLikelyTag = (argString) => {
        switch (true) {
            case argString.length === 0:
                return argString;
            case argString.includes("["):
                return argString.split("[")[0];
            default:
                return argString;
        }
    };
    //
    // Public - logic
    //
    /**
     * Reminder: This check includes '<>' checks
     *
     * @param {string} argString
     * @returns {boolean}
     * */
    static logicStringIsValidHtmlTag = (argString) =>
        helperValidatorHtmlTags.FIELD_SET_OF_STANDARD_HTML_TAGS.has(argString);

    /**
     * Reminder: strings missing '<>' *will* return false
     *
     * @param {string} argString
     * @returns {boolean}
     * */
    static logicStringIsValidHtmlTagNoAngleBrackets = (argString) =>
        helperValidatorHtmlTags.FIELD_SET_OF_STANDARD_HTML_TAGS_NO_ANGLE_BRACKETS.has(
            argString
        );

    /**
     * Returns 'false' if not all tags exist in the standard set
     * Obviously in cases where the site is built by something like react, where non-standard tags can exist
     * so use judiciously
     *
     * @param {string} argStringXpath
     * @returns {boolean}
     * */
    static logicXpathHasOnlyStandardHtmlTags = (argStringXpath) => {
        //
        // A complex
        //
        const arrayOfSubStrings = argStringXpath.split("/");
        let itemIndex = -1;
        const intLength = arrayOfSubStrings.length;
        while (++itemIndex < intLength) {
            const itemSubString = arrayOfSubStrings[itemIndex];
            //
            // If string contains characters, then do the check
            // If its empty, then just move onto the next substring
            //
            if (itemSubString.length > 0) {
                //
                // If there's '[' in the string, then its likely something like 'div[@id]'
                //
                const itemBoolStringUsesHtmlTagStandardWithoutSlashed =
                    itemSubString.includes("[")
                        ? //
                          // The first item here will be the most likely tag
                          //
                          helperValidatorHtmlTags.FIELD_SET_OF_STANDARD_HTML_TAGS_NO_ANGLE_BRACKETS.has(
                              itemSubString.split("[")[0]
                          )
                        : //
                          // If there's no '[' in the string, then the string is likely something like 'div'
                          //
                          helperValidatorHtmlTags.FIELD_SET_OF_STANDARD_HTML_TAGS_NO_ANGLE_BRACKETS.has(
                              itemSubString
                          );

                if (!itemBoolStringUsesHtmlTagStandardWithoutSlashed) {
                    return false;
                }
            }
        }
        //
        // If we get this far, then all strings checked exist in the set of valid types
        //
        return true;
    };
    //
    // Public - static attributes
    // Reminder: Its down here because, lets be honest, the list is massive
    //
    static FIELD_ARRAY_OF_STANDARD_HTML_TAGS = [
        "<!DOCTYPE>",
        "<a>",
        "<abbr>",
        "<acronym>",
        "<address>",
        "<applet>",
        "<area>",
        "<article>",
        "<aside>",
        "<audio>",
        "<b>",
        "<base>",
        "<basefont>",
        "<bdi>",
        "<bdo>",
        "<big>",
        "<blockquote>",
        "<body>",
        "<br>",
        "<button>",
        "<canvas>",
        "<caption>",
        "<center>",
        "<cite>",
        "<code>",
        "<col>",
        "<colgroup>",
        "<data>",
        "<datalist>",
        "<dd>",
        "<del>",
        "<details>",
        "<dfn>",
        "<dialog>",
        "<dir>",
        "<div>",
        "<dl>",
        "<dt>",
        "<em>",
        "<embed>",
        "<fieldset>",
        "<figcaption>",
        "<figure>",
        "<font>",
        "<footer>",
        "<form>",
        "<frame>",
        "<frameset>",
        //
        // Reminder: 'h' tags only go up to 6
        //
        "<h1>",
        "<h2>",
        "<h3>",
        "<h4>",
        "<h5>",
        "<h6>",
        "<head>",
        "<header>",
        "<hr>",
        "<html>",
        "<i>",
        "<iframe>",
        "<img>",
        "<input>",
        "<ins>",
        "<kbd>",
        "<label>",
        "<legend>",
        "<li>",
        "<link>",
        "<main>",
        "<map>",
        "<mark>",
        "<meta>",
        "<meter>",
        "<nav>",
        "<noframes>",
        "<noscript>",
        "<object>",
        "<ol>",
        "<optgroup>",
        "<option>",
        "<output>",
        "<p>",
        "<param>",
        "<picture>",
        "<pre>",
        "<progress>",
        "<q>",
        "<rp>",
        "<rt>",
        "<ruby>",
        "<s>",
        "<samp>",
        "<script>",
        "<section>",
        "<select>",
        "<small>",
        "<source>",
        "<span>",
        "<strike>",
        "<strong>",
        "<style>",
        "<sub>",
        "<summary>",
        "<sup>",
        "<svg>",
        "<table>",
        "<tbody>",
        "<td>",
        "<template>",
        "<textarea>",
        "<tfoot>",
        "<th>",
        "<thead>",
        "<time>",
        "<title>",
        "<tr>",
        "<track>",
        "<tt>",
        "<u>",
        "<ul>",
        "<var>",
        "<video>",
        "<wbr>",
    ];
    static FIELD_SET_OF_STANDARD_HTML_TAGS = new Set(
        helperValidatorHtmlTags.FIELD_ARRAY_OF_STANDARD_HTML_TAGS
    );
    //
    // Reminder: This contains all tags, but they all lack '<>'
    //
    static FIELD_ARRAY_OF_STANDARD_HTML_TAGS_NO_ANGLE_BRACKETS =
        helperValidatorHtmlTags.FIELD_ARRAY_OF_STANDARD_HTML_TAGS.map(
            (itemString) => itemString.replace(/\<|\>/g, "")
        );
    static FIELD_SET_OF_STANDARD_HTML_TAGS_NO_ANGLE_BRACKETS = new Set(
        helperValidatorHtmlTags.FIELD_ARRAY_OF_STANDARD_HTML_TAGS_NO_ANGLE_BRACKETS
    );
}
