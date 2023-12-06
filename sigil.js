//**************************//
//  LISTNERS AND CLI HTML  //
//************************//

// DOMS
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

// Function to manually clear the CLI
function clear() {
    const children = Array.from(cliContent.children);
    children.forEach((child) => {
        if (
            child !== cliPrompt &&
            child !== cliInput &&
            !child.classList.contains('output')) {
            cliContent.removeChild(child);
        }
    });
  }

// Function to automatically clear the CLI
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
    
// Game Start / Dark Room / Study
start: {
    description: () => {
        if (inventory.lantern) {
            return "Study: With your lantern illuminating the surroundings you can see this, once dark room, was working as someone's study. Many books are strewn about, in piles and scatter. There is a cellar hatch to the south.";
        } else {
            return "Dark Room: You are in a dark room, with a dilapidated desk. There is a weathered note on it. Light partially peaks in from a north hallway.";
        }
    },
    objects: {
        note: {
            description: '<strong>"Welcome to Sigil! It seems you found a portal here, through the machinations of The Lady of Pain, don\'t panic. There\'s plenty of food and supplies available. Come find me when you can."</strong> The note is signed <strong>"Proctor Torkka"</strong>.',
            take: () => {
                takeItem('note');
            },
        },
        desk: {
            description: 'There is nothing useful in the desk.',
            break: () => {
                return 'The desk easily crumbles to your actions';
            },
        },
        book: {
            description: 'You rummage through the books. Mostly garbage but your lantern light catches a glint of something metallic, a sword. Take it?',
            break: () => {
                return 'You rummage through the books. Mostly garbage but your lantern light catches a glint of something metallic, a sword. Take it?';
            },
        },
        books: {
            description: 'You rummage through the books. Mostly garbage but your lantern light catches a glint of something metallic, a sword. Take it?',
            break: () => {
                return 'You rummage through the books. Mostly garbage but your lantern light catches a glint of something metallic, a sword. Take it?';
            },
        },
        sword: {
            description: "A quality sword sword",
            take: () => {
                takeItem('sword');
            },
        },
        hatch: {
            description: 'A cellar hatch door with a keyhole.',
            break: () => {
                return 'You cannot break the hatch door. It\'s surprisingly sturdy';
            },
            breakWithSword: () => {
                return 'You use your sword to break the hatch door. It shatters into pieces.';
            },
        },
    },
    actions: {
        north: "hallway",
        south: "alleyway",
    },
},


    // Alleyway
    alleyway: {
        description: "Alleyway: You are in an alleyway, finally, sunlight! It appears you're in a large city, the alley stretches further ahead. South, you see a dark-iron clad figure, slouched and wailing maddeningly. Behind you, north, is the cellar. ",
        actions: {
            north: "start",
            south: "alleyend"
        },
    },


    // Alley End
    alleyend: {
        description: () => {
            if (foodGiven) {
                return "Alley End: The half-orc, now satisfied with the food you gave him, watches you pass without hostility. To the south, you see a busy thoroughfare.";
            } else if (wonOrcCombat) {
                return "Alley End: The half-orc, now dead, lies lifeless on the ground. You can proceed freely to the south, where you see a busy thoroughfare.";
            } else {
                return "Alley End: Now visible, the figure is a half-orc. He's either unaware or too deranged to notice your presence. Though charging past him might change that. To the south, you see a busy thoroughfare.";
            }
        },
        objects: {
            food: {
                description: "Rotten food, who would eat this?",
                give: () => {
                    giveFood();
                },
            },
        },
        actions: {
            north: "alleyway",
            south: "marketplace",
        },
        dialogue: {
            default: 'You catch the half-orcs attention. The half-orc speaks: <strong>Berk! Where\'d you come from? No matter, nothing no-matters-not in this nonsense. It\'s all chaos and i\'m hungry. You have snack or are you my food?</strong>',
        },
        sneakAllowed: true,
        sneakAttempted: false,
        combatAvailable: true,
    },


    // Marketplace
    marketplace: {
        description: "Marketplace: Out of the alley you arrive at the busy street. All manner of creatures walk about. You see countless blocks of foreign architecture. Bustling through streets, smoke choked alleys, large centers. The city seems to wrap - above you, even.",
        actions: {
  
        },
    },


    // Hallway
    hallway: {
      description: () => {
        if (inventory.lantern) {
            return "Hallway: You are in a, now well-lit, hallway. (Thanks to your lantern) There are doorways to the east and west. You can now see into the previous room to the south";
        } else {
            return "Hallway: You are in a dimly lit hallway. There are doorways to the east and west and a dark room to the south.";
        }
    },
      actions: {
        east: "kitchen",
        west: "storeroom",
        south: "start"
      },
    },


    // Store Room
    storeroom: {
        description: "Store Room: You are in a cellar store room. There are a number of run-down barrels within the room and a door leading east.",
        objects: {
            barrels: {
                description: "You found a lantern, it's old but it might be useful. Take it?",
                break: () => {
                    return "You found a lantern, it's old but it might be useful. Take it?";
                },       
            },
            barrel: {
                description: "You found a lantern, it's old but it might be useful. Take it?",
                break: () => {
                    return "You found a lantern, it's old but it might be useful. Take it?";
                },
            },
            lantern: {
                description: "An old lantern. Still has some fuel left in it.",
                take: () => { 
                    takeItem('lantern');
                },
            },
        },
       actions: {
          east: "hallway",
        },
      },

    
    // Kitchen
    kitchen: {
      description: "Kitchen: You are in a dusty kitchen, full of rotting food. There is a key on the table and a door leading west.",
      objects: {
        food: {
            description: "Rotten food, who would eat this?",
            take: () => {
                takeItem('food');
            },
        },
        key: {
            description: "A small brass key.",
            take: () => {
                takeItem('key');
            },
        },
      },
      actions: {
        west: "hallway",
      },
    },
    // Markecenter
    marketcenter: {
        description: "Market Center: This is the market center description",
        actions: {
  
        },
    },
    
  };


