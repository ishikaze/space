const consoleElement = document.getElementById('console');
const consoleInput = document.getElementById('console-input');
const consoleLog = document.getElementById('console-log');
let commandHistory = localStorage.getItem('commandHistory') ? JSON.parse(localStorage.getItem('commandHistory')) : [];
let historyIndex = commandHistory.length > 0 ? commandHistory.length - 1 : -1;
let logQueue = [];

document.addEventListener('keydown', async (event) => {
  if (event.key === '`') {
    if (consoleElement.style.display === 'flex') {
      consoleElement.style.display = 'none';
    } else {
      consoleElement.style.display = 'flex';
      await sleep(50);
      consoleInput.focus();
    }
  }
});

consoleInput.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const command = consoleInput.value;
    logToConsole(`> ${command}`);
    logToConsole();
    consoleInput.value = '';
    commandHistory.push(command);
    localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
    historyIndex = commandHistory.length;

    if (commandHistory.length > 100) {
      commandHistory.shift();
    }
    localStorage.setItem('commandHistory', JSON.stringify(commandHistory));

    await sleep(250)
    handleConsoleCommand(command);
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      consoleInput.value = commandHistory[historyIndex];
    }
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      consoleInput.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      consoleInput.value = '';
    }
  }
}); 

async function logToConsole(message) {
    if (!message) {
        message = '　';
    }
    logQueue.push(message);
    if (logToConsole.isProcessing) return;
    logToConsole.isProcessing = true;
    try {
        while (logQueue.length > 0) {
            const msg = logQueue.shift();
            const messageElement = document.createElement('div');
            messageElement.textContent = msg;
            consoleLog.appendChild(messageElement);
            consoleElement.scrollTop = consoleLog.scrollHeight;
            await sleep(50);
        }
    } finally {
        logToConsole.isProcessing = false;
    }
}

function handleConsoleCommand(cmd) {
    switch(cmd.trim().toLowerCase().split(' ')[0]) {
        case 'clear':
            consoleLog.innerHTML = '';
            break;
        case 'help':
        case '?':
            if (!cmd.trim().toLowerCase().split(' ')[1]) {
                logToConsole('List of commands:')
                logToConsole('clear - Clears the console log');
                logToConsole('skiploading/skip - Skips the loading screen entirely');
                logToConsole('version/ver [reset] - Displays or resets the app version');
                logToConsole('timeOverride [timeOfDay] - Overrides the time');
                logToConsole();
                logToConsole('use help/? <command> for more info on a specific command')
                logToConsole('arguments in <> are required, arguments in [] are optional');
            } else {
                switch (cmd.trim().toLowerCase().split(' ')[1]) {
                    case 'timeoverride':
                        logToConsole('Help for: timeOverride')
                        logToConsole();
                        logToConsole('Sets time override for music queue loading.')
                        logToConsole();
                        logToConsole('Usage: timeOverride [timeOfDay]');
                        logToConsole();
                        logToConsole('Available <timeOfDay> values:');
                        logToConsole('0 - no override')
                        logToConsole('1 - early morning')
                        logToConsole('2 - morning')
                        logToConsole('3 - afternoon')
                        logToConsole('4 - evening')
                        logToConsole('5 - night')
                        logToConsole('6 - late night')
                        break;
                    default:
                        logToConsole(`No help available for command: "${cmd.trim().toLowerCase().split(' ')[1]}"`);
                        break;
                }
            }
            
            break;
        case 'timeoverride':
            if (cmd.trim().toLowerCase().split(' ').length < 2) {
                logToConsole('current timeOverride: ' + (localStorage.getItem('timeOverride') || 'no override'));
                break;
            } else {
                const timeOfDay = Number(cmd.trim().toLowerCase().split(' ')[1]);
                if (isNaN(timeOfDay) || timeOfDay < 0 || timeOfDay > 6) {
                    logToConsole('Error: [timeOfDay] must be a number between 0 and 6.');
                    logToConsole('Use "help timeOverride" for more info.');
                    break;
                } else {
                    setTimeOverride(timeOfDay);
                }
            }
            break;
        case 'popup':
            logToConsole('Popup displayed.')
            defaultPopup(cmd.trim().substring(6).trim() || '');
            break;
        case 'skiploading':
        case 'skipload':
        case 'skip':
            loadingFinished = true;
            closeLoading()
            logToConsole('loading skipped.')
            break;
        case 'version':
        case 'ver':
            if (cmd.trim().toLowerCase().split(' ').length < 2) {
                logToConsole('Current version: ' + (localStorage.getItem('appVersion') || '0'));
            } else if (cmd.trim().toLowerCase().split(' ')[1] === 'reset') {
                localStorage.removeItem('appVersion');
                logToConsole('version reset. refresh to apply.');
            }
            
            break;
        default:
            logToConsole(`Unknown command: "${cmd}"`);
            logToConsole(`Please use "help" or "?" for a list of commands.`);
            break;
    }
    logToConsole()
}