import { error } from './common';
import * as _ from 'lodash';

export interface ExpressionFunc{
    type: [Type, Type],
    func: (left: any, right: any) => any
}

export interface Operator{
    funcs: ExpressionFunc[],
    valid?: (left: Operator, right: Operator) => boolean,
    name: string,
    priority: number,
    leftAccoc: boolean
}

type Type = "String" | "Selector" | "Any";

var operators: Operator[] = [{
        name: "shows",
        priority: 1,
        leftAccoc: true,
        funcs: [{
            type: ["Selector", "Any"],
            func: (left: any, right: any) => left.val() === right
        }]
    }
]

var operatorTable = _.mapValues(_.groupBy(operators, "name"), arr => {
    if(arr.length !== 1){
        throw error("Internal Error: Operator names are not disjoint")
    }
    return arr[0]
});

var expressionsByPriority = _.sortBy(operators, "priority");

var funcParse = /return (.*?)(?:\n|;)/;

function getOperator(literal: Literal): Operator | undefined{
    if(literal.type === "Id" || literal.type === "Symbol"){
        return operatorTable[literal.text]
    }

    return;
}

export type Expression = Literal | {
    left: Expression,
    operator: Operator,
    right: Expression
}

export function parseExpression(literals: Literal[]){
    var output = <Expression[]>[];
    var operatorStack = <Operator[]>[];

    function consumeOperator(){
        var [left, right] = output.splice(-2);
        var lastOperator = operatorStack.pop();
        if(lastOperator === undefined){
            throw error("Operator stack is empty!");
        }

        output.push({
            left: left,
            operator: lastOperator,
            right: right
        })
    }

    for(var literal of literals){
        var currOperator = getOperator(literal);

        if(currOperator === undefined){
            output.push(literal);
        }
        else{
            var topOperator = _.last(operatorStack);

            while(operatorStack.length !== 0 &&
                ((topOperator.leftAccoc && topOperator.priority <= currOperator.priority)
                ||(!topOperator.leftAccoc && topOperator.priority <= currOperator.priority))
            ){
                // consume operator
                consumeOperator();

                topOperator = _.last(operatorStack);
            }

            operatorStack.push(currOperator);
        }
    }

    while(operatorStack.length !== 0){
        consumeOperator();
    }

    if(output.length !== 1){
        throw error("Output is not 1");
    }

    return output[0];
}

export default operators;