//**************************//
//      ROOM MODIFIERS     //
//************************//

// Start room locked door
rooms.start.actions.south = () => {
    if (doorBroken) {
        printOutput("The broken hatch door hangs loosely. You push it aside and enter an alleyway.");
        return "alleyway";
    }
    if (inventory.key) {
        printOutput("The hatch door creaks open. You unlock it with the key and enter an alleyway.");
        return "alleyway";
    } else {
        printOutput("You find a hatch door, it's locked.");
        return null;
    }
};

// Alley End Combat
rooms.alleyend.actions.south = () => {
    if (wonOrcCombat || foodGiven || sneakSuccessful) {
        return "marketplace";
    } else {
        if (!inCombat && !attemptedSouth) {
            // First time attempting to go south
            attemptedSouth = true;
            printOutput("You'll alert the half-orc. Find a way around or deal with him. (moving south will engage in combat)");
        } else {
            // Second time or more, enter combat
            startCombat();
            printOutput("The half-orc notices you, and the combat begins!")
        }
        return null;
    }
};


//**************************//
//     OBJECT FUNCTIONS    //
//************************//


// Function to add item to inventory
function takeItem(item) {
    const inventorySize = Object.keys(inventory).length;
    const maxInventorySize = 5;
    
    // Checks for inventory limit
    if (inventorySize < maxInventorySize) {
        
        // Following only happens if item is not in inventory
        // Descriptions are used later for an "if" in the object handler
        if (!inventory[item]) {
            if (item === 'sword') {
                inventory[item] = {
                    description: "A quality sword.",
                };
                printOutput(`Under some books you find a sword. Truly mighty.`);
                increaseScore(10);
                updateCounters();
            } else if (item === 'lantern') {
                inventory[item] = {
                    description: "An old lantern. Still has some fuel left in it.",
                };
                printOutput(`You take the lantern and turn it on.`);
                increaseScore(10);
                updateCounters();
            } else if (item === 'food') {
                inventory[item] = {
                    description: "Rotten food. Who would eat this?",
                };
                printOutput(`You take the ${item}.`);
            } else if (item === 'key') {
                inventory[item] = {
                    description: "A small brass key.",
                };
                printOutput(`You take the ${item}.`);
            } else if (item === 'note') {
                inventory[item] = {
                    description: '<strong>A note signed "Proctor Torkka": "Welcome to Sigil! It seems you found a portal here, through the machinations of The Lady of Pain, don\'t panic. There\'s plenty of food and supplies available. Come find me when you can."</strong>',
                };
                printOutput(`You take the ${item}.`);
            } else {
                printOutput(`Cannot take the ${item}.`);
            }
        } 
    } else {
        printOutput(`Your inventory is full. You cannot take the ${item}.`);
    }
}



