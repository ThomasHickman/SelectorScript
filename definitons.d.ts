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
    type: "statement",
    id: string,
    args: Expression[]
}

interface SelectorStatement extends StatementSkeleton{
    type: "SelectorStatement",
    selector: Selector,
    func: string,
    args: Expression
}

interface BlockComment extends StatementSkeleton{
    type: "BlockComment",
    content: string
}

interface Blank extends StatementSkeleton{
    type: "Blank"
}

type Expression = Id | String | Selector | IObject

interface Selector{
    type: "Selector",
    text: string
}

interface String{
    type: "String",
    text: string
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

type Id = string;