# SelectorScript

A compile to JavaScript language designed for web designers and people who are unfamiliar with JavaScript.

***WARNING: This project is currently in development, any proposed language feature could change and ***

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
### Proposed compiled JavaScript
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