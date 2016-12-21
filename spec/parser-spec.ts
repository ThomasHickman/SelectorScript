import { parse } from '../src/parse';
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

import fs = require('fs');

describe("parser test", () => {
    it("parses the test file", () => {
        var testFile = fs.readFileSync("spec/ss-example.ss");

        expect(() => parse(testFile.toString())).not.toThrow()
    })

    it("parses the empty file", () => {
        expect(() => parse("")).not.toThrow();
    })
})