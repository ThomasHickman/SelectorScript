// pegjs definitons

interface SourcePosition{
    offset: number;
    line: number;
    column: number;
}

interface Location{
    start: SourcePosition
    end: SourcePosition
}

// AST definitons

interface Node{
    type: string,
    text: string,
    location: Location
}

interface Program extends Node{
    code: Code[];
    type: "Program"
}

type Code = Statement | Block | Blank;

interface Block {
    type: "Block",
    code: Code[];
}

interface Statement extends Node{
    type: "Statement";
    literals: LiteralList;
    tabs: string;
    lineComment?: LineComment;
}

interface LineComment extends Node{
    type: "LineComment",
    content: string
}

interface Blank extends Node {
    type: "Blank"
    tabs: string;
    lineComment?: LineComment;
}

interface BrackettedExpression extends Node{
    type: "BrackettedExpression"
    content: LiteralList
}

interface LiteralList extends Node{
    type: "LiteralList";
    list: Literal[]
}

type Literal = BrackettedExpression | Id | IString | Selector | IObject | ISymbol | INumber

interface Selector extends Node{
    type: "Selector",
    content: string
}

interface IString extends Node{
    type: "String";
    content: string;
}

interface INumber extends Node{
    type: "Number"
}

interface IObject extends Node{
    type: "Object",
    properties: Property
}

interface Property extends Node{
    type: "Property",
    name: string,
    expr: Literal
}

interface Id extends Node{
    type: "Id"
}

interface ISymbol extends Node{
    type: "Symbol"
}