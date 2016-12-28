import { hostname } from 'os';
import { MacroDef } from './macros';
import macros from './macros';
import { error } from './common';
import * as _ from 'lodash';

export default function generateProgram(program: Program){
    var innerBlockLines = generateBlock({
        code: program.code,
        type: "Block"
    }).split("\n");

    var newInnerBlock = innerBlockLines.map(x => "    " + x).join("\n");

    return `$(function(){\n${newInnerBlock}\n})`;
}

function generateBlock(block: Block){
    var code: string[] = [];

    function addStyle(line: Statement | Blank, generatedCode: string){
        var commentRegion = "";
        if(line.lineComment){
            commentRegion = `  //${line.lineComment}`;
        }
        return `${line.tabs}${generatedCode}${commentRegion}`;
    }

    for(var i = 0;i < block.code.length;i++){
        var line = block.code[i];
        var nextLine = <Code | undefined>block.code[i + 1];
        var statementBlock: Block | undefined = undefined;

        if(nextLine !== undefined && nextLine.type === "Block"){
            i++;
            statementBlock = nextLine;
        }

        if(line.type === "Blank"){
            code.push(addStyle(line, generateBlankLine(line, statementBlock)));
        }
        else if(line.type === "Statement"){
            code.push(addStyle(line, generateStatement(line, statementBlock)))
        }
        else{
            throw error("Internal Error: Got a block before a line")
        }
    }

    return code.join("\n");
}

function generateBlankLine(stm: Blank, block?: Block){
    if(block !== undefined){
        throw error("Cannot have a block after a line with no effect", stm.location);
    }

    return "";
}

function generateStatement(stm: Statement, block?: Block){
    if(stm.literals[0].type !== "Id"){
        // Parse as expression statement
        return generateExpressionStatement(stm, block);
    }
    else{
        var potentialMacro = _.find(macros, macro => macro.id == stm.literals[0]);
        if(potentialMacro === undefined){
            return generateExpressionStatement(stm, block);
        }
        return generateMacroStatement(potentialMacro, stm, block);
    }
}

function generateMacroStatement(macro: MacroDef, stm: Statement, block?: Block){
    if(block === undefined){
        throw error("Block not found after macro", stm.location);
    }

    macro.map(
        stm.literals.list,
        generateLiteral,
        generateBlock(block)
    )

    // Do something else
}

function generateExpressionStatement(stm: Statement, block?: Block){
    // Do parsing
}

function generateSelectorStatement(stm: SelectorStatement){
    var jsSelector = generateSelector(stm.selector);
    var args = stm.args.map(generateLiteral).join(", ");

    return `${jsSelector}.${stm.func.text}(${args})`
}

function generateLiteral(expr: Literal): string{
    if(expr.type === "String"){
        return `${expr.text}`// TODO: fix this
    }
    else if(expr.type === "Id"){
        return expr.text;
    }
    else if(expr.type === "Selector"){
        return generateSelector(expr);
    }
    else if(expr.type === "Object"){
        return generateObject(expr);
    }
    else{
        throw error("Unknown literal");
    }
}

function generateSelector(selector: Selector): string{
    return `$("${selector.text}")`;
}

function generateObject(object: IObject): string{
    throw error("Not implemented");
}