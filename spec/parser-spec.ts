/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

import parser = require("../dist/parser");
import fs = require("fs");

describe("parser test", () => {
    it("parses the test file", () => {
        var testFile = fs.readFileSync("spec/ss-example.ss");

        expect(() => parser.parse(testFile.toString())).not.toThrow()
        /*
            console.error(e.name + ": "
                        + "" + e.location.start.line + ":" + e.location.start.column + "-"
                        + "" + e.location.end.line + ":" + e.location.end.column + " - "
                        + e.message)*/
    })

    it("parses the empty file", () => {
        expect(() => parser.parse("")).not.toThrow();
    })
})