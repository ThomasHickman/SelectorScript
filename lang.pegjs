/** 
  * SelectorScript Grammar
  * (C) Thomas Hickman 2016
  * Released under the MIT licence, see LICENSE
  *
*/

{
    function createNode(type, ob){
        if(ob === undefined){
            ob = {};
        }

        ob.type = type;
        ob.text = text();
        ob.location = location();
    }

    function createList(head, tail){
        return [head].concat(tail.map(x => x[x.length - 1]));
    }
}

Program = head:Statement tail:(NewLine Statement)* {
    return createNode("Program", {
        code: createList(head, tail)
    })
}

Statement = 
    tabs: Tabs 
    statement:( Macro 
              / SelectorStatement
              / BlockComment
              / Blank) _
    lineComment: LineComment? {
        if(typeof statement !== "object"){
            throw new Error("Statement isn't an object");
        }

        statement.tabs = tabs;
        statement.lineComment = lineComment
        return statement;
    }

// Statements

Macro = id:Id args:(_ Expression)* { 
    return createNode("Macro", {
        id: id,
        args: args.map(x => x[1])
    })
}

SelectorStatement = selector: Selector _ func: Id args:(_ "," _ Expression)* { 
    return createNode("SelectorStatement", {
        selector: selector,
        func: func,
        args: args.map(x => x[x.length - 1])
    })
}

LineComment = _ "//" content:AnythingSameLine { 
    return createNode("LineComment", {
        content: content
    })
}

BlockComment = "/*" content: (!"/*" .)* "*/" { 
    return createNode("BlockComment", {
        content: content
    })
}

Blank = "" { 
    return createNode("Blank");
}

// Expressions
Expression = "(" _ expr: Expression _ ")"{
    return createNode("Bracket", {
        content: expr
    })
} / LiteralList

LiteralList = head:Literal tail: (_ Literal)*{
    return createNode("LiteralList", {
        list: createList(head, tail);
    })
}

// Literals
Literal = Id / String / Selector / Object / Symbol

// Literals

Selector = selector: (IDSelector / ClassSelector / ElementSelector){
    return {
        type: "Selector",
        content: selector
    }
}

String = str: (SingleString / DoubleString) {
    return {
        type: "String",
        content: str, // TODO: fix this
    }
}

SingleString = "'" txt: (SingleStringCharacter*) "'"{
    return txt.join("")
}

DoubleString = '"' txt: (DoubleStringCharacter*) '"'{
    return txt.join("")
}

DoubleStringCharacter = ((!('"' / "\\" ) .) / '\\"' / "\\\\"){
    return text()
}

SingleStringCharacter = ((!("'" / "\\") .) / "\\'" / "\\\\"){
    return text()
}

Object = "{" __ properties: PropertyList __ "}"{
    return {
        type: "Object",
        properties: properties
    }
}

PropertyList = head: Property tail: (__ "," __ Property)*{
    return createList(head, tail)
}

Property = name: (String / Id) __ ":" __ expr:Expression {
    return {
        type: "Property",
        name: "name",
        expr: expr
    }
}

Symbol = [!£%^&*-+=@~#|\¬.?]+ {
    return {
        type: "Symbol",
        text: text()
    }
}

// Selectors

IDSelector = "#" Id{
    return text();
}
ClassSelector = "." Id{
    return text();
}
ElementSelector = "@" id: Id{
    return id.text;
}

Id = [a-zA-Z_] [a-zA-Z_0-9]* {
    return {
        type: "Id",
        text: text()
    }
}

Tabs = _

NewLine = "\n" / "\r\n"

AnythingSameLine = (!("\n") .)*

_ "whitespace"
    = whitespace:[ \t]* {
        return text()
    }

__ "whitespace with a new line"
    = ([ \t] / NewLine)* {
        return text()
    }