// Function to give food, removes from inventory (Only really applies in the Alley End)
function giveFood() {
    if (inventory.food && !foodGiven) {
        printOutput("You give the rotten food to the half-orc. He takes it and nods, allowing you to pass peacefully.");

        delete inventory.food;
        foodGiven = true;

    } else if (foodGiven) {
        printOutput("You already gave him food. The half-orc seems content.");
    } else {
        printOutput("You don't have any food to give.");
    }
}
//**************************//
//      GAME LOGIC: 1      //
//       GAME STATE       //
//************************//

//Globals
let currentRoom = rooms.start;
let moves = 0;
let playerScore = 0;
const inventory = {};
let sneakSuccessful = false;
let foodGiven = false;
let attemptedSouth = false;
let doorBroken = false;
let doneSecret = false;
let dropConfirmation = false;
let triedEating = false;

// Functions for the move and score counters
function updateCounters() {
    const movesInfoElement = document.getElementById('moves-info');
    movesInfoElement.innerHTML = `<p>Moves: ${moves}</p>`;
  
    const scoreInfoElement = document.getElementById('score-info');
    scoreInfoElement.innerHTML = `<p>Score: ${playerScore}</p>`;
}
function increaseScore(points) {
    playerScore += points;
}

// Function to display current room description
function displayRoom() {
    
    // Checks to see if descript is a function or regular.
    const description = typeof currentRoom.description === 'function'
        ? currentRoom.description() 
        : currentRoom.description;
    
    // Text styling within the CLI
    const descriptionParts = description.split(':');
    const boldText = `<strong>${descriptionParts[0]}</strong>`;
    const unboldedText = descriptionParts.slice(1).join('.');

    // Update the room info element (title bar)
    const roomInfoElement = document.getElementById('room-info');
    roomInfoElement.innerHTML = `<p>${boldText}</p>`;

    // Chapter 1 ending text
    if (currentRoom === rooms.marketplace) {
    setTimeout(() => {
        printOutput("<strong>...and you are totally lost</strong>");
        setTimeout(() => {
            printOutput("<strong>Chapter 1: END</strong>");
        }, 2000);
    }, 2000);
}

//     setTimeout(currentRoom = marketcenter, displayRoom(), 3000)


    printOutput(`${boldText}`);
    printOutput(`${unboldedText}`);
}


//**************************//
//      GAME LOGIC: 2      //
//        HANDLERS         //
//************************//

// Function to handle player move actions
function handleMovement(action) {
    if (combatLocked) {
        printOutput("You can't move during combat!");
        return;
    }

    if (currentRoom.actions[action]) {
        moves++;
        updateCounters();

        if ((action === 'south' || action === 'north' || action === 'east' || action === 'west') && currentRoom.actions[action] instanceof Function) {
            // If the action is 'south', 'north', 'east', or 'west' and it's a function, call the function
            const nextRoom = currentRoom.actions[action]();
            if (nextRoom) {
                currentRoom = rooms[nextRoom];
                displayRoom();
            }
        } else {
            // If it's a regular action, get the next room and update
            const nextRoom = rooms[currentRoom.actions[action]];
            currentRoom = nextRoom;
            displayRoom();
        }
    } else {
        printOutput(`There is nothing to your ${action}. Try again.`);
    }
}

