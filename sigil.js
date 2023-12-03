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
// Function to display new message
function printOutput(message) {
    const outputContainer = document.createElement('div');
    outputContainer.innerHTML = message;

    // Append the new message to the content div
    document.getElementById('cli-content').appendChild(outputContainer);

    autoClear(6); // Assuming you want to clear after a certain number of messages
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
    const messagesContainer = document.getElementById('cli-content'); // Use the correct container ID

    const children = Array.from(messagesContainer.children);

    if (children.length > limit) {
        // Keep the last 'limit' children
        const childrenToKeep = children.slice(-limit);

        // Remove all children except for the prompt and input
        children.forEach((child) => {
            if (
                child !== cliPrompt &&
                child !== cliInput &&
                !child.classList.contains('output') &&
                !childrenToKeep.includes(child)
            ) {
                messagesContainer.removeChild(child);
            }
        });
    }
}




//**************************//
//          ROOMS          //
//************************//

const rooms = {
    start: {
        generateDescription: function (inventory) {
            if (inventory.lantern && objects.lantern.lit) {
                return "Cellar Entrance: You are in the entrance to a cellar with a dilapidated desk. To the south is a ";
            } else {
                return "Dark Room: You are in a dark room with a dilapidated desk. There is a weathered note on it. Light from the north is dimly illuminating the room.";
            }
        },
        actions: {
            north: "hallway",
            take: "note",
            south: "locked door",
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
          inspect: "barrels",
          take: "lantern",
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
        description: "A small brass key.",
        take: () => {
            takeItem('key');
        },
    },
    food: {
        description: "Rotten food, would anybody even eat this?",
        take: () => {
            takeItem('food');
        },
    },
    barrels: {
        description: "You found an lantern, it's old but it might be useful. Take it?",
        take: () => {
        },
    },
    lantern: {
        description: "An old lantern. Still has some fuel left in it.",
        take: () => {
            takeItem('lantern');
        },
        lit: false,
        light: () => {
            if (inventory.lantern && !objects.lantern.lit) {
                objects.lantern.lit = true;
                printOutput("You light the lantern.");
            } else if (!inventory.lantern) {
                printOutput("You don't have a lantern");
            } else {
                printOutput("The lantern is already lit.");
            }
        },
        turnOff: () => {
            if (inventory.lantern && objects.lantern.lit) {
                objects.lantern.lit = false;
                printOutput("You turn off the lantern.");
            } else if (!inventory.lantern) {
                printOutput("You don't have a lantern");
            } else {
                printOutput("The lantern is already off.");
            }
        },
    },
    

    //add more items here
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
            case 'read':
                printOutput(objects[object].description);
                break;
                
            case 'drop':
                dropItem(commandArgs[1]);
                break;

            case 'light':
                if (objects[object] && objects[object].light) {
                objects[object].light();
                    } else {
                        printOutput(`You cannot light the ${object}.`);
                            }
                break;

            case 'turn':
                if (commandArgs[1] === 'off' && objects[object] && objects[object].turnOff) {
                objects[object].turnOff();
                    } else {
                 printOutput(`You cannot turn off the ${object}.`);
                            }
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
        
        case 'help':
            printOutput('<strong>If you need to go somewhere try commands like</strong>');
            printOutput('north, south, east and west');
            printOutput('<strong>If you\'re lost try commands like</strong');
            printOutput('look, read, inspect and take - followed by an object')
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
        case 'light':
            handleObjectInteraction(mainCommand, commandArgs[1]);
            break;

        case 'inventory':
        case 'bag':
            displayInventory();
            break;
        
        case 'turn':
            handleObjectInteraction(mainCommand, commandArgs[2]);
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
