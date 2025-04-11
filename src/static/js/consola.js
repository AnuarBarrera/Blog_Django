document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los elementos del DOM
    const consoleInput = document.getElementById('console-input');
    const consoleOutput = document.getElementById('console-output');
    const scriptsList = document.getElementById('scripts-list');
    
    // Inicializar CodeMirror para la entrada
    const inputEditor = CodeMirror.fromTextArea(consoleInput, {
        mode: 'shell',
        theme: 'dracula',
        lineNumbers: true,
        autofocus: true,
        autoCloseBrackets: true,
        matchBrackets: true
    });
    
    // Inicializar CodeMirror para la salida
    const outputEditor = CodeMirror.fromTextArea(consoleOutput, {
        mode: 'text',
        theme: 'dracula',
        lineNumbers: true,
        readOnly: true,
        lineWrapping: true
    });
    
    // Configurar manejo de teclas para ejecutar comandos
    inputEditor.setOption('extraKeys', {
        'Enter': function(cm) {
            executeCommand(cm.getValue());
            cm.setValue('');
        }
    });
    
    // Función para ejecutar comandos
    function executeCommand(command) {
      
      const trimmedCommand = command.trim(); // Quita espacios al inicio/final
      
      // --- Manejo del comando 'clear' ---
      
      if (trimmedCommand.toLowerCase() === 'clear') { 
        // Si el comando es 'clear' (ignorando mayúsculas/minúsculas)
        
        // Limpia directamente el editor de SALIDA
        outputEditor.setValue(''); // Establece el contenido a vacío

        return; 
      }
      
    // --- Fin del manejo de 'clear' ---
    
    
        // Mostrar el comando en la salida
        appendToOutput('> ' + command + '\n');
    
        // Enviar comando al servidor
        fetch('/execute-script/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({ command: command })
        })
        .then(response => response.json())
        .then(data => {
            // Mostrar la salida en el editor
            appendToOutput(data.output + '\n');
        })
    }
    
    // Función para agregar texto a la salida
    function appendToOutput(text) {
        const doc = outputEditor.getDoc();
        const lastLine = doc.lastLine();
        const lastPos = {
            line: lastLine,
            ch: doc.getLine(lastLine).length
        };
        doc.replaceRange(text, lastPos);
        outputEditor.scrollIntoView({line: doc.lastLine() + 1, ch: 0});
    }
    
    // Función para obtener el token CSRF
    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }
    
    // Manejar clics en la lista de scripts
    if (scriptsList) {
        scriptsList.addEventListener('click', function(e) {
            if (e.target && e.target.nodeName === 'LI') {
                const scriptName = e.target.getAttribute('data-script');
                inputEditor.setValue('run ' + scriptName);
                inputEditor.focus();
            }
        });
    }
});