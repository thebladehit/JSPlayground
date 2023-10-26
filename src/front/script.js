document.addEventListener("DOMContentLoaded", () => {
    const realConsole = console.log

    const consoleArea = document.getElementById("consoleArea")

    console.log = (msg) => {
        realConsole(msg)
        consoleArea.textContent += "Console: " + msg + "\n"
    }

    const codeMirror = CodeMirror.fromTextArea(document.getElementById("codeArea"), {
        mode: "javascript",
        lineNumbers: true,
        autoIndent: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        theme: "default"
    })

    const themeSelect = document.getElementById("themeSelect")
    const autoCloseBrackets = document.getElementById("autoCloseBrackets")
    const autoComplete = document.getElementById("autoComplete")
    const showLineNumbers = document.getElementById("showLineNumbers")

    themeSelect.addEventListener("change", () => {
        codeMirror.setOption("theme", themeSelect.value)
    })

    autoCloseBrackets.addEventListener("change", () => {
        codeMirror.setOption("autoCloseBrackets", autoCloseBrackets.checked)
    })

    showLineNumbers.addEventListener("change", () => {
        codeMirror.setOption("lineNumbers", showLineNumbers.checked)
    })

    const toggleAutoComplete = () => codeMirror[autoComplete.checked ? 'on' : 'off']("inputRead", autoCompleteHandler);
    const autoCompleteHandler = (instance) => CodeMirror.commands.autocomplete(instance, null, {completeSingle: false});

    autoComplete.addEventListener("change", toggleAutoComplete);
    toggleAutoComplete();

    const runBtn = document.getElementById("runButton")
    const clearCodeBtn = document.getElementById("clearCodeButton")
    const clearConsoleBtn = document.getElementById("clearConsoleButton")

    runBtn.addEventListener("click", () => {
        const code = codeMirror.getValue()
        try {
            const result = new Function(code)
            result()
        } catch (error) {
            console.log("Error:", error)

            consoleArea.textContent += "Console:\nError: " + error + "\n"
        }
    })

    clearCodeBtn.addEventListener("click", () => {
        codeMirror.setValue("")
    })

    clearConsoleBtn.addEventListener("click", () => {
        consoleArea.textContent= ""
    })

    const orientationSelect = document.getElementById('orientationSelect');
    const layoutContainer = document.querySelector('.layout-container');
    const buttonContainer = document.querySelector('.button-container')

    orientationSelect.addEventListener('change', (e) => {
        const selectedOrientation = e.target.value;

        ['vertical', 'horizontal', 'oneandhalf'].forEach((orientation) => {
            const isCurrentOrientation = orientation === selectedOrientation;

            layoutContainer.classList.toggle(orientation, isCurrentOrientation);
            buttonContainer.classList.toggle(orientation, isCurrentOrientation);
        });
    });


})
