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
    literals: Expression _
    lineComment: LineComment? {
        if(literals == undefined){
            return createNode("Blank", {
                tabs: tabs,
                lineComment: lineComment
            });
        }
        return createNode("Statement", {
            tabs: tabs,
            lineComment: lineComment,
            literals: literals
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

// Expressions
Expression = "(" _ selector: FullSelector _ ")"{
    return selector
} / "(" _ expr: Expression _ ")"{
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
Literal = BasicSelector / Id / String / Number / Object / Symbol

// Literals

// modified from https://github.com/pegjs/pegjs/blob/205c55d3099ed8247a274a6aec7914356224bae3/examples/javascript.pegjs

Number "number"
  = literal:HexIntegerLiteral
  / literal:DecimalLiteral{
      return text();
  }

DecimalLiteral
  = DecimalIntegerLiteral "." DecimalDigit* ExponentPart?
  / "." DecimalDigit+ ExponentPart?
  / DecimalIntegerLiteral ExponentPart?

DecimalIntegerLiteral
  = "0"
  / NonZeroDigit DecimalDigit*

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

ExponentPart
  = ExponentIndicator SignedInteger

ExponentIndicator
  = "e"i

SignedInteger
  = [+-]? DecimalDigit+

HexIntegerLiteral
  = "0x"i digits:$HexDigit+

HexDigit
  = [0-9a-f]i

// end copied region

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

PseudoClass = (":"/"::") SelectorId ("(" FullSelector/Number ")")?

AttributeSelectorOp = "="/"~="/"^="/"$="/"*="/"|="

AttributeSelector = "[" SelectorId (AttributeSelectorOp (SelectorId/String))? "]"

BasicSelector = value:(
    (IDSelector / ClassSelector / ElementSelector)
    PseudoClass? AttributeSelector?){
        return createNode("Selector", {
            content: _.compact(_.flatten(value)).join("")
        })
    }

CombinatorOp = " "/">"/"+"/"~"/"," // treating "," as a combinator for simplicity

FullSelector = BasicSelector (CombinatorOp BasicSelector)*{
    return createNode("Selector", {
        content: _.compact(_.flatten(value)).join("")
    })
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