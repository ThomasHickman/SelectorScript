/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

import { getBlockedAST } from '../';
import parser = require('../dist/parser');
import fs = require('fs');

var blockTest = 
`one
    two
    three
four`

var errorTest =
`one
    two
            three
`

describe("post parsing test", () => {
    it("blocks the ast", () => {
        var basicAST = <Program>parser.parse(blockTest);
        var newAST = getBlockedAST(basicAST);

        expect(newAST.code.map(x => x.type)).toEqual(["Macro", "Block", "Macro"])
    })

    it("reports bad indentation", () => {
        var basicAST = <Program>parser.parse(errorTest);
        expect(() => getBlockedAST(basicAST)).toThrow(jasmine.objectContaining({
            ssGenerated: true
        }))
    })
})