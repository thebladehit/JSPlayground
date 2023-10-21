document.addEventListener("DOMContentLoaded", function (){
    const realConsole = console.log

    const consoleArea = document.getElementById("consoleArea")

    console.log = function (msg){
        realConsole(msg)
        consoleArea.textContent += "Console: " + msg + "\n"
    }

    const codeMirror = CodeMirror.fromTextArea(document.getElementById("codeArea"), {
        mode: "javascript",
        lineNumbers: true,
        autoIndent: true,
        autoCloseBrackets: true,
        matchBrackets: true,
    })

    const runBtn = document.getElementById("runButton")
    const clearCodeBtn = document.getElementById("clearCodeButton")
    const clearConsoleBtn = document.getElementById("clearConsoleButton")

    runBtn.addEventListener("click", function () {
        const code = codeMirror.getValue()
        try {
            const result = new Function(code)
            result()
        } catch (error) {
            console.log("Error:", error)

            consoleArea.textContent = "Console:\nError: " + error + "\n"
        }
    })

    clearCodeBtn.addEventListener("click", function(){
        codeMirror.setValue("")
    })

    clearConsoleBtn.addEventListener("click", function (){
        consoleArea.textContent= ""
    })

})
