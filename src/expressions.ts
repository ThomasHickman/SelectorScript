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
    right: Expression,
    type: "InfixExpression"
} | {
    operator: Operator
    right: Expression,
    type: "PrefixExpression"
}

export function reduceLiteralsToExpression(literals: Literal[]){
    var output = <Expression[]>[];
    var operatorStack = <Operator[]>[];

    function consumeOperator(){
        var [left, right] = output.splice(-2);
        var lastOperator = operatorStack.pop();
        if(lastOperator === undefined){
            throw error("Operator stack is empty!");
        }

        output.push({
            type: "InfixExpression",
            left: left,
            operator: lastOperator,
            right: right
        })
    }

    var lastLiteralWasConst = false;

    for(var i = 0;i<literals.length;i++){
        let literal = literals[i];

        var currOperator = getOperator(literal);

        if(currOperator === undefined){
            if(lastLiteralWasConst){
                // end of expression
                break;
            }

            lastLiteralWasConst = true;
            output.push(literal);
        }
        else{
            if(lastLiteralWasConst){
                // Use prefix
                var rightLiteral = literals[i+1];

                if(rightLiteral === undefined){
                    throw error("Unvalid trailing operator", literal.location);
                }

                output.push({
                    type: "PrefixExpression",
                    operator: currOperator,
                    right: rightLiteral
                })
                
                i++;
            }
            else{
                // Use infix
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

            lastLiteralWasConst = false;
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