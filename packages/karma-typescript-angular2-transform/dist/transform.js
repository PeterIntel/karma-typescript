"use strict";
var fs = require("fs");
var log4js = require("log4js");
var path = require("path");
var ts = require("typescript");
var config = "./log4js.json";
if (fs.existsSync(config)) {
    log4js.configure(config);
}
var log = log4js.getLogger("angular2-transform.karma-typescript");
var fixWindowsPath = function (value) {
    return value.replace(/\\/g, "/");
};
var transform = function (context, callback) {
    if (ts.version !== context.tsVersion) {
        return callback(new Error("Typescript version of karma-typescript (" +
            context.tsVersion + ") does not match karma-typescript-angular2-transform Typescript version (" +
            ts.version + ")"), false);
    }
    var dirty = false;
    var MagicString = require("magic-string");
    var magic = new MagicString(context.source);
    var rewriteUrl = function (node) {
        var start = node.getStart() + 1;
        var end = start + node.text.length;
        var templateDir = path.dirname(context.filename);
        var relativeTemplateDir = path.relative(context.basePath, templateDir);
        var styleUrl = path.join(context.urlRoot, "base", relativeTemplateDir, node.text);
        log.debug("Rewriting %s to %s in %s", node.text, styleUrl, context.filename);
        magic.overwrite(start, end, fixWindowsPath(styleUrl));
        dirty = true;
    };
    var visitNode = function (node) {
        switch (node.kind) {
            case ts.SyntaxKind.ObjectLiteralExpression:
                var expression = node;
                if (expression.properties) {
                    expression.properties.forEach(function (p) {
                        if (p.name && p.kind === ts.SyntaxKind.PropertyAssignment) {
                            var property = p;
                            var identifier = property.name;
                            if (identifier.text === "templateUrl" &&
                                property.initializer.kind === ts.SyntaxKind.StringLiteral) {
                                rewriteUrl(property.initializer);
                            }
                            if (identifier.text === "styleUrls" &&
                                property.initializer.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                                var initializer = property.initializer;
                                initializer.elements.forEach(function (element) {
                                    if (element.kind === ts.SyntaxKind.StringLiteral) {
                                        rewriteUrl(element);
                                    }
                                });
                            }
                        }
                    });
                }
            default:
        }
        ts.forEachChild(node, visitNode);
    };
    visitNode(context.ast);
    if (dirty) {
        context.source = magic.toString();
    }
    callback(undefined, dirty);
};
module.exports = transform;