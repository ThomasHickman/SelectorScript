# SelectorScript

A compile to JavaScript language designed for web designers and beginners to JavaScript.

***WARNING: This project is currently in development, the language specification and code is unstable***

## Example

### SelectorScript
```
on #submitButton click
    if #name shows ""
        #nameError removeClass "hide"
        #name focus
    else
        #nameError removeClass "hide"
.option draggable {snap: ".dest"}
```
### Compiled JavaScript with `selectorOutput: jQuery`
``` javascript
$(function(){
    $("#submitButton").click(function() {
        if($("name").val() === ""){
            $("#nameError").removeClass("hide");
            $("#name").focus();
        }
        else{
            $("#nameError").removeClass("hide");
        }
    });
    $(".option").draggable({snap: ".dest"})
})
```


## TODO

### V0.1.0
- [ ] Add expression parsing
- [ ] Add expressions (this will make if useful)
- [ ] Add build scripts
- [ ] Make errors better and add non fatal errors
- [ ] Add atom and vscode extentions
- [ ] Test a lot
- [ ] Add documentation

### Future versions
- [ ] Add parsing of unary expressions (this makes selectors not be special)
- [ ] Add loops (as a macro)
- [ ] Add functions (as a macro)
- [ ] Add object literals
- [ ] Add array literals
- [ ] Cutomise literals?