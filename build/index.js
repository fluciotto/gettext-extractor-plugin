"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var gettext_extractor_1 = require("gettext-extractor");
var path_1 = require("path");
var schema_utils_1 = require("schema-utils");
var schema = {
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
var GettextExtractorPlugin = /** @class */ (function () {
    function GettextExtractorPlugin(options) {
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
    GettextExtractorPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.done.tap("GettextExtractorPlugin", function (stats) {
            try {
                var projectFiles = __spreadArray([], stats.compilation.fileDependencies, true).filter(function (d) {
                    return !d.includes(path_1.default.join(compiler.options.context, "node_modules"));
                });
                projectFiles.forEach(function (f) {
                    try {
                        _this.parser.parseFile(path_1.default.relative(compiler.options.context, f));
                    }
                    catch (e) {
                        console.log(e);
                    }
                });
                // console.log(this.extractor.getStats())
                _this.extractor.savePotFile(_this.options.output, _this.options.headers);
            }
            catch (e) {
                console.error(e);
            }
        });
    };
    return GettextExtractorPlugin;
}());
module.exports = GettextExtractorPlugin;
