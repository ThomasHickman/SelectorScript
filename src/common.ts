import * as _ from 'lodash';

export function error(message: string, location?: Location){
    if(location !== undefined){
        message += `\nLocation: ${JSON.stringify(location)}`
    }

    return {
        ssGenerated: true,
        message: message,
        toString: () => message
    };
}