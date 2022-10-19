# Webpack gettext extractor plugin

This Webpack plugin extracts translatable sentences from your code to a gettext catalog file (.pot).

## Options

|Options|Mandatory|Type|Description|
|---|---|---|---|
|callees|Y|Array of strings|Array of functions names which translate sentences in your code|
|headers|N|Object|Optional headers to add to the catalog file|
|output|Y|String|Catalog file path|

## Example Webpack configuration

    const GettextExtractorPlugin = require("gettext-extractor-plugin");

    ...

    {
      ...
      plugins: [
        ...
        new GettextExtractorPlugin({
          callees: ["translate", "t"],
          headers: { Language: "en" },
          output: "src/assets/i18n/messages.pot",
        }),
        ...
      ],
      ...
    }
