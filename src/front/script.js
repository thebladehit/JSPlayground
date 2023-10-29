document.addEventListener('DOMContentLoaded', () => {
    const pageTheme = localStorage.getItem('pageTheme') ?? 'os-theme';
    const savedCode = localStorage.getItem('code');
    const savedTheme = localStorage.getItem('editorTheme') || 'juejin';
    const savedOrientation = localStorage.getItem('orientation') || 'vertical';
    const lineNumbersSetting = localStorage.getItem('lineNumbers');
    const autoCompleteSetting = localStorage.getItem('autoComplete');
    const autoCloseBracketsSetting = localStorage.getItem('autoCloseBrackets');
  
    const isAutoCloseBracketsEnabled = autoCloseBracketsSetting !== 'false';
    const isLineNumbersEnabled = lineNumbersSetting !== 'false';
    const isAutoCompleteEnabled = autoCompleteSetting !== 'false';
  
    const codeMirror = CodeMirror.fromTextArea(
      document.getElementById('codeArea'),
      {
        mode: 'javascript',
        lineNumbers: isLineNumbersEnabled,
        autoIndent: true,
        autoCloseBrackets: isAutoCloseBracketsEnabled,
        matchBrackets: true,
        theme: 'juejin',
      },
    );
  
    const runBtn = document.querySelector('#runButton');
    const styleLink = document.querySelector('#pageTheme');
    const copyButton = document.querySelector('#copyButton');
    const consoleArea = document.querySelector('#consoleArea');
    const setToDefault = document.querySelector('#setToDefault');
    const autoComplete = document.querySelector('#autoComplete');
    const clearCodeBtn = document.querySelector('#clearCodeButton');
    const clearConsoleBtn = document.querySelector('#clearConsoleButton');
    const layoutContainer = document.querySelector('.layout-container');
    const buttonContainer = document.querySelector('.button-container');
    const pageThemeSelect = document.querySelector('#pageThemeSelect');
    const showLineNumbers = document.querySelector('#showLineNumbers');
    const codeMirrorStyles = document.querySelector('.CodeMirror');
    const autoCloseBrackets = document.querySelector('#autoCloseBrackets');
    const editorThemeSelect = document.querySelector('#editorThemeSelect');
    const orientationSelect = document.querySelector('#orientationSelect');
  
    let hoverTimer;
  
    const realConsole = console.log;
    console.log = (msg) => {
      realConsole(msg);
      consoleArea.textContent += 'Console: ' + msg + '\n';
    };
  
    const applyPageTheme = (theme) => {
      pageThemeSelect.value = theme;
      if (theme === 'os-theme') {
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        )
          styleLink.setAttribute('href', 'dark-theme.css');
        else styleLink.setAttribute('href', 'light-theme.css');
      } else styleLink.setAttribute('href', `${theme}.css`);
    };
  
    const applyEditorTheme = (theme) => {
      codeMirror.setOption('theme', theme);
      editorThemeSelect.value = theme;
      localStorage.setItem('editorTheme', theme);
    };
  
    const applyOrientation = (orientation) => {
      ['vertical', 'horizontal', 'oneandhalf'].forEach((availableOrientation) => {
        const isCurrentOrientation = orientation === availableOrientation;
        layoutContainer.classList.toggle(
          availableOrientation,
          isCurrentOrientation,
        );
        buttonContainer.classList.toggle(
          availableOrientation,
          isCurrentOrientation,
        );
      });
      orientationSelect.value = orientation;
      localStorage.setItem('orientation', orientation);
    };
  
    const toggleAutoComplete = () => {
      codeMirror[autoComplete.checked ? 'on' : 'off'](
        'inputRead',
        autoCompleteHandler,
      );
      localStorage.setItem('autoComplete', autoComplete.checked.toString());
    };
  
    const autoCompleteHandler = (instance) =>
      CodeMirror.commands.autocomplete(instance, null, { completeSingle: false });
  
    autoComplete.addEventListener('change', toggleAutoComplete);
  
    pageThemeSelect.addEventListener('change', (e) => {
      applyPageTheme(e.target.value);
      localStorage.setItem('pageTheme', e.target.value);
    });
  
    editorThemeSelect.addEventListener('change', () => {
      applyEditorTheme(editorThemeSelect.value);
    });
  
    autoCloseBrackets.addEventListener('change', () => {
      codeMirror.setOption('autoCloseBrackets', autoCloseBrackets.checked);
      localStorage.setItem(
        'autoCloseBrackets',
        autoCloseBrackets.checked.toString(),
      );
    });
  
    showLineNumbers.addEventListener('change', () => {
      codeMirror.setOption('lineNumbers', showLineNumbers.checked);
      localStorage.setItem('lineNumbers', showLineNumbers.checked.toString());
    });
  
    codeMirrorStyles.addEventListener('mouseover', () => {
      clearTimeout(hoverTimer);
      document.querySelector('.codeAreaContainer').classList.add('hovered');
    });
  
    codeMirrorStyles.addEventListener('mouseout', () => {
      hoverTimer = setTimeout(() => {
        document.querySelector('.codeAreaContainer').classList.remove('hovered');
      }, 500);
    });
  
    copyButton.addEventListener('mouseover', () => {
      clearTimeout(hoverTimer);
    });
  
    copyButton.addEventListener('mouseout', () => {
      document.querySelector('.codeAreaContainer').classList.remove('hovered');
    });
  
    setToDefault.addEventListener('click', () => {
      const propertyToKeep = localStorage.getItem('code');
      localStorage.clear();
      if (propertyToKeep !== null) localStorage.setItem('code', propertyToKeep);
      location.reload();
      setToDefault.textContent = 'Done!';
      setTimeout(() => {
        setToDefault.textContent = 'Set to default';
      }, 1000);
    });
  
    runBtn.addEventListener('click', () => {
      try {
        const code = codeMirror.getValue();
        const result = new Function(code);
        result();
      } catch (error) {
        consoleArea.textContent += 'Error: ' + error + '\n';
      }
    });
  
    clearCodeBtn.addEventListener('click', () => {
      codeMirror.setValue('');
    });
  
    clearConsoleBtn.addEventListener('click', () => {
      consoleArea.textContent = '';
    });
  
    orientationSelect.addEventListener('change', (e) => {
      applyOrientation(e.target.value);
    });
  
    copyButton.addEventListener('click', () => {
      const code = codeMirror.getValue();
      navigator.clipboard.writeText(code).then(() => {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 1000);
      });
    });
  
    codeMirror.on('change', () => {
      const code = codeMirror.getValue();
      localStorage.setItem('code', code);
    });
  
    applyPageTheme(pageTheme);
    applyEditorTheme(savedTheme);
    applyOrientation(savedOrientation);
    toggleAutoComplete();
  
    if (savedCode !== null) {
      codeMirror.setValue(savedCode);
    }
  
    autoCloseBrackets.checked = isAutoCloseBracketsEnabled;
    showLineNumbers.checked = isLineNumbersEnabled;
    autoComplete.checked = isAutoCompleteEnabled;
  });
  