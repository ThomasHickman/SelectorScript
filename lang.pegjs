/** 
  * SelectorScript Grammar
  * (C) Thomas Hickman 2016
  * Released under the MIT licence, see LICENSE
  *
*/


Program = head:Statement tail:(NewLine Statement)* {
    var statements = tail.map
    return {
        type: "Program",
        statements: tail.map(x => x[1]),
        newLines: tail.map(x => x[0])
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

LineComment = _ "//" AnythingSameLine { 
    return {
        type: "LineComment"
    }
}

Blank = "" { 
    return {
        type: "Blank"
    }
}

BlockComment = "/*" (!"/*" .)* "*/" { 
    return {
        type: "BlockComment"
    }
}

Expression = Id / String / Selector / Object

// Expressions

Selector = (IDSelector / ClassSelector / ElementSelector){
    return {
        type: "Selector",
        text: text()
    }
}

String = str: (SingleString / DoubleString) {
    return {
        type: "String",
        text: str
    }
}

SingleString = "'" txt: (SingleStringCharacter*) "'"{
    return txt.join("")
}

DoubleString = '"' txt: (DoubleStringCharacter*) '"'{
    return txt.join("")
}

DoubleStringCharacter = (!('"' / "\\" ) .) / '\\"' / "\\\\"
SingleStringCharacter = (!("'" / "\\") .) / "\\'" / "\\\\"

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

// Selectors

IDSelector = "#" Id
ClassSelector = "." Id
ElementSelector = "$" Id

Id = [a-zA-Z_] [a-zA-Z_0-9]* {
    return text()
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