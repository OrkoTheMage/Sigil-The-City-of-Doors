//**************************//
//  LISTNERS AND CLI HTML  //
//************************//

// Display CLI
document.addEventListener('DOMContentLoaded', function () {
    const cliContainer = document.getElementById('cli-container');
    const cliPrompt = document.getElementById('cli-prompt');
    const cliInput = document.getElementById('cli-input');

// Listener
cliInput.addEventListener('keydown', handleInput);


//**************************//
//      CLI FUNCTIONS      //
//************************//

// Function to handle Enter key press
function handleInput(event) {
    if (event.key === 'Enter') {
      processCommand(cliInput.value.trim());
      cliInput.value = '';
    }
  }

// Function to display new message
function printOutput(message) {
    const outputContainer = document.createElement('div');
    outputContainer.innerHTML = message;
    cliContainer.appendChild(outputContainer);

    autoClear(8);
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

  function autoClear(limit) {
    const children = Array.from(cliContainer.children);

    if (children.length > limit) {
        // Keep the last 'limit' children
        const childrenToKeep = children.slice(-limit);
    }
    if (children.length > limit) {
        // Remove all children except for the prompt and input
        children.forEach((child) => {
            if (
                child !== cliPrompt &&
                child !== cliInput &&
                !child.classList.contains('output')
            ) {
                cliContainer.removeChild(child);
            }
        });
    }
}


//**************************//
//          ROOMS          //
//************************//

const rooms = {
    start: {
      description: "Dark Room: You are in a dark room, with a dilapidated desk. There is a weathered note on it. There is a hatch door to the south and light coming for the north.",
      actions: {
        north: "hallway",
        take: "note",
        south: "locked door"
        },
    },
    lockedDoor: {
        description: "The hatch is locked.",
        actions: {
            north: "hallway",
        },
    },
    hallway: {
      description: "Hallway: You are in a dimly lit hallway. There are doorsways to the east and west and a dark room to the south.",
      actions: {
        east: "kitchen",
        west: "storeroom",
        south: "start"
      },
    },
    storeroom: {
        description: "Store Room: You are in a cellar store room. There are a number of run-down barrels within the room and a door leading east.",
        actions: {
          east: "hallway",
          take: "barrels"
        },
      },
    kitchen: {
      description: "Kitchen: You are in a dusty kitchen, full of rotting food. There is a key on the table and a door leading west.",
      actions: {
        west: "hallway",
        take: "key",
        take: "food",
      },
    },
  };


//**************************//
//         OBJECTS         //
//************************//


const objects = {
    note: {
        description: '<strong>"Welcome to Sigil!</strong> It seems you found a portal here, through the machinations of <strong>The Lady of Pain</strong>, don\'t panic. There\'s plenty of food and supplies available. Come find me when you can." The note is signed <strong>"Proctor Torkka"</strong>.',
        take: () => {
            takeItem('note');
        },
    },
    key: {
        description: "A shiny key. It might be useful.",
        take: () => {
            takeItem('key');
        },
    },
    food: {
        take: () => {
            takeItem('food');
        },
    },
    barrels: {
        take: () => {
            takeItem('lantern');
        },
    },
    // Add more objects as needed
};

function takeItem(item) {
    const inventorySize = Object.keys(inventory).length;
    const maxInventorySize = 5;

    if (inventorySize < maxInventorySize) {
        printOutput(`You take the ${item}.`);
        inventory[item] = true;
    } else {
        printOutput(`Your inventory is full. You cannot take the ${item}.`);
    }
}


//**************************//
//      GAME LOGIC: 1      //
//       GAME STATE       //
//************************//

//Globals
let currentRoom = rooms.start;
let moves = 0;
let score = 0;
const inventory = {};

function updateCounters() {
    const movesInfoElement = document.getElementById('moves-info');
    movesInfoElement.innerHTML = `<p>Moves: ${moves}</p>`;
  
    const scoreInfoElement = document.getElementById('score-info');
    scoreInfoElement.innerHTML = `<p>Score: ${score}</p>`;
  }

  // Function to display current room description
  function displayRoom() {
    const descriptionParts = currentRoom.description.split(':'); // Split the description into parts
    const boldText = `<strong>${descriptionParts[0]}</strong>`; // Bold the first part
    const unboldedText = descriptionParts.slice(1).join('.'); // Join the remaining parts without bolding

// Update the room info element
    const roomInfoElement = document.getElementById('room-info');
    roomInfoElement.innerHTML = `<p>${boldText}</p>`;

    printOutput(`${boldText}`);
    printOutput(`${unboldedText}`);
  }



function displayInventory() {
    const inventoryItems = Object.keys(inventory);
    if (inventoryItems.length > 0) {
        printOutput("<strong>Inventory:</strong>");
        inventoryItems.forEach(item => {
            printOutput(`- ${item}`);
        });
    } else {
        printOutput("Your inventory is empty.");
    }
}

function dropItem(item) {
    if (inventory[item]) {
        printOutput(`You dropped ${item}.`);
        delete inventory[item];
    } else {
        printOutput(`You don't have ${item} in your inventory.`);
    }
}

//**************************//
//      GAME LOGIC: 2      //
//        HANDLERS         //
//************************//

 // Function to handle player actions
 function handleMovement(action) {
    if (currentRoom.actions[action]) {
        moves++; // Increment moves when the player moves
        updateCounters(); // Update the counters
        
        const nextRoom = rooms[currentRoom.actions[action]];
      currentRoom = nextRoom;
      displayRoom();
    } else {
      printOutput(`You cannot go ${action}. Try again.`);
    }
  }

// Function to handle object interactions
function handleObjectInteraction(action, object) {
    const fullCommand = action + ' ' + object;
    if (objects[object]) {
        
        moves++; // Increment moves for each action
        updateCounters(); // Update the counters
    
        switch (action) {
            case 'take':
            case 'grab':
            case 'pickup':
                if (objects[object].take) {
                    objects[object].take();
                } else {
                    printOutput("You can't take the " + object + ".");
                }
                break;
           
            case 'inspect':
            case 'open':
            case 'read':
                printOutput(objects[object].description);
                break;

            case 'drop':
                dropItem(commandArgs[1]);
                break;

            default:
                printOutput("Invalid command for " + object + ". Try again.");
        }
    } else {
        printOutput("There is no " + object + " to " + action + ".");
    }
}

//**************************//
//      GAME LOGIC: 3      //
//      CLI COMMANDS      //
//************************//

// Function to process user input
function processCommand(command) {
    printOutput(`>${command}`);
    const commandArgs = command.split(' ');
    const mainCommand = commandArgs[0].toLowerCase();

    switch (mainCommand) {
        case 'clear':
            clear();
            break;

        case 'north':
        case 'east':
        case 'west':
        case 'south':
            handleMovement(mainCommand);
            break;

        case 'room':
        case 'where am i':
        case 'where':
        case 'look':
        case 'here':
            displayRoom();
            break;

        case 'take':
        case 'grab':
        case 'pickup':
        case 'inspect':
        case 'open':
        case 'read':
        case 'drop':
            handleObjectInteraction(mainCommand, commandArgs[1]);
            break;

        case 'inventory':
        case 'bag':
            displayInventory();
            break;

        default:
            printOutput("Invalid command. Try again.");
    }
}


//**************************//
//     INITIALIZE GAME     //
//************************//
    displayRoom();
    updateCounters();
});
