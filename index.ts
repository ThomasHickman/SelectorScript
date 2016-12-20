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

function getBlockedAST(program: Program, currentTabLevel = 0){
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

            if(line.tabs === ""){
                newBlock.code.push(line);
            }
            else{
                if(tab === null){
                    tab = line.tabs.split("");
                }

                var tabArray = _.chunk(line.tabs, tab.length);

                if(!tabArray.every(x => _.isEqual(tab, x))){
                    throw error("Parse Error: Uneven tabbing");
                }
                else{
                    if(tabArray.length === tabLevel || line.type === "Blank"){
                        newBlock.code.push(line);
                    }
                    else if(tabArray.length === tabLevel + 1){
                        newBlock.code.push(getBlocks(tabLevel + 1))
                    }
                    else if(tabArray.length === tabLevel - 1){
                        return newBlock;
                    }
                    else{
                        throw error(`Parse Error: Cannot have a gap of more than ${
                            Math.abs(tabArray.length - tabLevel)
                        } between succesive indentations`)
                    }
                }
            }
        }

        return newBlock;
    }
}