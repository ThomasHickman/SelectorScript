/// <reference path="../node_modules/@types/jasmine/index.d.ts" />
import { reduceLiteralsToExpression } from '../src/expressions';
import * as expr from "../src/expressions";

var testLiterals = <Literal[]>[{
    type: "Selector",
    text: "#input"
},{
    type: "Id",
    text: "shows"
},{
    type: "String",
    content: "hi"
}]

describe("expressions", () => {
    it("parses an expression", () => {
        var expression = reduceLiteralsToExpression(testLiterals);
        expect(expression).toEqual({
            left: testLiterals[0],
            operator: jasmine.objectContaining({
                name: "shows"
            }),
            right: testLiterals[2]
        })
    })
})