function handleObjectInteraction(action, object) {
    if (inventory[object]) {
        const itemDescription = inventory[object].description;
        printOutput(`${itemDescription}`);
        return;
    }
    if (currentRoom.objects && currentRoom.objects[object]) {
        moves++;
        updateCounters();

        switch (action) {
            case 'take':
            case 'grab':
            case 'get':
            case 'pickup':
            case 'pick':
            case 'pick-up':
            case 'loot':
                if (currentRoom.objects[object].take) {
                    currentRoom.objects[object].take();
                } else {
                    printOutput("You can't take the " + object + ".");
                }
                break;

            case 'inspect':
            case 'read':
            case 'open':
            case 'examine':
            case 'check':
                printOutput(currentRoom.objects[object].description);
                break;

            case 'break':
            case 'destroy':
                if (currentRoom.objects[object].break) {
                if (object === 'hatch' && inventory.sword) {
                        printOutput(currentRoom.objects[object].breakWithSword());
                        doorBroken = true;
                            } else {
                                printOutput(currentRoom.objects[object].break());
                            }
                        } else {
                            printOutput(`You can't break the ${object}.`);
                        }
                        break;

            default:
                printOutput("I don\'t know that command for " + object + ". Try again.");
        }
    } else if (action && !object) {
        printOutput(action + " what? There was no object in that command.");
    } else {
        printOutput("There is no " + object + " to " + action + ".");
    }
}

function handleDrop(itemToDrop) {
    if (dropConfirmation) {
        // Confirmation is already requested, drop the item
        dropConfirmation = false;

        if (inventory[itemToDrop]) {
            printOutput(`You drop the ${itemToDrop}.`);
            delete inventory[itemToDrop];
            updateCounters();
        } else {
            printOutput(`You don't have ${itemToDrop} in your inventory.`);
        }
    } else {
        // Request confirmation for item drop
        printOutput(`Are you sure you want to drop the ${itemToDrop}? This item will be destroyed. Type 'drop [item name]' again to confirm.`);
        dropConfirmation = true;
    }
}

// Function to handle the sneak action
function handleSneak() {
    if (currentRoom.sneakAllowed && !currentRoom.sneakAttempted) {
        printOutput("You attempt to sneak quietly.");

        // Determine the outcome (50/50 chance)
        sneakSuccessful = Math.random() < 0.5;

        if (sneakSuccessful) {
            printOutput("Your sneaking is successful. You move quietly.");
            // Add any additional logic or effects for a successful sneak
        } else {
            printOutput("Oops! Your attempt to sneak fails. You make some noise.");
            // Add any additional logic or effects for a failed sneak
        }

        // Set the sneakAttempted flag to true
        currentRoom.sneakAttempted = true;

    } else if (!currentRoom.sneakAllowed) {
        printOutput("There is no need to sneak here");
    } else {
        printOutput("You already attempted to sneak in this room.");
    }
}

// Function to handle the speak action
function handleSpeak() {
    if (currentRoom === rooms.alleyend) {
        printOutput(rooms.alleyend.dialogue.default);
        // Add any additional logic for speaking in the alleyend room here
    } else {
        printOutput("You speak to yourself.");
    }
}
function handleEat(itemToEat) {
    if (inventory[itemToEat]) {
        if (itemToEat === 'food' && !triedEating) {
            printOutput(`You shouldn't eat the ${itemToEat}. It's rotten.`);
            triedEating = true;
            return;
        }
        if (itemToEat === 'note') {
            printOutput(`You eat the ${itemToEat}. Maybe you consume its knowledge. Probably not.`);
            delete inventory.note;
            return;
        }
        
        if (itemToEat === 'food' && triedEating) {
            printOutput(`Against warning. You eat the rotten food. It tastes terrible`);
            playerHealth -= 5;
            printOutput(`<strong>Player Health: ${playerHealth}</strong>`);
            triedEating = false;
            return;
        }
        else {
            printOutput(`You can't eat the ${itemToEat}.`);
        }
    } else {
        printOutput(`You don't have ${itemToEat} in your inventory.`);
    }
}


