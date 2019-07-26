const genUtils = require('../../command_utilities/general_utilities');
const ahm = require("../../command_utilities/achievement_handler");

const normalEmotes = [
    '😀', '😬', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😉',
    '😊', '🙂', '🙃', '☺', '😋', '😌', '😍', '😘', '😗', '😙',
    '😚', '😜', '😝', '😛', '🤑', '🤓', '😎', '🤗', '😏', '😶',
    '😐', '😑', '😒', '🙄', '🤔', '😳', '😞', '😟', '😠', '😡',
    '😔', '😕', '🙁', '☹', '😣', '😖', '😫', '😩', '😤', '😮',
    '😱', '😨', '😰', '😯', '😦', '😧', '😢', '😥', '😪', '😓',
    '😭', '😵', '😲', '🤐', '😷', '🤒', '🤕', '😴',
    '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
    '👏', '🖕', '👁', '👀', '🤠', '🤡', '🤢', '🤣', '🤤', '🤥',
    '🤧', '👮', '🚶', '🏃', '🐶', '🐱', '🐭', '🐹', '🐻', '🐵',
    '🐺', '⭐', '🦍', '🦊', '🍑', '🍆', '🥑', '🥚', '💎', '🔫',
    '💣', '⚔', '🛡', '☠', '💯', '❤', '💛', '💚', '💙', '💜',
    '☢', '♋', '❓', '💲', '💬', '🖤', '🅰', '🏳', '🌈'
]

const patterns = [

    //Block
    [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ],

    //Slab
    [
        [0, 0, 0],
        [0, 0, 0],
        [1, 1, 1]
    ],

    //Concrete
    [
        [1, 2, 2],
        [2, 2, 3],
        [3, 3, 3]
    ],

    //Beacon
    [
        [1, 1, 1],
        [1, 2, 1],
        [3, 3, 3]
    ],

    //Pickaxe
    [
        [1, 1, 1],
        [0, 2, 0],
        [0, 2, 0]
    ],

    //Bow
    [
        [0, 1, 2],
        [1, 0, 2],
        [0, 1, 2]
    ],

    //Fishing pole
    [
        [0, 0, 1],
        [0, 1, 2],
        [1, 0, 2]
    ],

    //Armor
    [
        [1, 1, 1],
        [1, 0, 1],
        [0, 0, 0]
    ],

    [
        [1, 0, 1],
        [1, 1, 1],
        [1, 1, 1]
    ],

    [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 1]
    ],

    [
        [0, 0, 0],
        [1, 0, 1],
        [1, 0, 1]
    ],

    [
        [0, 3, 0],
        [2, 1, 2],
        [1, 1, 1]
    ],

    //Original recipes
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],

    [
        [1, 2, 1],
        [2, 0, 2],
        [1, 2, 1]
    ],

    [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],

    [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ],

    [
        [1, 1, 1, 1, 1],
        [1, 2, 2, 2, 1],
        [1, 2, 0, 2, 1],
        [1, 2, 2, 2, 1],
        [1, 1, 1, 1, 1]
    ],

    [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 2, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0]
    ],

    [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
    ],

    [
        [1],
        [1],
        [1],
        [2],
        [2],
        [2],
        [1],
        [1],
        [1]
    ],

    [
        [2, 2],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [2, 2],
    ],

    [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ],

    [
        [0, 0, 0],
        [0, 0, 1],
        [0, 0, 2]
    ],

    [
        [1, 1, 1],
        [1, 2, 1],
        [1, 1, 1]
    ],

    [
        [0, 0, 3],
        [0, 2, 0],
        [1, 0, 0]
    ]

];



module.exports.run = async (bot, message, args) => {

    if (message.channel.type == "dm") {
        message.channel.send(`you can't craft without an audience, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let ingredientList = [];
    let ingredientListType;

    let diceRoll = Math.random() * 100;
    if (diceRoll > 50) ingredientListType = 1;
    else ingredientListType = 2;

    if (message.guild.emojis.size == 0) ingredientListType = 0; //ingredientListType 0 is only for servers that have no custom emojis

    switch (ingredientListType) {

        //Only default emotes
        case 0:
            ingredientList = normalEmotes.slice(0);
            break;

        //Only custom emotes
        case 1:
            let guildEmotes = message.guild.emojis.array();
            for (let i = 0; i < guildEmotes.length; i++) {
                ingredientList.push(guildEmotes[i]);
            }
            break;

        //Both
        case 2:
            ingredientList = normalEmotes.slice(0);
            let guildEmotes2 = message.guild.emojis.array();    //For some reason, javascript won't let me have guildEmotes in this case as well as
            for (let i = 0; i < guildEmotes2.length; i++) {     //the above case, so I have to make it guildEmotes2
                ingredientList.push(guildEmotes2[i]);
            }
            break;
    }

    let pattern = patterns[Math.floor(Math.random() * patterns.length)];
    let middleRow = Math.floor(pattern.length / 2);

    let emptySpace = message.guild.emojis.find(x => x.name === "emptySpace");
    if (!emptySpace) emptySpace = `⬛`;

    let ingredients = {};
    let recipeMsg = ``;

    for (let row = 0; row < pattern.length; row++) {

        for (let col = 0; col < pattern[row].length; col++) {

            if (pattern[row][col] == 0) {
                recipeMsg += `${emptySpace}`;
            }
            else {
                let curIngredient = ingredients[pattern[row][col]]; //curIngredient is the entry for whatever number ingredient we're on (like 0, 1, 2, etc)
                if (!curIngredient) {
                    let randomIngredient = Math.floor(Math.random() * ingredientList.length);
                    curIngredient = {emoji: ingredientList[randomIngredient]};
                    ingredients[pattern[row][col]] = curIngredient;
                }
                recipeMsg += `${curIngredient.emoji}`;
            }

        }

        //If this is the middle row, append the craft result part
        if (row == middleRow) recipeMsg += `   ➡   ${ingredientList[Math.floor(Math.random() * ingredientList.length)]}`;
        recipeMsg += `\n`;

    }

    message.channel.send(recipeMsg);
    
    genUtils.incrementUserDataValue(message.author, "itemsCrafted", 1, (newValue) => {
        if (newValue >= 500) {
            ahm.awardAchievement(message, ahm.achievement_list_enum.LOYAL_LABOURER);
        }
    });

}

module.exports.help = {
    name: "craft"
}