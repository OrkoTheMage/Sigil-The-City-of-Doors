//**************************//
//  LISTNERS AND CLI HTML  //
//************************//


document.addEventListener('DOMContentLoaded', function () {
  const cliContainer = document.getElementById('cli-container');
  const cliPrompt = document.getElementById('cli-prompt');
  const cliInput = document.getElementById('cli-input');

  cliInput.addEventListener('keydown', handleInput);

  
//****************************//
//  INPUT AND CMD FUNCTIONS  //
//**************************//

  
  function handleInput(event) {
    if (event.key === 'Enter') {
      processCommand(cliInput.value.trim());
      cliInput.value = '';
    }
  }

  function printOutput(message) {
    const outputContainer = document.createElement('div');
    outputContainer.innerHTML = message;
    cliContainer.appendChild(outputContainer);
  }

  function processCommand(command) {
    const outputContainer = document.createElement('div');
    outputContainer.innerHTML = `>${command}`;
    cliContainer.appendChild(outputContainer);

    const commandArgs = command.split(' ');
    const mainCommand = commandArgs[0].toLowerCase();

    switch (mainCommand) {
      case 'help':
        printOutput('Available commands: help, about, contact, register, login, clear, shutdown, run-ib');
        break;

      case 'about':
        printOutput('This is a CLI for Homies LLC. Enter "help" for more info.');
        break;

      case 'contact':
        printOutput('You can reach us at contact.com');
        break;

      case 'register':
        registerUser(commandArgs.slice(1));
        break;

      case 'login':
        loginUser(commandArgs.slice(1));
        break;

      case 'home':
        showLoadingBar();
        simulateLoading();
        break;

      case 'clear':
        clear();
        break;
      
      case 'run-ib':
        showLoadingBar();
        simulateLoading();
        setTimeout(function() {
          window.location.href = 'https://homies-llc.github.io/In-Between/';
          }, 2000);
        break;

      case 'shutdown':
        window.close();
        break;
      
      
      default:
        printOutput(`Command not found: ${command}. Type 'help' for available commands.`);
    }

    // Scroll to the bottom to show the latest output
    cliContainer.scrollTop = cliContainer.scrollHeight;
  }


//****************************//
//      CASE FUNCTIONS       //
//**************************//

  function showLoadingBar() {
    const loadingBarContainer = document.createElement('div');
    loadingBarContainer.innerHTML = 'Loading: [                    ]';
    cliContainer.appendChild(loadingBarContainer);
  }

  function simulateLoading() {
    const loadingBar = cliContainer.lastElementChild;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 30;
      if (progress <= 100) {
        const bar = '[' + '='.repeat(progress / 10) + ' '.repeat((100 - progress) / 10) + ']';
        loadingBar.innerHTML = `Loading: ${bar}`;
      } else {
        clearInterval(interval);
        cliContainer.removeChild(loadingBar);
        printOutput('Done!');
      }
    }, 500); // Adjust the interval as needed
  }


  function registerUser(args) {
    // Check if username and password are provided
    if (args.length !== 2) {
      printOutput('Usage: register <username> <password>');
      return;
    }

    const username = args[0];
    const password = args[1];

    // Check if user already exists in local storage
    if (localStorage.getItem(username)) {
      printOutput('User already exists. Please choose a different username.');
      return;
    }

    // Save user to local storage
    localStorage.setItem(username, password);
    printOutput('User registered successfully.');
  }

  function loginUser(args) {
    // Check if username and password are provided
    if (args.length !== 2) {
      printOutput('Usage: login <username> <password>');
      return;
    }

    const username = args[0];
    const password = args[1];

    // Check if user exists in local storage
    if (!localStorage.getItem(username)) {
      printOutput('User not found. Please register or check your username.');
      return;
    }

    // Check if password matches
    if (localStorage.getItem(username) !== password) {
      printOutput('Incorrect password. Please try again.');
      return;
    }

    printOutput('Login successful. Welcome, ' + username + '!');
  }

  function clear() {
    Array.from(cliContainer.children).forEach((child) => {
      if (
        child !== cliPrompt &&
        child !== cliInput &&
        !child.classList.contains('output') // Assuming output elements have a class 'output'
      ) {
        cliContainer.removeChild(child);
      }
    })
  } 
});
