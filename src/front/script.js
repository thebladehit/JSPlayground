document.addEventListener("DOMContentLoaded", function (){
    const realConsole = console.log

    const codeArea = document.getElementById("codeArea")
    const consoleArea = document.getElementById("consoleArea")

    console.log = function (msg){
        realConsole(msg)
        consoleArea.textContent += "Console: " + msg + "\n"
    }

    const runBtn = document.getElementById("runButton")
    const clearCodeBtn = document.getElementById("clearCodeButton")
    const clearConsoleBtn = document.getElementById("clearConsoleButton")

    runBtn.addEventListener("click", function () {
        const code = codeArea.value.toString()

        try {
            const result = new Function(code);
            result()
        } catch (error) {
            console.log("Error:", error);

            consoleArea.textContent = "Console:\nError: " + error;
        }
    })

    clearCodeBtn.addEventListener("click", function(){
       codeArea.value= ""
    })

    clearConsoleBtn.addEventListener("click", function (){
        consoleArea.textContent= ""
    })
})