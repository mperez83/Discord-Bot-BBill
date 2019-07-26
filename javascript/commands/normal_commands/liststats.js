const genUtils = require('../../command_utilities/general_utilities');
const ahm = require("../../command_utilities/achievement_handler");

const dataLoc = "./data/general_data/user_data.json";
const unnecessaryStats = ["nextValidPowerCheck", "username", "asciiTyped"];



module.exports.run = async (bot, message, args) => {

    let userToIdentify;

    //More than one parameter = abort
    if (args.length > 1) {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    //One parameter = display stats of whoever they mention (check if they mentioned anyone)
    else if (args.length == 1) {

        //If the argument provided by the user is a mention
        if (message.mentions.users.size == 1) {
            userToIdentify = message.mentions.users.first();

            //If the user tries to put themself in as an argument
            if (userToIdentify.id == message.author.id) {
                message.channel.send(`what the fuck are you doing`);
                return;
            }

            //If the user tries to put big bill in as an argument
            if (userToIdentify.id == bot.user.id) {
                message.channel.send(`don't do that what the fuck`);
                ahm.awardAchievement(message, ahm.achievement_list_enum.FAULTY_SLEUTH);
                return;
            }
        }

        //If the argument provided by the user isn't a mention
        else {
            message.channel.send(`You have to @ someone if you want their stats, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }

    }

    //No parameters = display stats of the user that did the call
    else {
        userToIdentify = message.author;
    }



    genUtils.readJSONFile(dataLoc, (userDataJson) => {

        if (!userDataJson[userToIdentify.id]) userDataJson[userToIdentify.id] = {username: userToIdentify.username};

        let statsString;
        if (userToIdentify == message.author)
            statsString = `here are your stats:\n- - - - - - - - - -\n`;
        else
            statsString = `here are ${userDataJson[userToIdentify.id].username}'s stats:\n- - - - - - - - - -\n`;

        let propertyNames = Object.getOwnPropertyNames(userDataJson[userToIdentify.id]);

        genUtils.removeElementsFromArray(propertyNames, unnecessaryStats);

        propertyNames.sort();
        for (let i = 0; i < propertyNames.length; i++) {
            statsString = statsString.concat(`**${propertyNames[i]}:** ${userDataJson[userToIdentify.id][propertyNames[i]]}\n`);
        }
        statsString = statsString.concat(`- - - - - - - - - -`);

        message.reply(statsString);

    });
    
}

module.exports.help = {
    name: "liststats"
}