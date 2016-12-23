import compile from "./src/compile";

export = compile;

declare var window;

if(typeof window !== "undefined"){
    window["compile"] = compile;
}