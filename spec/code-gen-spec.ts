/// <reference path="../node_modules/@types/jasmine/index.d.ts" />
import compile from "../src/compile";

var blockTest = 
`on #div click
    @element show
    #div addClass "nsss"`;

describe("code generation", () => {
    it("compiles the basic program", () => {
        var compiled = compile(blockTest)
        expect(compiled).toEqual(jasmine.objectContaining({
            success: true
        }))
    })
})