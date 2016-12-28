#Specification

## Programs

## Macros

```
Macro BracketedLiterals[]

separator of BracketedLiterals is " "

User defined macros (if, else, on, loop)
```

## Statements

```
Expression Id Expression[]
    Id2 ExpressionA[]
    ...
 => (Exp).Id(Exp1, ...).Id2(ExpA1 ...)
```

separator of Expression is ","

Grammar definition gets expressions out of brackets and literals from the definiton

Code separates this into parts

## Expressions

1. Bracketed
2. Literals
4. Expression Operator Expression
3. UnaryOperator Expression

Grammar definiton defines literals and brackets

## Literals

1. Identifiers - for js identifiers, custom operators and macros
3. SelectorAtoms
4. Bracked all Selectors
4. Symbols - for custom operators 
5. JavaScript literals (Strings, Numbers, Objects, Arrays, Functions?)

## Selectors
**Hard to deal with!**
### Selector Literals
* #id
* .className
* @elementName

### SelectorAtoms
* Selector : selector syntax
* Selector [...] syntax

### Full selectors
Can only be inputted in brackets
* selector, selector
* selector selector

Ids in selectors can have dashes in them


