//**************************//
//  LISTNERS AND CLI HTML  //
//************************//

// DOM
document.addEventListener('DOMContentLoaded', function () {
    
// CLI Element IDs    
const cliContainer = document.getElementById('cli-container');
const cliPrompt = document.getElementById('cli-prompt');
const cliInput = document.getElementById('cli-input');
const cliContent = document.getElementById('cli-content');
const customCaret = document.createElement('div');
customCaret.className = 'custom-caret';

// Listeners
cliInput.addEventListener('keydown', handleInput);
cliInput.addEventListener('input', updateCaret);
cliInput.addEventListener('focus', updateCaret);
window.addEventListener('resize', updateCaret);

cliContent.onclick = function() {
    cliInput.focus();
    console.log("it clicked")
};


//**************************//
//      CLI FUNCTIONS      //
//************************//
const initialPosition = cliPrompt.getBoundingClientRect().right + 5;
cliInput.parentElement.appendChild(customCaret);
updateCaret();

// Function to handle Enter key press
function handleInput(event) {
    if (event.key === 'Enter') {
      processCommand(cliInput.value.trim());
      cliInput.value = '';
      cliInput.setSelectionRange(initialPosition, initialPosition);
      updateCaret();
    }
  }

function getTextWidth(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = getComputedStyle(cliInput).font;
    return context.measureText(text).width;
  }

function updateCaret() {
    const inputRect = cliInput.getBoundingClientRect();
    const textBeforeCaret = cliInput.value.substring(0, Math.min(cliInput.selectionStart, 40)); 
    const textWidth = getTextWidth(textBeforeCaret);

    customCaret.style.left = `${inputRect.left + window.scrollX + textWidth}px`;
    customCaret.style.top = `${inputRect.top + window.scrollY}px`;
  }

cliInput.parentElement.appendChild(customCaret);
updateCaret();

// Function to display new message
function printOutput(message) {
    const outputContainer = document.createElement('div');
    outputContainer.innerHTML = message;

    // Append the new message to the content div
    document.getElementById('cli-content').appendChild(outputContainer);

    // Scrolling to the bottom
    cliContent.scrollTop = cliContent.scrollHeight;
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
        displayRoom();
    });
  }


//**************************//
//          ROOMS          //
//************************//