// Function for the "inventory" player action
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
//       GAME LOGIC: 3      //
//          COMBAT         //
//************************//

// Globals for combat
let playerHealth = 40;
let enemyHealth = 20;
let inCombat = false;
let wonOrcCombat = false;
let combatLocked = false;
let playerOutcome;
let enemyOutcome;

// Function to start combat
function startCombat() {
    printOutput("You are now in combat!");
    inCombat = true;
    combatLocked = true;
}

// Function to end combat
function endCombat() {
    inCombat = false;
    combatLocked = false;
}

// Function needed for the dice roll
function getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}

// Function for the main combat outcome logic
function determineCombatOutcome() {
    const playerRoll = getRandomNumber(4);
    const enemyRoll = getRandomNumber(4);

    // Determine player's outcome
    if (playerRoll >= 3) {
        if (playerRoll === 4) {
            playerOutcome = { result: 'critical hit', message: 'You scored a critical hit!' };
        } else {
            playerOutcome = { result: 'hit', message: 'You hit the enemy!' };
        }
    } else {
        playerOutcome = { result: 'miss', message: 'You missed the enemy.' };
    }

    // Determine enemy's outcome
    if (enemyRoll >= 3) {
        if (enemyRoll === 4) {
            enemyOutcome = { result: 'critical hit', message: 'Your enemy landed a critical hit!' };
        } else {
            enemyOutcome = { result: 'hit', message: 'Your enemy landed a hit.' };
        }
    } else {
        enemyOutcome = { result: 'miss', message: 'Your enemy missed.' };
    }
}

function calculateDamage(outcome, hasSword) {
    if (outcome.result === 'hit' || outcome.result === 'critical hit') {
        if (outcome.result === 'critical hit') {
            return hasSword ? 20 : 10; // Critical hit with sword deals 20 damage, without sword deals 10
        } else {
            return hasSword ? 10 : 5; // Regular hit with sword deals 10 damage, without sword deals 5
        }
    } else {
        return 0; // Miss or other outcomes result in 0 damage
    }
}

function updateHealth(playerOutcome, enemyOutcome) {
    const playerDamage = calculateDamage(playerOutcome, inventory.sword);
    const enemyDamage = calculateDamage(enemyOutcome, false);

    playerHealth -= enemyDamage;
    enemyHealth -= playerDamage;

    // Ensure health doesn't go below 0
    playerHealth = Math.max(playerHealth, 0);
    enemyHealth = Math.max(enemyHealth, 0);
   
    // Print player and enemy health
   printOutput(`<strong>Player Health: ${playerHealth} | Enemy Health: ${enemyHealth}</strong>`);

    if (playerHealth <= 20) {
        printOutput("You've become greatly wounded");
    }
    if (enemyHealth <= 5) {
        printOutput("Your enemy has become greatly wounded");
    }
}

// Function to handle combat actions 
function handleCombatAction() {
    if (inCombat) {
        determineCombatOutcome();

        // Update health based on the outcome
        updateHealth(playerOutcome, enemyOutcome);

        // Display the outcome
        printOutput(`${playerOutcome.message}`);
        printOutput(`${enemyOutcome.message}`);

        // Check if combat should end (e.g., player or foe health reaches 0)
        if (playerHealth <= 0 || enemyHealth <= 0) {
            endCombat();

            // Display a message based on winning or losing
            if (playerHealth <= 0) {
                printOutput("You have been defeated! Game Over.");
            } else {
                printOutput("Congratulations! You defeated the foe!");
                wonOrcCombat = true;
                displayRoom();
            }
        }
    } else {
        printOutput("You are not in combat.");
    }
}


//**************************//
//      GAME LOGIC: 4      //
//      CLI COMMANDS      //
//************************//

