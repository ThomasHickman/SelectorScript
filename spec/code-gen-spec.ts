import * as console from 'console';
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

import { compile } from '../';
import { compileProgram } from '../';
import { getBlockedAST } from '../';
import parser = require('../dist/parser');
import fs = require('fs');

var blockTest = 
`on #div click
    @element show
    #div addClass "nsss"`;

describe("code generation", () => {
    it("generates basic programs", () => {
        var AST = getBlockedAST(<Program>parser.parse(blockTest));
        
        var newCode = compileProgram(AST);

        expect(newCode).not.toBeUndefined();
    })

    it("compiles the basic program", () => {
        var compiled = compile(blockTest)
        expect(compiled).toEqual(jasmine.objectContaining({
            success: true
        }))

        console.log(compiled);
    })
})