const rooms = {
        
// Game Start / Dark Room / Study
start: {
    description: () => {
        if (inventory.lantern) {
            return "Study: With your lantern illuminating the surroundings you can see this, once dark room, was working as someone's study. Many books are strewn about, in piles and scattered. There is a cellar hatch to the south.";
        } else if (inventory.note) {
            return "Dark Room: You are in a dark room, with a dilapidated desk. Light partially peaks in from a north hallway.";
        } else
            return "Dark Room: You are in a dark room, with a dilapidated desk. There is a weathered note on it. Light partially peaks in from a north hallway.";
        
    },
    objects: {
        note: {
            description: '<strong>"Welcome to Sigil! It seems you found a portal here, through the machinations of The Lady of Pain, don\'t panic. There\'s plenty of food and supplies available. Come find me when you can."</strong> The note is signed <strong>"Factotum Torkka"</strong>.',
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
            description: "A quality sword",
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
    battle: (lastword) => {
        if (!inCombat) {

        switch(lastword) {
            case "myself":
            case "me":
            case "self":
                startCombat();
                enemyHealth = 'Your own despair'
                enemyBaseDamage = 0
         }
    }
        playerHealth = 0
},
    actions: {
        north: "hallway",
        south: "alleyway",
    },
},


    // Alleyway
    alleyway: {
        description: () => { 
        if (alreadyBeenAlleyway) {
            return "Alleyway: You are in the alley you came from originally which stretches further south. To the north is the cellar."
        } else {
            alreadyBeenAlleyway = true
            return "Alleyway: You are in an alleyway, It appears you're in a large city. You see countless blocks of foreign architecture, and larger mismatched structures. The city seems to wrap - above you, even. The alley stretches further ahead. South, you see a dark-iron clad figure, slouched and wailing maddeningly. Behind you, north, is the cellar."
        }
    },
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
                return "Alley End: The half-orc, now dead, lies lifeless on the ground. Tucked under his garb, a brass crest, draws your attention. You can proceed freely to the south, where you see a busy thoroughfare.";
            } else {
                return "Alley End: Now visible, the figure is a half-orc. He's either unaware or too deranged to notice your presence. Though charging past him might change that. To the south, you see a busy thoroughfare.";
            }
        },
        objects: {
            food: {
                give: () => {
                    giveFood();
                },
            },
            crest: {
                description: "A strange crest bearing the markings of a cowl or helmet of some-kind.",
                take: () => {
                    takeItem('crest');
                },
            },
            "half-orc": {
                description: "A large half-orc, clad in dark-iron armor with some-kind of crest on it. He looks confused, or hungry",
            },
        },
        actions: {
            north: "alleyway",
            south: "marketcenter",
        },
        battle: (lastword) => {
                if (!wonOrcCombat && !inCombat) {

                switch(lastword) {
                    case "half-orc":
                    case "halforc":
                    case "orc":
                        startCombat();
                        enemyBaseDamage = 5
                        enemyHealth = 20
                 }
            }
                if (enemyHealth <= 0) {
                    endCombat();
                    printOutput("<strong>Congratulations! You defeated the half-orc!</strong>");
                    wonOrcCombat = true;
                    displayRoom();
                    updateGP(2);
                }
        },
        dialogue: {
            default: () => {
                if (wonOrcCombat) {
                return null
            } else
                showResponses = true
                return 'You catch the half-orcs attention. The half-orc speaks: <strong>Berk! Where\'d you come from? No matter, nothing no-matters-not in this nonsense. It\'s all chaos and i\'m hungry, no coin for The Pit. You have snack or are you my food?</strong>' 
            },

            response1: "1. Offer him some food.",
            response2: "2. Threaten him.",
            response3:'3. Ask him what "The Pits" are',
            response4: "4. Ignore him and leave",
            
            outcome1: () => { 
                if (inventory.food) {
                    rooms.alleyend.objects.food.give();
                    return "You offer him some food."
                } else 
                    return "You have no food to give"
            },
            outcome2: () => {
               startCombat();
                return  "You threaten the half-orc. He eyes you warily."
            },
            outcome3: () => { return '<strong> "The Grease Pits. Only-be the best eats this side of the..."</strong> He pauses, lost in thought, and grestures to form a circle. <strong>"Wait...do circles have sides?</strong>' },
            outcome4: () => { return "You ignore the half-orc and leave." },
        },
        sneakAllowed: true,
        sneakAttempted: false,
    },


    // Market Center
    marketcenter: {
        description: () => {
            if (alreadyBeenMarket) {
                return "Market Center: You are in a dense, chimeric crowd. A young man clutches his coinpurse. It appears he's been pickpocketed - best not hang around. The market continues to your east and west. A tired ivory structure towers over you to the south."
            } else {
                alreadyBeenMarket = true
                return  "Market Center: The street is lit by the neon glow of jarred will'o'wisps adorned to shoddy stalls and patchworked tents. The market continues to your east and west. A tired ivory structure towers over you to the south."
            }
         },dialogue: {
            default: () => {
                showResponses = true
                return 'You approch a young man. His eyes surveil the crowded streets, he turns to you. <strong>"What do you want? Can\'t you see I\'ve lost everything!"</strong>'
            },

            response1: "1. Offer him help",
            response2: '2. Give him gold (100GP)',
            response3: "3. ",
            response4: "4. Ignore him and leave",
            
            outcome1: () => { return '<strong>You can help by tracking down that thief. I saw someone running west!</strong>' },
            outcome2: () => { 
                if (GP >= 100) {
                    GP - 100
                    return '<strong>I don\'t know how to thank you, stranger. You\'ve done a kind thing.</strong>'
                } else return 'You don\'t have enough gold.'
            },
            outcome3: () => { return ' '},
            outcome4: () => { return "You ignore the poor man - better things to do" },
        },
        actions: {
            east: "marketeast",
            west: "marketwest",
            south: "gatehouse",
            north: "alleyend",

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
    description: () => {
        if (inventory.key) {
            return "Kitchen: You are in a dusty kitchen, full of rotting food. There is a door leading west.";
        } else {
            return "Kitchen: You are in a dusty kitchen, full of rotting food. There is a key on the table and a door leading west.";
        }
    },
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
 
    
    //Market East
    marketeast: {
        description: () => {
            if (alreadyBeenMarketEast && !wonDevilCombat) {
                return "Market East: You are on the east-side of the night market. There's a devil running a stand littered with otherwordly materials. You hear a rabbling of aggravated voices to your north. To the south delicious smells grab at your sense"
            } else if (alreadyBeenMarketEast && wonDevilCombat) {
                return "Market East: You are on the east-side of the night market. Scorch marks are left on the cobblestone where the devil's shop once stood. It seems he left behind a cortex of a Modron in his hurry. You hear a rabbling of aggravated voices to your north. To the south delicious smells grab at your sense"
            } else {
                alreadyBeenMarketEast = true
                return 'Market East: You are on the east-side of the night market. These vendor booths appear to unfold and construct themselves out of thin air. A devil running a stand littered with otherwordly materials, beckons you.'
            }
         },
         objects: {
            "devil": {
                description: "A red-tinted devil running a stand of various strange items. Though he gives off a strong presence, he doesn't seem like he'd put up a fight.",
                enemyBaseDamage: 0,
                enemyHealth: 666,
            },
            cortex: {
                description: "A modron cortex.",
                take: () => {
                    takeItem('cortex');
                },
            },
         },
         battle: (lastword) => {
            if (!wonDevilCombat && !inCombat) {

            switch(lastword) {
                case "devil":
                case "vendor":
                case "merchant":
                    startCombat();
                    enemyBaseDamage = 0
                    enemyHealth = 666
                    printOutput(`<strong>Player Health: ${playerHealth} | Enemy Health: ${enemyHealth}</strong>`);
                    printOutput("The devil desolves into a fiery display. His shop folds, shrinks then disappears before your eyes.")
                    
                    enemyHealth = 0
                    if (enemyHealth <= 0) {
                        endCombat();
                        printOutput("<strong>Congratulations! You attacked a planer being with minimal consequences</strong>")
                        wonDevilCombat = true;
                        increaseScore(10);
                        displayRoom();
                    }
             }
        }
    },
         dialogue: {
            default: () => {
                if (wonDevilCombat) {
                return null
            } else
                showResponses = true
                return '<strong>"You there! Berk, Did you just get here? Got any coins from...Where ever you came from? I got quality Modron cortices or would you care for some wyvern teeth?</strong>'
            },

            response1: "1. Ask where he came from.",
            response2: '2. Ask what a "Modron" even is.',
            response3: "3. Ask for directions.",
            response4: "4. Ignore him and leave",
            
            outcome1: () => { return '<strong>"The Nine Hells, of course. What, did you not see the horns?"</strong> He motions over his jagged appendages <strong>"Or do you mean my shop, \'cus that\'s, simply, an \'ol trick of the tade - pocket dimensions.</strong>' },
            outcome2: () => { return '<strong>"You\'ve never seen a Modron? Little, nigh-immortal, mechanical fuckers. Supposed to uphold the principles of law and order. Next you\'re gonna tell me you don\'t have a portal key"</strong> he lets out a hearty laugh, then turns stern <strong>"Or worse you\'re gonna tell you don\'t have any coins"</strong>'},
            outcome3: () => { return '<strong>Do I look like a tout, outsider? There\'s very little gain to be made in guide work. Take your tourism to The Smoldering Corpse bar. There\'s bound to be a tout there."</strong> He extends his arm in the north-ward direction <strong>"Good luck finding one that\'s not a drunkerd or a cutpurse though..."</strong>'},
            outcome4: () => { return "You ignore the devil - better things to do."},
        },
        actions: {
            west: "marketcenter",
            north: "northeastalleyway",
        },
    },


    marketwest: {
        description: "Market West: You are on the west-side of the night market. ",
         objects: { 
            axe: {
                description: "Its an axe.",
                buy: () => {
                    buyItem('axe')
            },

         },
        },
         dialogue: {
            default: () => { 
                showResponses = true
                return '<strong></strong>'
            },

            response1: "1. Buy Items",
            response2: '2. Sell Items',
            response3: "3. ",
            response4: "4. ",
            
            outcome1: () => { return 'I have an axe';},
            outcome2: () => { return ' '},
            outcome3: () => { return ' '},
            outcome4: () => { return " "},
        },
        actions: {
            east: "marketcenter",
            north: "northeastalleyway",
        },
    },
};



//**************************//
//      ROOM MODIFIERS     //
//************************//

//Global flags for rooms
let sneakSuccessful = false;
let foodGiven = false;
let attemptedSouth = false;
let doorBroken = false;
let doneSecret = false;
let dropConfirmation = false;
let triedEating = false;
let showResponses = false;
let alreadyBeenMarket = false;
let alreadyBeenMarketEast = false;
let alreadyBeenAlleyway = false;

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
        return "marketcenter";
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
        
        // The following only happens if item is not in inventory
        // Descriptions are used later for an "if" in the object handler
        if (!inventory[item]) {
            if (item === 'sword') {
                inventory[item] = {
                    description: "A quality sword.",
                    damage: 10
                };
                printOutput(`Under some books you find a sword. Truly mightier.`);
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
                    description: '<strong>A note signed "Factotum Torkka": "Welcome to Sigil! It seems you found a portal here, through the machinations of The Lady of Pain, don\'t panic. There\'s plenty of food and supplies available. Come find me when you can."</strong>',
                };
                printOutput(`You take the ${item}.`);
            } else if (wonOrcCombat && item === 'crest') {
                inventory[item] = {
                    description: "A strange crest bearing the markings of a cowl or helmet of some-kind.",
                };
                printOutput(`You take the ${item}.`);
            } else if (wonDevilCombat && item === 'cortex') {
                inventory[item] = {
                    description: "A Modron cortex.",
                };
                printOutput(`You take the ${item}.`);
            }
            else {
                printOutput(`Cannot take the ${item}.`);
            }
        } 
    } else {
        printOutput(`Your inventory is full. You cannot take the ${item}. Maybe you should leave some items behind`);
    }
}


