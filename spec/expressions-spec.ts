/// <reference path="../node_modules/@types/jasmine/index.d.ts" />
import { parseExpression } from '../src/expressions';
import * as expr from "../src/expressions";

var testLiterals:Literal[] = [{
    type: "Selector",
    text: "#input"
},{
    type: "Id",
    text: "shows"
},{
    type: "String",
    text: "hi",
    code: "'hi'"
}]

describe("expressions", () => {
    it("parses an expression", () => {
        var expression = parseExpression(testLiterals);
        expect(expression).toEqual({
            left: testLiterals[0],
            operator: jasmine.objectContaining({
                name: "shows"
            }),
            right: testLiterals[2]
        })
    })
})