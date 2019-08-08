const genUtils = require(`../../command_utilities/general_utilities`);
const recipesJSON = require(`./craft_recipes.json`);



module.exports.run = async (bot, message, args) => {

    let ingredientList = [];
    let ingredientListType;

    let diceRoll = Math.random() * 100;
    if (diceRoll > 50) ingredientListType = 1;
    else ingredientListType = 2;

    if (message.channel.type == "dm" || message.guild.emojis.size == 0) ingredientListType = 0;

    switch (ingredientListType) {

        //Only default emotes
        case 0:
            ingredientList = genUtils.normalEmotes.slice(0);
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
            ingredientList = genUtils.normalEmotes.slice(0);
            let guildEmotes2 = message.guild.emojis.array();    //For some reason, javascript won't let me have guildEmotes in this case as well as
            for (let i = 0; i < guildEmotes2.length; i++) {     //the above case, so I have to make it guildEmotes2
                ingredientList.push(guildEmotes2[i]);
            }
            break;
    }

    let pattern = recipesJSON.patterns[Math.floor(Math.random() * recipesJSON.patterns.length)];
    let middleRow = Math.floor(pattern.length / 2);

    let emptySpace;
    if (message.channel.type != "dm") emptySpace = message.guild.emojis.find(x => x.name === "emptySpace");
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

}

module.exports.help = {
    name: "craft",
    description: "Composes a random crafting recipe out of the available emotes",
    usage: "!craft",
    example: "!craft",
    funFacts: [
        "Craft has a 1/3 chance of using only default face emojis, a 1/3 chance of using only custom server emojis, and a 1/3 chance of using both. \
        If the server has no emotes, or if the call is through a DM to Big Bill, he'll always only use default face emojis."
    ]
}