// Function to give food, removes from inventory (Only really applies in the Alley End)
function giveFood() {
    if (inventory.food && !foodGiven) {
        printOutput("You give the rotten food to the half-orc. He takes it and nods, allowing you to pass peacefully.");

        delete inventory.food;
        foodGiven = true;
        increaseScore(10);

    } else if (foodGiven) {
        printOutput("You already gave him food. The half-orc seems content.");
    } else {
        printOutput("You don't have any food to give.");
    }
}

// Function to sell item
function sellItem(item) {
    const itemInfo = inventory[item];

    if (itemInfo) {
        const sellPrice = calculateSellPrice(item);

        // Add the sell price to the player's GP
        GP += sellPrice;

        // Remove the item from the inventory
        delete inventory[item];

        printOutput(`You sold the ${item} for ${sellPrice} GP.`);
    } else {
        printOutput(`You don't have the ${item} to sell.`);
    }
}

// Function to buy an item
function buyItem(item) {
    const itemCost = calculateBuyCost(item);

    if (GP >= itemCost) {
        // Subtract the item cost from the player's GP
        GP -= itemCost;

        // Add the item to the inventory
        inventory[item] = true; // You can set it to true or a specific value based on your needs

        printOutput(`You bought ${item} for ${itemCost} GP.`);
    } else {
        printOutput(`You don't have enough GP to buy ${item}.`);
    }
}

