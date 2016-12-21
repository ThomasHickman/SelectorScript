import compile from "./src/compile";

export = compile;

if(typeof window !== "undefined"){
    window["compile"] = compile;
}