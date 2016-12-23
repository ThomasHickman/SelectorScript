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

    function addStyle(line: Statement, generatedCode: string){
        var commentRegion = "";
        if(line.lineComment){
            commentRegion = `  //${line.lineComment}`;
        }
        return `${line.tabs}${generatedCode}${commentRegion}`;
    }

    for(var i = 0;i < block.code.length;i++){
        var _line = block.code[i];
        if(_line.type === "Macro"){
            (line => {
                var potentialMacro = _.find(macros, macro => macro.id == line.id.text);
                
                if(potentialMacro === undefined){
                    throw error(`Undefined macro ${line.id.text}`);
                }

                var macroBlock = block.code[i + 1];
                if(macroBlock === undefined || macroBlock.type !== "Block"){
                    throw error("Block not found after macro");
                }

                var macroOutputLines = potentialMacro.map(
                    line.args,
                    generateLiteral,
                    generateBlock(macroBlock)
                ).split("\n");

                code.push([
                    addStyle(line, macroOutputLines[0]),
                    ...macroOutputLines.slice(1)
                ].join("\n"));

                i++;
            })(_line);
        }
        else if(_line.type === "SelectorStatement"){
            code.push(addStyle(_line, generateSelectorStatement(_line)) + ";");
        }
    }

    return code.join("\n");
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