// Function to adjust the sell price (this goes into sellItem function)
function calculateSellPrice(item) {

    const sellPrices = {
        sword: 15,
        lantern: 10,
        food: 1,
        key: 2,
        note: 1,
        crest: 10,
        cortex: 500,
    };

    return sellPrices[item] || 0;
}

function calculateBuyCost(item) {
    const buyPrices = {
        axe: 100,
    };

    return buyPrices[item] || 0;
}


//**************************//
//      GAME LOGIC: 1      //
//       GAME STATE       //
//************************//

//Globals for gamestate
let currentRoom = rooms.start;
let moves = 0;
let playerScore = 0;
const inventory = {};
let GP = 100


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

    printOutput(`${boldText}`);
    printOutput(`${unboldedText}`);
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

function updateGP(amount) {
    GP += amount;
    printOutput(`You've found coins!`)
    printOutput(`<strong>GP: ${GP}</strong>`)
}

function displayGP() {
    if (GP <= 0) {
        printOutput("Your coinpurse is empty")
        printOutput(`<strong>GP: ${GP}</strong>`)
    } else {
        printOutput("You look through your coinpurse to see an assortment of minted currency from elsewhere places.")
        printOutput(`<strong>GP: ${GP}</strong>`)
    }
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
        printOutput(`There is nothing to your ${action}.`);
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
            case 'accept':
            case 'capture':
            case 'collect':
            case 'have':
            case 'receive':
            case 'reach':
                if (currentRoom.objects[object].take) {
                    currentRoom.objects[object].take();
                } else {
                    printOutput("You can't take the " + object + ".");
                }
                break;

            case 'inspect':
            case 'open':
            case 'read':
            case 'check':
            case 'examine':
            case 'scan':
            case 'investigate':
            case 'observe':
            case 'study':
            case 'search':
                printOutput(currentRoom.objects[object].description);
                break;

            case 'break':
            case 'destroy':
            case 'bash':
            case 'crush':
            case 'smash':
            case 'wreck':
            case 'shatter':
                if (currentRoom.objects[object].break) {
                if (object === 'hatch' && inventory.sword) {
                        printOutput(currentRoom.objects[object].breakWithSword());
                        doorBroken = true;
                        increaseScore(10);
                            } else {
                                printOutput(currentRoom.objects[object].break());
                            }
                        } else {
                            printOutput(`You can't break the ${object}.`);
                        }
                        break;

            default:
                printOutput("I don\'t understand that command for " + object + ".");
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

        if (inventory[itemToDrop]) {
            printOutput(`You drop the ${itemToDrop}.`);
            delete inventory[itemToDrop];
            updateCounters();
        } else {
            printOutput(`You don't have ${itemToDrop} in your inventory.`);
        }
    } else {
        // Request confirmation for item drop
        printOutput(`Are you sure you want to discard the ${itemToDrop}? This item will be likely stop existing due to the nature of this place. Type 'discard [item name]' again to confirm.`);
        dropConfirmation = true;
    }
}
// Function to handle the sneak action
function handleSneak() {
    if (currentRoom.sneakAllowed && !currentRoom.sneakAttempted) {
        printOutput("You attempt to sneak quietly.");
        updateCounters();

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

function handleEat(itemToEat) {
    if (inventory[itemToEat]) {
        if (itemToEat === 'food' && !triedEating) {
            printOutput(`You shouldn't eat the ${itemToEat}. It's rotten.`);
            triedEating = true;
            return;
        }
        if (itemToEat === 'note') {
            printOutput(`You eat the ${itemToEat}. Maybe you consume it's knowledge. Probably not.`);
            delete inventory.note;
            return;
        }
        
        if (itemToEat === 'food' && triedEating) {
            printOutput(`Against warning. You eat the rotten food. It tastes terrible`);
            playerHealth -= 5;
            printOutput(`<strong>Player Health: ${playerHealth}</strong>`);
            delete inventory.food;
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

function handleGive(objectToGive) {
    if (currentRoom.objects && currentRoom.objects[objectToGive] && currentRoom.objects[objectToGive].give) {
        currentRoom.objects[objectToGive].give();
    } else {
        printOutput("You have nothing to give/throw or can't give/throw this item");
    }
}

// Function to handle the speak action
function handleSpeak() {
    if (currentRoom.dialogue) {
        printOutput(currentRoom.dialogue.default());

        if (showResponses) {
            printOutput(currentRoom.dialogue.response1);
            printOutput(currentRoom.dialogue.response2);
            printOutput(currentRoom.dialogue.response3);
            printOutput(currentRoom.dialogue.response4);
        } else {
            printOutput("You talk to yourself");
        }
    } else {
        printOutput("You talk to yourself");
    }
}

// Function to handle "1-4" after speaking
function outcomeResponse(mainCommand) {
    if (currentRoom.dialogue) {
        switch (mainCommand) {
            case "1":
                printOutput(currentRoom.dialogue.outcome1());
                break;
            case "2":
                printOutput(currentRoom.dialogue.outcome2());
                break;
            case "3":
                printOutput(currentRoom.dialogue.outcome3());
                break;
            case "4":
                printOutput(currentRoom.dialogue.outcome4());
                break;
            default:
                printOutput("I don't understand that command in this situation.");
        }
    } else {
        printOutput("I don't understand that command in this situation.");
    }
}



//**************************//
//       GAME LOGIC: 3      //
//          COMBAT         //
//************************//

// Globals for combat
let playerHealth = 40;
let enemyHealth = 20;
let enemyBaseDamage = 5;
let inCombat = false;
let wonOrcCombat = false;
let wonDevilCombat = false;
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
    currentRoom.combatAvailable = false
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
            playerOutcome = { result: 'critical hit', message: 'You scored a <strong>critical hit!</strong>' };
        } else {
            playerOutcome = { result: 'hit', message: 'You hit the enemy!' };
        }
    } else {
        playerOutcome = { result: 'miss', message: 'You missed the enemy.' };
    }

    // Determine enemy's outcome
    if (enemyRoll >= 3) {
        if (enemyRoll === 4) {
            enemyOutcome = { result: 'critical hit', message: 'Your enemy landed a <strong>critical hit!</strong>' };
        } else {
            enemyOutcome = { result: 'hit', message: 'Your enemy landed a hit.' };
        }
    } else {
        enemyOutcome = { result: 'miss', message: 'Your enemy missed.' };
    }
}

// Function to turn the hits into damage
function calculateDamage(outcome, item) {
    if (outcome.result === 'hit' || outcome.result === 'critical hit') {
        if (outcome.result === 'critical hit') {
            return item.damage * 2; // Critical hit deals double damage
        } else {
            return item.damage; // Regular hit deals normal damage
        }
    } else {
        return 0; // Miss or other outcomes result in 0 damage
    }
}

// Function to update health based on damage
function updateHealth(playerOutcome, enemyOutcome) {
    
    // Checks for the highest damage property in the players inventory
    const playerItemWithHighestDamage = Object.values(inventory).reduce((maxItem, currentItem) => {
        return currentItem.damage > (maxItem ? maxItem.damage : 0) ? currentItem : maxItem;
    }, null);
    
    const playerDamage = calculateDamage(playerOutcome, playerItemWithHighestDamage || { damage: 5 });
    const enemyDamage = calculateDamage(enemyOutcome, { damage: enemyBaseDamage });

    playerHealth -= enemyDamage;
    enemyHealth -= playerDamage;

    // Ensure health doesn't go below 0
    playerHealth = Math.max(playerHealth, 0);
    enemyHealth = Math.max(enemyHealth, 0);

    // Print player and enemy health
    printOutput(`<strong>Player Health: ${playerHealth} | Enemy Health: ${enemyHealth}</strong>`);

    if (playerHealth <= 20) {
        printOutput(getRandomString(playerWoundedMessages));
    }
    if (enemyHealth <= 5) {
        printOutput(getRandomString(enemyWoundedMessages));
    }
}

// Function to handle combat actions 
function handleCombatAction(lastword) {
    
  currentRoom.battle(lastword)

    if (inCombat) {
        determineCombatOutcome();

        // Update health based on the outcome
        updateHealth(playerOutcome, enemyOutcome);

        // Display the outcome
        printOutput(`${playerOutcome.message}`);
        printOutput(`${enemyOutcome.message}`);

        // Check if combat should end (e.g., player or foe health reaches 0)
        if (playerHealth <= 0) {
            endCombat();
            printOutput("You have been defeated! <strong>Game Over.</strong>");
        } else if (enemyHealth <=0) {
            currentRoom.battle(lastword)
        }

    }
}

function getRandomString(strings) {
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
}


const playerWoundedMessages = [
    "<strong>You've sustained an injury!</strong>",
    "<strong>You've got a flesh wound</strong>",
    "<strong>Your limbs are merely a suggestion of injury!</strong>",
    "<strong>It's more than a scratch, but you press on!</strong>",
    "<strong>Your resilience is tested; you've taken a hit!</strong>",
    "<strong>A minor setback; you carry on undeterred!</strong>",
    "<strong>You endure a blow, but your determination remains unwavering!</strong>",
    "<strong>Adversity strikes, but you stand tall!</strong>",
    "<strong>You've faced a challenge, but victory is still within reach!</strong>",
    "<strong>In the heat of battle, you've weathered an assault!</strong>",
    "<strong>Your tenacity is unbroken, despite the wounds!</strong>",
    "<strong>Even wounded, you fight on with unwavering resolve!</strong>"
];

const enemyWoundedMessages = [
    "<strong>Your enemy is severely wounded, but they fight on!</strong>",
    "<strong>Your enemy has a flesh wound</strong>",
    "<strong>Dire straits for your adversary; their strength wanes!</strong>",
    "<strong>Your foe is in a critical condition, yet defiance persists!</strong>",
    "<strong>The enemy's wounds are deep; their peril is evident!</strong>",
    "<strong>Your adversary faces a grave threat; their resilience falters!</strong>",
    "<strong>The enemy is on the brink of defeat; their desperation shows!</strong>",
    "<strong>Your foe struggles to endure; victory is slipping away!</strong>",
    "<strong>Your adversary is in desperate need of respite from the onslaught!</strong>",
    "<strong>The enemy's wounds are severe, and their defenses crumble!</strong>",
    "<strong>A critical blow to your opponent; their defeat is imminent!</strong>"
];


//**************************//
//      GAME LOGIC: 4      //
//      CLI COMMANDS      //
//************************//

// Function to process user inputs 
// (often mainCommand is the players action and commandArgs[1] is the object)
function processCommand(command) {
    if (playerHealth <= 0) {
        printOutput("You are dead. <stong>Game Over.</strong");
        return;
    }

    printOutput(`>${command}`);
    const commandArgs = command.split(' ');
    const lastWordIndex = commandArgs.length - 1;
    const lastWord = commandArgs[lastWordIndex].toLowerCase();
    
    for (let i = commandArgs.length - 1; i >=-1; i--) {
        commandArgs[i] = commandArgs[i].toLowerCase();

        switch (commandArgs[i]) {
        case 'clear':
            clear();
            i = -1; //break for loop
            break;

        case 'go':
        case 'move':
        case 'walk':
        case 'run':
        case 'jog':
        case 'stroll':
        case 'skip':
            // CommandArgs[1] here is the direction
            const direction = lastWord ? lastWord.toLowerCase() : '';
            handleMovement(direction);
            i = -1; //break for loop
            break;

        case 'north':i = 0; //break for loop
        case 'n':
            handleMovement('north');
            i = -1; //break for loop
            break;

        case 'east':
        case 'e':
            handleMovement('east');
            i = -1; //break for loop
            break;  

        case 'west':
        case 'w':
            handleMovement('west');
            i = -1; //break for loop
            break;   
                  
        case 'south':
        case 's':
            handleMovement('south');
            i = -1; //break for loop
            break;

        case 'room':
        case 'where':
        case 'look':
        case 'here':
        case 'see':
        case 'around':
        case 'surrounding':
        case 'surroundings':
        case 'notice':
        case 'view':
            displayRoom();
            i = -1; //break for loop
            break;

        case 'inventory':
        case 'bag':
        case 'inv':
        case 'gear':
            displayInventory();
            i = -1; //break for loop
            break;

        case 'gp':
        case 'goldpoints':
        case 'gold':
        case 'coins':
        case 'coin':
        case 'money':
        case 'currency':
            displayGP();
            i = -1; //break for loop
            break;

        // Take
        case 'take':
        case 'grab':
        case 'get':
        case 'pickup':
        case 'pick':
        case 'pick-up':
        case 'loot':
        case 'accept':
        case 'capture':
        case 'collect':
        case 'have':
        case 'receive':
        case 'reach':
        // Inspect
        case 'inspect':
        case 'open':
        case 'read':
        case 'check':
        case 'examine':
        case 'scan':
        case 'investigate':
        case 'observe':
        case 'study':
        case 'search':
        // Break    
        case 'break':
        case 'destroy':
        case 'bash':
        case 'crush':
        case 'smash':
        case 'wreck':
        case 'shatter':
            handleObjectInteraction(commandArgs[i], lastWord);
            i = -1; //break for loop
            break;

        case 'drop':
        case 'trash':
        case 'remove':
        case 'delete':
        case 'abandon':
        case 'dump':
        case 'release':
        case 'discard':
        case 'leave':
            handleDrop(lastWord);
            i = -1; //break for loop
            break;

        case 'eat':
        case 'consume':
        case 'devour':
        case 'bite':
        case 'ingest':
        case 'dine':
        case 'chew':
            handleEat(lastWord);
            i = -1; //break for loop
            break;
            
        case 'give':
        case 'hand':
        case 'throw':
        case 'donate':
        case 'provide':
        case 'deliver':
            handleGive(lastWord);
            i = -1; //break for loop
            break;
                    
        case 'attack':
        case 'kill':
        case 'hit':
        case 'assault':
        case 'beat':
        case 'harm':
        case 'charge':
        case 'hurt':
        case 'stab':
        case 'strike':
        case 'slap':
        case 'kick':
        case 'punch':
        case 'suicide':
        case 'sewerslide':
            handleCombatAction(lastWord);
            i = -1; //break for loop
            break;

        case 'sneak':
        case 'hide':
        case 'stealth':
        case 'creep':
        case 'evade':
            handleSneak();
            i = -1; //break for loop
            break;
        
        // To start the dialogue
        case 'speak':
        case 'talk':
        case 'ask':
        case 'say':
        case 'chat':
        case 'communicate':
        case 'voice':
        case 'whisper':
        case 'shout':
        case 'scream':
        case 'yell':
            handleSpeak(commandArgs[i]);
            i = -1; //break for loop
            break;
        // Player Options
        case '1':
        case '2':
        case '3':
        case '4':
            outcomeResponse(commandArgs[i]);
            i = -1; //break for loop
            break;

        case 'buy':
            buyItem(lastWord)
            i = -1; //break for loop
            break
        
        case 'wait':
        case 'sleep':
        case 'rest':
        case 'stay':
        case 'watch':
        case 'relax':
            printOutput("Time passes but you are no closer to getting home.")
            i = -1; //break for loop
            break;

        case 'equip':
        case 'wield':
        case 'hold':
        case 'put-on':
        case 'dress':
        case 'adorn':
            printOutput("No need to equip anything you can only fit 5 items in your bag.")
            i = -1; //break for loop
            break;
            
        case 'health':
        case 'hp':
        case 'hitpoints':
        case 'self':
        case 'person':
            printOutput(`<strong>Player Health: ${playerHealth}</strong>`)
            i = -1; //break for loop
            break;

        case 'help':
            printOutput ('<strong>If you need to go somewhere try commands like: </strong> north, south, east and west');
            printOutput('<strong>If you\'re lost try commands like: look, read, inspect, take, drop - followed by an object</strong');
            printOutput('verbs like give, speak, sneak, eat and attack can be useful');
            printOutput('<strong>You can look at your inventory with the "inventory", "bag", "inv" or simpily "i" commands</strong');
            printOutput('You may also want to see "help-combat"')
            i = -1; //break for loop
            break;
        
        case 'help-combat':
            printOutput('You can <strong>start combat</strong> with vaid targets with the commands like "attack, kill or hit"')
            printOutput('While in combat you <strong>cannot preform movements.</strong> use the "attack" command to roll for damage')
            printOutput('<strong>You can check your health with the "health", "hitpoints" or "hp" commands</strong>')
            i = -1; //break for loop
            break;

        case 'xyzzy':
            if (!doneSecret) {
            printOutput('I see you\'ve been here before...')
            increaseScore(10);
            updateCounters();
            doneSecret = true;
            }
            i = -1; //break for loop
            break;

        }
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