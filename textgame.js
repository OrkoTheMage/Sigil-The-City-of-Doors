//**************************//
//  LISTNERS AND CLI HTML  //
//************************//


document.addEventListener('DOMContentLoaded', function () {
    const cliContainer = document.getElementById('cli-container');
    const cliPrompt = document.getElementById('cli-prompt');
    const cliInput = document.getElementById('cli-input');
  
    cliInput.addEventListener('keydown', handleInput);



const rooms = {
    start: {
      description: "You are in a dark room. There is a door to the south and light coming for the north.",
      actions: {
        north: "hallway",
      },
    },
    hallway: {
      description: "You are in a dimly lit hallway. There are doors to the east and west.",
      actions: {
        east: "kitchen",
        west: "start",
      },
    },
    kitchen: {
      description: "You are in a dusty kitchen. There is a key on the table.",
      actions: {
        west: "hallway",
        take: "key",
      },
    },
  };

  // Define objects
  const objects = {
    key: {
      description: "A shiny key. It might be useful.",
      take: () => {
        printOutput("You take the key.");
        // Add logic for taking the key (inventory, etc.)
      },
    },
  };

  // Game state
  let currentRoom = rooms.start;

  // Function to display current room description
  function displayRoom() {
    printOutput(currentRoom.description);
  }

  // Function to handle player actions
  function handleAction(action) {
    if (currentRoom.actions[action]) {
      const nextRoom = rooms[currentRoom.actions[action]];
      currentRoom = nextRoom;
      displayRoom();
    } else {
      printOutput("Invalid action. Try again.");
    }
  }

  // Function to handle object interactions
  function handleObjectInteraction(object) {
    if (objects[object] && objects[object].take) {
      objects[object].take();
    } else {
      printOutput("You can't do that with the " + object + ".");
    }
  }

  // Function to process user input
  function processCommand(command) {
    printOutput(`>${command}`);
    const commandArgs = command.split(' ');
    const mainCommand = commandArgs[0].toLowerCase();

    switch (mainCommand) {
        case 'north':
        case 'n':
          handleAction('north');
          break;

        case 'east':
        case 'e':
          handleAction('east');
          break;

        case 'west':
        case 'w':
          handleAction('west');
          break;

        case 'south':
        case 's':
          handleAction('south');
          break;

        case 'take':
          handleObjectInteraction(commandArgs[1]);
          break;

        case 'room':
        case 'where am i':
        case 'where':
        case 'look':
        case 'here':
            displayRoom();
            break;

        default:
          printOutput("Invalid command. Try again.");
      }
  }

  // Function to handle Enter key press
  function handleInput(event) {
    if (event.key === 'Enter') {
      processCommand(cliInput.value.trim());
      cliInput.value = '';
    }
  }

  // Initial display
  displayRoom();

  function printOutput(message) {
    const outputContainer = document.createElement('div');
    outputContainer.innerHTML = message;
    cliContainer.appendChild(outputContainer);
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

})