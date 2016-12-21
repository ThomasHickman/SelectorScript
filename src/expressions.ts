import { error } from './common';
import * as _ from 'lodash';

export interface Expression{
    func: (left: any, right: any) => any, // define using arrow functions
    valid?: (left: Expression, right: Expression) => boolean,
    name: string,
    priority: number,
    leftAccoc: boolean
}

var expressions = <Expression[]>[{
        name: "says",
        priority: 1,
        leftAccoc: true,
        func: (left: any, right: any) => {
            return left.val() === right
        }
    }
]

var funcParse = /return (.*?)(?:\n|;)/;

export default expressions;