// Function to process user inputs 
// (often mainCommand is the players action and CommandArgs[1] is the object)
function processCommand(command) {
    if (playerHealth <= 0) {
        printOutput("You are dead. Game Over.");
        return;
    }

    printOutput(`>${command}`);
    const commandArgs = command.split(' ');
    const mainCommand = commandArgs[0].toLowerCase();
    
    switch (mainCommand) {
        case 'clear':
            clear();
            break;

        case 'go':
        case 'move':
            // CommandArgs[1] here is the direction
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
        case 'where':
        case 'look':
        case 'here':
        case 'see':
        case 'around':
        case 'surrounding':
        case 'surroundings':
            displayRoom();
            break;

        case 'inventory':
        case 'bag':
        case 'inv':
        case 'i':
            displayInventory();
            break;

        // Take
        case 'take':
        case 'grab':
        case 'get':
        case 'pickup':
        case 'pick':
        case 'pick-up':
        case 'loot':
        // Inspect
        case 'inspect':
        case 'open':
        case 'read':
        case 'check':
        case 'examine':
        // Break    
        case 'break':
        case 'destroy':
            handleObjectInteraction(mainCommand, commandArgs[1]);
            break;

        case 'drop':
        case 'trash':
        case 'remove':
        case 'delete':
            handleDrop(commandArgs[1]);
            break;

        case 'eat':
        case 'consume':
        case 'devour':
            handleEat(commandArgs[1]);
            break;
            
        case 'give':
        case 'hand':
        case 'throw':
            const objectToGive = commandArgs[1];
            if (currentRoom.objects && currentRoom.objects[objectToGive] && currentRoom.objects[objectToGive].give) {
            currentRoom.objects[objectToGive].give();
            } else {
            printOutput("You have nothing to give/throw or can't give/throw this item");
            }
            break;
                    
        case 'attack':
        case 'kill':
        case 'hit':
            if (currentRoom.combatAvailable) {
                startCombat();
            if (inCombat) {
                handleCombatAction();
                    }
            } else {
                printOutput("You cannot attack right now.");
                }
                break;

        case 'sneak':
        case 'hide':
        case 'stealth':
            handleSneak();
            break;
        
        case 'speak':
        case 'talk':
        case 'ask':
        case 'say':
        case 'chat':
            handleSpeak();
            break;

        case 'wait':
        case 'sleep':
        case 'rest':
            printOutput("Time passes but you are no closer to getting home.")
            break;

        case 'equip':
        case 'wield':
        case 'hold':
        case 'put-on':
            printOutput("No need to equip anything you can only fit 5 items in your bag.")
            break;
            
        case 'health':
        case 'hp':
        case 'hitpoints':
            printOutput(`<strong>Player Health: ${playerHealth}</strong>`)
            break;

        case 'help':
            printOutput ('<strong>If you need to go somewhere try commands like: </strong> north, south, east and west');
            printOutput('<strong>If you\'re lost try commands like: look, read, inspect, take, drop - followed by an object</strong');
            printOutput('verbs like give, speak, sneak, eat and attack can be useful');
            printOutput('<strong>You can look at your inventory with the "inventory", "bag", "inv" or simpily "i" commands</strong');
            printOutput('You may also want to see "help-combat"')
                break;
        
        case 'help-combat':
            printOutput('You can <strong>start combat</strong> with vaid targets with the commands like "attack, kill or hit"')
            printOutput('While in combat you <strong>cannot preform movements.</strong> use the "attack" command to roll for damage')
            printOutput('<strong>You can check your health with the "health", "hitpoints" or "hp" commands</strong>')
            break;

        case 'xyzzy':
            if (!doneSecret) {
            printOutput('I see you\'ve been here before...')
            increaseScore(10);
            updateCounters();
            doneSecret = true;
            }
            break;

        default:
            printOutput("I don\'t know that command. Try again.");
    }
}


//**************************//
//     INITIALIZE GAME     //
//************************//

document.getElementById('cli-container').style.display = 'none'

setTimeout(() => {
    displayRoom();
    updateCounters();
    document.getElementById('cli-container').style.display = 'block'
}, 5000); 

});
