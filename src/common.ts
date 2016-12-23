import * as _ from 'lodash';

export function error(message: string){
    return {
        ssGenerated: true,
        message: message,
        toString: () => message
    };
}