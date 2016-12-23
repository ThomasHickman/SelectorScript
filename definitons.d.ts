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
    text: string,
    location: Location
}

interface Program extends Node{
    code: Code[];
    type: "Program"
}

type Code = Statement | Block;

interface Block {
    type: "Block",
    code: Code[];
}

type Statement = Macro | SelectorStatement | BlockComment | Blank;

interface StatementSkeleton extends Node{
    tabs: string,
    lineComment?: LineComment;
}

interface Macro extends StatementSkeleton{
    type: "Macro",
    id: Id,
    args: Literal[]
}

interface SelectorStatement extends StatementSkeleton{
    type: "SelectorStatement",
    selector: Selector,
    func: Id,
    args: Literal[]
}

interface LineComment extends Node{
    type: "LineComment",
    content: string
}

interface BlockComment extends StatementSkeleton{
    type: "BlockComment",
    content: string
}

interface Blank extends StatementSkeleton{
    type: "Blank"
}

type Expression = Bracket | LiteralList;

interface Bracket extends Node{
    content: Expression
}

interface LiteralList extends Node{
    type: "LiteralList";
    list: Literal[]
}

type Literal = Id | IString | Selector | IObject | ISymbol

interface Selector extends Node{
    type: "Selector",
    content: string
}

interface IString extends Node{
    type: "String";
    content: string;
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