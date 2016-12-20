Program = Statement*

Statement = EventListener / IfStatement / SelectorRule

EventListener = BasicEventListener / ComplexEventListener

BasicEventListener = "on" _ id

ComplexEventListener = "on" Selector id



Selector = IDSelector / ClassSelector / ElementSelector

IDSelector = "#" id

ClassSelector = "." id

ElementSelector = "$" id



IfStatement = "7"



SelectorRule = "8"


id = [a-zA-Z_] [a-zA-Z_0-9]*

_ "whitespace"
  = [ \t]*

__ "whitespace_newline"
  = [ \t\n\r]*