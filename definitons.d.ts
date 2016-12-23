interface Program{
    code: Code[];
    type: "Program"
}

type Code = Statement | Block;

interface Block {
    type: "Block",
    code: Code[];
}

type Statement = Macro | SelectorStatement | BlockComment | Blank;

interface StatementSkeleton{
    tabs: string,
    lineComment?: LineComment;
}

interface LineComment{
    type: "LineComment",
    text: string
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

interface BlockComment extends StatementSkeleton{
    type: "BlockComment",
    content: string
}

interface Blank extends StatementSkeleton{
    type: "Blank"
}

type Literal = Id | IString | Selector | IObject | ISymbol

interface Selector{
    type: "Selector",
    text: string
}

interface IString{
    type: "String";
    text: string;
    code: string;
}

interface IObject{
    type: "Object",
    properties: Property
}

interface Property{
    type: "Property",
    name: string,
    expr: Literal
}

interface Id{
    type: "Id",
    text: string
}

interface ISymbol{
    type: "Symbol",
    text: string
}