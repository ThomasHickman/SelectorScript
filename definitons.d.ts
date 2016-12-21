interface Program{
    code: Code[];
    type: "Program",
    newLines: string[]
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
    args: Expression[]
}

interface SelectorStatement extends StatementSkeleton{
    type: "SelectorStatement",
    selector: Selector,
    func: Id,
    args: Expression[]
}

interface BlockComment extends StatementSkeleton{
    type: "BlockComment",
    content: string
}

interface Blank extends StatementSkeleton{
    type: "Blank"
}

type Type = "Id" | "String" | "Selector" | "Object";

type Expression = Id | IString | Selector | IObject

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
    expr: Expression
}

interface Id{
    type: "Id",
    text: string
}