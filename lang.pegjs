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
              / BlockComment) _
    lineComment: LineComment? {
        if(statement == undefined){
            return createNode("Blank");
        }

        statement.tabs = tabs;
        statement.lineComment = lineComment
        return statement;
    }

// Statements

Macro = id:Id args:(_ Literal)* { 
    return createNode("Macro", {
        id: id,
        args: args.map(x => x[1])
    })
}

SelectorStatement = selector: Selector _ funcHead: Id funcTail:(_ Id)* _ args: ExprList{ 
    return createNode("SelectorStatement", {
        selector: selector,
        funcs: createList(funcHead, funcTail),
        args: args.map(x => x[x.length - 1])
    })
}

ExprList = (_ "," _ Expression)*

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

// Expressions
Expression = "(" _ expr: Expression _ ")"{
    return createNode("Bracket", {
        content: expr
    })
} / LiteralList

LiteralList = head:Literal tail: (_ Literal)*{
    return createNode("LiteralList", {
        list: createList(head, tail)
    })
}

// Literals
Literal = Id / String / Selector / Object / Symbol

// Literals

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
// https://www.w3.org/TR/selectors/#context

IDSelector = "#" SelectorId{
    return text();
}
ClassSelector = "." SelectorId{
    return text();
}
ElementSelector = "@" id: (SelectorId / "*"){
    return id.text;
}

PseudoClass = (":"/"::") SelectorId ("(" Selector/Number ")")?

AttributeSelectorOp = "="/"~="/"^="/"$="/"*="/"|="

AttributeSelector = "[" SelectorId (AttributeSelectorOp (SelectorId/String))? "]"

BasicSelector = value:(
    (IDSelector / ClassSelector / ElementSelector)
    PseudoClass? AttributeSelector?){
        return _.compact(_.flatten(value)).join("");
    }

CombinatorOp = " "/">"/"+"/"~"/"," // treating "," as a combinator for simplicity

FullSelector = BasicSelector (CombinatorOp BasicSelector)*{
    return _.compact(_.flatten(value)).join("");
}

// https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
// TODO: at some point I could implement the proper spec
SelectorId = [a-zA-Z_] [a-zA-Z_\-0-9]*{
    return text();
}

Id = [a-zA-Z_] [a-zA-Z_0-9]* {
    return {
        type: "Id",
        text: text()
    }
}

Number = [0-9]*

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