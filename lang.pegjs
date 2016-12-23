/** 
  * SelectorScript Grammar
  * (C) Thomas Hickman 2016
  * Released under the MIT licence, see LICENSE
  *
*/


Program = head:Statement tail:(NewLine Statement)* {
    return {
        type: "Program",
        code: [head].concat(tail.map(x => x[1]))
    }
}

Statement = 
    tabs: Tabs 
    statement:( Macro 
              / SelectorStatement
              / BlockComment
              / Blank) _
    lineComment: LineComment? {
        if(typeof statement !== "object"){
            return null;
        }
        statement.tabs = tabs;
        statement.lineComment = lineComment
        return statement
    }

// Statements

Macro = id:Id args:(_ Expression)* { 
    return {
        type: "Macro",
        id: id,
        args: args.map(x => x[1])
    }
}

SelectorStatement = selector: Selector _ func: Id args:(_ Expression)* { 
    return {
        type: "SelectorStatement",
        selector: selector,
        func: func,
        args: args.map(x => x[1])
    }
}

LineComment = _ "//" text:AnythingSameLine { 
    return {
        type: "LineComment",
        text: text
    }
}

BlockComment = "/*" content: (!"/*" .)* "*/" { 
    return {
        type: "BlockComment",
        content: string
    }
}

Blank = "" { 
    return {
        type: "Blank"
    }
}
// Expressions
Expression = "(" _ Expression2 _ ")" / Expression2

Expression2 = Literal+

// Literals
Literal = Id / String / Selector / Object / Symbol

// Literals

Selector = selector: (IDSelector / ClassSelector / ElementSelector){
    return {
        type: "Selector",
        text: selector
    }
}

String = str: (SingleString / DoubleString) {
    return {
        type: "String",
        text: str, // TODO: fix this
        code: text()
    }
}

SingleString = "'" txt: (SingleStringCharacter*) "'"{
    return txt.join("")
}

DoubleString = '"' txt: (DoubleStringCharacter*) '"'{
    return txt.join("")
}

DoubleStringCharacter = (!('"' / "\\" ) .) / '\\"' / "\\\\"{
    return text()
}

SingleStringCharacter = (!("'" / "\\") .) / "\\'" / "\\\\"{
    return text()
}

Object = "{" __ properties: PropertyList __ "}"{
    return {
        type: "Object",
        properties: properties
    }
}

PropertyList = head: Property tail: (__ "," __ Property)*{
    return [head].concat(tail.map(x => x[3]))
}

Property = name: (String / Id) __ ":" __ expr:Expression {
    return {
        type: "Property",
        name: "name",
        expr: expr
    }
}

Symbol = [!£%^&*-+=@~#|\¬,.?]+ {
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