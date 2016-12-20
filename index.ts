var parser = <Parser>require("./dist/parser");
import * as _ from "lodash";

interface Parser{
    parse(input: string): Program;

    SyntaxError: {
        message: string;
        expected: string;
        found: string;
        location: any;
        name: string;
    }
}

function error(message: string){
    return new Error(message);
}

export function getBlockedAST(program: Program){
    var tab: string[] | null = null;// as array for easy processing
    var i = 0;

    return <Program>{
        ...getBlocks(0),
        newLines: program.newLines,
        type: "Program"
    };

    function getBlocks(tabLevel: number){
        var newBlock: Block = {
            type: "Block",
            code: []
        }

        for(;i < program.code.length;i++){
            var line = <Statement>program.code[i];

            if(line.tabs === "" && tab === null){
                newBlock.code.push(line);
            }
            else{
                if(tab === null){
                    tab = line.tabs.split("");
                }

                var tabArray = _.chunk(line.tabs, tab.length);

                if(line.type === "Blank"){
                    newBlock.code.push(line);
                }
                else if(!tabArray.every(x => _.isEqual(tab, x))){
                    throw error("Parse Error: Uneven tabbing");
                }
                else{
                    if(tabArray.length === tabLevel){
                        newBlock.code.push(line);
                    }
                    else if(tabArray.length === tabLevel + 1){
                        newBlock.code.push(getBlocks(tabLevel + 1))
                    }
                    else if(tabArray.length < tabLevel){
                        i--;
                        return newBlock;
                    }
                    else{
                        throw error(`Parse Error: Cannot have a gap of more than 1 between succesive indentations\n` +
                            `Found a gap of ${
                                Math.abs(tabArray.length - tabLevel)
                            }`)
                    }
                }
            }
        }

        return newBlock;
    }
}



interface Macro{
    id: string,
    sig: Type[][],
    map(args: Expression[], compile: (expr: Expression) => string, innerCode: Block): string;
}

var macros = <Macro[]>[{
    id: "on",
    map: (args, compile, innerCode) => {
        if(_.last(args).type !== "Id"){
            throw error("Last element of the on macro must be an identifier");
        }

        var funcName = args.slice(0, -1).map(compile).join(".");

        return `$(funcName)(function() {\n$(compile(innerCode))\n})`
    }
},{
    id: "if",
    map: (args, compile, innerCode) => {
        if(args.length !== 1){
            throw error("If is being passed more than one expression");
        }
        var predicate = compile(args[0]);

        return `if($(predicate)){\n$(compile(innerCode))\n}`
    }
}];

export function compileProgram(program: Program){
    return compileBlock({
        code: program.code,
        type: "Block"
    });
}

function compileBlock(block: Block){
    for(var i = 0;i < block.code.length;i++){
        var _line = block[i];
        if(_line.type === "Macro"){
            return (line => {
                var potentialMacro = _.find(macros, macro => macro.id == line.id.text);
                
                if(potentialMacro === undefined){
                    throw error("Undefined macro ${macro.id}");
                }

                var macroBlock = block.code[i + 1];
                if(macroBlock === undefined || macroBlock.type !== "Block"){
                    throw error("Block not found after macro");
                }

                return potentialMacro.map(
                    line.args,
                    compileExpression,
                    macroBlock
                )
            })(_line);
        }
    }
}

export function compileExpression(expression: Expression): string{
    return "";
}