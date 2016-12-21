import { compileProgram } from './generate';
import { parse } from './parse';

export default function compile(ssCode: string) {
    try{
        var AST = parse(ssCode);
        var output = compileProgram(AST);
    }
    catch(e){
        if(!e.ssGenerated){
            throw e;
        }

        return {
            success: false,
            error: e
        }
    }

    return {
        success: true,
        output: output
    }
}