//**************************//
//  LISTNERS AND CLI HTML  //
//************************//

// Display CLI
document.addEventListener('DOMContentLoaded', function () {
    const cliContainer = document.getElementById('cli-container');
    const cliPrompt = document.getElementById('cli-prompt');
    const cliInput = document.getElementById('cli-input');
    const cliContent = document.getElementById('cli-content');

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

    // Append the new message to the content div
    document.getElementById('cli-content').appendChild(outputContainer);

    autoClear(6); // Assuming you want to clear after a certain number of messages
}

function clear() {
    const children = Array.from(cliContent.children);
    children.forEach((child) => {
        if (
            child !== cliPrompt &&
            child !== cliInput &&
            !child.classList.contains('output') &&
            !childrenToKeep.includes(child)
        ) {
            cliContent.removeChild(child);
        }
    });
  }

  function autoClear(limit) {
    const children = Array.from(cliContent.children);

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
                cliContent.removeChild(child);
            }
        });
    }
}


//**************************//
//          ROOMS          //
//************************//

const rooms = {
    start: {
        description: "Dark Room: You are in a dark room, with a dilapidated desk. There is a weathered note on it. Light partially peaks in from a north hallway.",
        actions: {
            north: "hallway",
            south: "alleyway",
            take: "note",
            inspect: "desk",
        },
    },
    study: {
        description: "Study: With your lantern illuminating the surroundings you can see this, once dark room, was working as someones study. Many books are strew about, in piles and scatter. There is a cellar hatch to the south.",
        actions: {
            north: "hallway",
            south: "alleyway",
            inspect: "desk",
            inspect: "books",
            inspect: "book",
            take: "sword",
        },
    },
    alleyway: {
        description: "Alleyway: You are in an alleyway, finally, sunlight! It appears you're in a large city, the alley stretches further ahead. South, you see a dark-iron clad figure, slouched and wailing. Behind you, north, is the cellar. ",
        actions: {
            north: "study",
            south: "alleyend"
        },
    },
    alleyend: {
        description: "Alley End: add descrip ", //add
        actions: {
            north: "alleyway"

        },
    },
    hallway: {
      description: "Hallway: You are in a dimly lit hallway. There are doorways to the east and west and a dark room to the south.",
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
          inspect: "barrel",
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
//      ROOM CHANGES       //
//************************//

// Start room locked door
rooms.start.actions.south = () => {
    if (inventory.key) {
        printOutput("The hatch door creaks open. You unlock it with the key and enter an alleyway.");
        return "alleyway";
    } else {
        printOutput("The hatch is locked.");
        return null;
    }
};

// If the start room has been changed to the study, and is locked
rooms.study.actions.south = () => {
    if (inventory.key) {
        printOutput("The hatch door creaks open. You unlock it with the key and enter an alleyway.");
        return "alleyway";
    } else {
        printOutput("The hatch is locked.");
        return null; // Returning null indicates that the player didn't move to a new room
    }
};

// Lights up the start to the Study
rooms.hallway.actions.south = () => {
    if (inventory.lantern) {
        return "study";
    } else {
        return "start";
    }
};

// Alleyway to the Study (lit) or Start (unlit)
rooms.alleyway.actions.north = () => {
    if (inventory.lantern) {
        return "study";
    } else {
        return "start";
    }
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
    desk: {
        description: 'There is nothing useful in the desk.',
        take: () => {
        },
    },
    books: {
        description: 'You rummage through the books. Mostly garbage but your latern light catches a glint of something metallic, a sword. Take it?',
        take: () => {
            takeItem('sword');
        },
    },
    book: {
        description: 'You rummage through the books. Mostly garbage but your latern light catches a glint of something metallic, a sword. Take it?',
        take: () => {
            takeItem('sword');
        },
    },
    key: {
        description: "A small brass key.",
        take: () => {
            takeItem('key');
        },
    },
    food: {
        description: "Rotten food, who would eat this?",
        take: () => {
            takeItem('food');
        },
    },
    barrels: {
        description: "You found an lantern, it's old but it might be useful. Take it?",
        take: () => {
        },
    
    },
    barrel: {
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
    sword: {
        description: "a quality short sword",
        take: () => {
            takeItem('sword');
        }
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


//**************************//
//      GAME LOGIC: 2      //
//        HANDLERS         //
//************************//

 // Function to handle player actions
 function handleMovement(action) {
    if (currentRoom.actions[action]) {
        moves++; // Increment moves when the player moves
        updateCounters(); // Update the counters

        if (action === 'south' && currentRoom.actions.south instanceof Function) {
            // If the action is 'south' and it's a function, call the function
            const nextRoom = currentRoom.actions.south();
            if (nextRoom) {
                currentRoom = rooms[nextRoom];
                displayRoom();
            }
        } 
        else if (action === 'north' && currentRoom.actions.north instanceof Function) {
            // If the action is 'north' and it's a function, call the function
            const nextRoom = currentRoom.actions.north();
            if (nextRoom) {
                currentRoom = rooms[nextRoom];
                displayRoom();
            }
        }
        else {
            // If it's a regular action, get the next room and update
            const nextRoom = rooms[currentRoom.actions[action]];
            currentRoom = nextRoom;
            displayRoom();
        }
    } else {
        printOutput(`You cannot go ${action}. Try again.`);
    }
}

// Function to handle object interactions
function handleObjectInteraction(action, object) {
    if (objects[object]) {
        
        moves++; // Increment moves for each action
        updateCounters(); // Update the counters
    
        switch (action) {
            case 'take':
            case 'grab':
            case 'pickup':
            case 'pick':
            case 'pick-up':
            case 'loot':
                if (objects[object].take) {
                    objects[object].take();
                } else {
                    printOutput("You can't take the " + object + ".");
                }
                break;
           
            case 'inspect':
            case 'read':
            case 'open':
            case 'examine':
            case 'check':
                printOutput(objects[object].description);
                break;

            default:
                printOutput("I don\'t know that command for " + object + ". Try again.");
        }
    } else if (action && !object) {
        printOutput(action + " what? There was no object in that command.");
    } else {
        printOutput("There is no " + object + " to " + action + ".");
    }

    // function handleActions(action, object) {
    //     switch (action.toLowerCase()) {
    //         case 'destroy':
    //         case 'break':
    //         case 'kill':
    //             // Your logic for handling destruction, breaking, killing, etc.
    //             break;
    
    //         case 'hands':
    //             // Your logic for handling actions with hands.
    //             break;
    
    //         case 'sword':
    //             // Your logic for handling actions with a sword.
    //             break;
    
    //         default:
    //             printOutput(`I don't know that action for ${object}. Try again.`);
    //     }
    // }
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
            printOutput ('<strong>If you need to go somewhere try commands like</strong>');
            printOutput ('north, south, east and west');
            printOutput('<strong>If you\'re lost try commands like</strong');
            printOutput('look, read, inspect, take, and others - followed by an object')
            printOutput('or verbs like - kill, destroy, break - followed by an object  ')
            printOutput('<strong>You can look at your inventory with the "inventory", "bag", "inv" or simpily "i" commands</strong')
            break;

        case 'go':
        case 'move':
            const direction = commandArgs[1] ? commandArgs[1].toLowerCase() : '';
            handleMovement(direction);
            break;

        case 'north':
        case 'n':
            handleMovement('north');
            break;

        case 'east':
        case 'e':
            handleMovement('east');
            break;  

        case 'west':
        case 'w':
            handleMovement('west');
            break;   
                  
        case 'south':
        case 's':
            handleMovement('south');
            break;

        case 'room':
        case 'where am i':
        case 'where':
        case 'look':
        case 'here':
            displayRoom();
            break;

        case 'inventory':
        case 'bag':
        case 'inv':
        case 'i':
            displayInventory();
            break;

        case 'take':
        case 'grab':
        case 'pickup':
        case 'pick':
        case 'pick-up':
        case 'loot':
        case 'inspect':
        case 'open':
        case 'read':
        case 'check':
        case 'examine':
            handleObjectInteraction(mainCommand, commandArgs[1]);
            break;

        case 'pick up':
            handleObjectInteraction(mainCommand, commandArgs[2]);
            break;

        // case 'destroy':
        // case 'kill':
        // case 'break':
        // case 'hands':
        // case 'sword':
        //     handleActions(mainCommand, commandArgs[1]);
        //     break;
        
        case 'wait':
        case 'sleep':
        case 'rest':
            printOutput("Time passes but you are no closer to getting home.")
            break;

        default:
            printOutput("I don\'t know that command. Try again.");
    }
}


//**************************//
//     INITIALIZE GAME     //
//************************//
    document.getElementById('ascii-art').style.display= 'none'
    displayRoom();
    updateCounters();
});
