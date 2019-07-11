const utilitiesModule = require('../../utilities');
const ahm = require("../../achievementHandler");

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
        message.channel.send(`you can't craft without an audience, ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }

    if (message.guild.emojis.size == 0) {
        message.channel.send(`This server doesn't have any emojis, ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
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
                let curIngredient = ingredients[pattern[row][col]];
                if (!curIngredient) {
                    curIngredient = {emoji: message.guild.emojis.random()};
                    ingredients[pattern[row][col]] = curIngredient;
                }
                recipeMsg += `${curIngredient.emoji}`;
            }

        }

        //If this is the middle row, append the craft result part
        if (row == middleRow) recipeMsg += `   ➡   ${message.guild.emojis.random()}`;
        recipeMsg += `\n`;

    }

    message.channel.send(recipeMsg);
    
    utilitiesModule.incrementUserDataValue(message.author, "itemsCrafted", 1);
    if (utilitiesModule.getUserDataValue(message.author, "itemsCrafted")) {
        ahm.awardAchievement(message, ahm.achievement_list_enum.LOYAL_LABOURER);
    }

}

module.exports.help = {
    name: "craft"
}