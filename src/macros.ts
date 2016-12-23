import { error } from './common';
import * as _ from 'lodash';

export interface MacroDef{
    id: string,
    map(args: Literal[], compile: (expr: Literal) => string, innerCode: string): string;
}

var macros:MacroDef[] = [{
        id: "on",
        map: (args, compile, innerCode) => {
            if(_.last(args).type !== "Id"){
                throw error("Last element of the on macro must be an identifier");
            }

            var funcName = args.slice(0).map(compile).join(".");

            return `${funcName}(function() {\n${innerCode}\n});`
    }
    },{
        id: "if",
        map: (args, compile, innerCode) => {
            if(args.length !== 1){
                throw error("If is being passed more than one expression");
            }
            var predicate = compile(args[0]);

            return `if(${predicate}){\n${innerCode}\n}`
        }
}];

export default macros;