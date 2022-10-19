import { GettextExtractor, JsExtractors } from "gettext-extractor";
import { JSONSchema7 } from "json-schema";
import path from "path";
import { validate } from "schema-utils";
import webpack from "webpack";

const schema: JSONSchema7 = {
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

class GettextExtractorPlugin extends webpack.Plugin {
  options: any;
  extractor: GettextExtractor;
  parser: any;

  constructor(options: any) {
    super();
    validate(schema, options, {
      name: "Gettext Extractor Plugin",
      baseDataPath: "options",
    });
    this.options = options;
    this.extractor = new GettextExtractor();
    this.parser = this.extractor.createJsParser([
      JsExtractors.callExpression(options.callees, {
        arguments: {
          text: 0,
          context: 1,
        },
      }),
    ]);
  }

  apply(compiler: any) {
    compiler.hooks.done.tap("GettextExtractorPlugin", (stats: any) => {
      try {
        const projectFiles = [...stats.compilation.fileDependencies].filter(
          (d) =>
            !d.includes(path.join(compiler.options.context, "node_modules"))
        );
        projectFiles.forEach((f) => {
          try {
            this.parser.parseFile(path.relative(compiler.options.context, f));
          } catch (e) {
            console.log(e);
          }
        });
        // console.log(this.extractor.getStats())
        this.extractor.savePotFile(this.options.output, this.options.headers);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

module.exports = GettextExtractorPlugin;
