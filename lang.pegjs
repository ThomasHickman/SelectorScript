Program = Code {}

Code = Statement (NewLine Statement)*

Statement = Tabs (Macro / SelectorStatement / LineComment / BlockComment / Blank)

// Statements

Macro = Id (_ (Expression))*
SelectorStatement = Selector _ Id _ Expression?
LineComment = _ "//" AnythingSameLine
Blank = ""
BlockComment = "/*" (!"/*" .)* "*/"

Expression = Id / String / Selector / Object

// Expressions

Selector = IDSelector / ClassSelector / ElementSelector
String = "'" SingleStringCharacter* "'" / '"' DoubleStringCharacter* '"'

DoubleStringCharacter = (!('"' / "\\" ) .) / '\\"' / "\\\\"

SingleStringCharacter = (!("'" / "\\") .) / "\\'" / "\\\\"

Object = "{" __ PropertyList __ "}"

PropertyList = Property (__ "," __ Property)*

Property = (String / Id) __ ":" __ Expression

// Selectors

IDSelector = "#" Id
ClassSelector = "." Id
ElementSelector = "$" Id

Id = [a-zA-Z_] [a-zA-Z_0-9]*

Tabs = _

NewLine = [\n]

AnythingSameLine = (!("\n") .)*

_ "whitespace"
  = [ \t]*

__ "whitespace with a new line"
  = ([ \t] / NewLine)*