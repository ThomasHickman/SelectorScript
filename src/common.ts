export function error(message: string){
    return {
        ssGenerated: true,
        message: message
    };
}