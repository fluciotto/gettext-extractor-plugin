"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gettext_extractor_1 = require("gettext-extractor");
const path_1 = require("path");
const schema_utils_1 = require("schema-utils");
const schema = {
    type: "object",
    properties: {
        callees: {
            type: "array",
            items: {
                type: "string",
            },
            minItems: 1,
        },
        headers: {
            type: "object",
        },
        output: {
            type: "string",
        },
    },
    required: ["callees", "output"],
    additionalProperties: false,
};
class GettextExtractorPlugin {
    constructor(options) {
        (0, schema_utils_1.validate)(schema, options, {
            name: "Gettext Extractor Plugin",
            baseDataPath: "options",
        });
        this.options = options;
        this.extractor = new gettext_extractor_1.GettextExtractor();
        this.parser = this.extractor.createJsParser([
            gettext_extractor_1.JsExtractors.callExpression(options.callees, {
                arguments: {
                    text: 0,
                    context: 1,
                },
            }),
        ]);
    }
    apply(compiler) {
        compiler.hooks.done.tap("GettextExtractorPlugin", (stats) => {
            try {
                const projectFiles = [...stats.compilation.fileDependencies].filter((d) => !d.includes((0, path_1.join)(compiler.options.context, "node_modules")));
                projectFiles.forEach((f) => {
                    try {
                        this.parser.parseFile((0, path_1.relative)(compiler.options.context, f));
                    }
                    catch (e) {
                        console.log(e);
                    }
                });
                // console.log(this.extractor.getStats())
                this.extractor.savePotFile(this.options.output, this.options.headers);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
module.exports = GettextExtractorPlugin;
