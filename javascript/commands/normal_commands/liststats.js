const utilitiesModule = require('../../utilities');

const dataLoc = "./data/general_data/userData.json";
const unnecessaryStats = ["nextValidPowerCheck", "username"];



module.exports.run = async (bot, message, args) => {

    let userToIdentify;

    //More than one parameter = abort
    if (args.length > 1) {
        message.channel.send(`Too many parameters, ${utilitiesModule.getRandomNameInsult(message.author)}`);
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
                return;
            }
        }

        //If the argument provided by the user isn't a mention
        else {
            message.channel.send(`You have to @ someone if you want their stats, ${utilitiesModule.getRandomNameInsult(message.author)}`);
            return;
        }

    }

    //No parameters = display stats of the user that did the call
    else {
        userToIdentify = message.author;
    }



    utilitiesModule.readJSONFile(dataLoc, function (userDataJson) {

        if (!userDataJson[userToIdentify.id]) userDataJson[userToIdentify.id] = {username: userToIdentify.username};

        let statsString;
        if (userToIdentify == message.author)
            statsString = `here are your stats:\n- - - - - - - - - -\n`;
        else
            statsString = `here are ${userDataJson[userToIdentify.id].username}'s stats:\n- - - - - - - - - -\n`;

        let propertyNames = Object.getOwnPropertyNames(userDataJson[userToIdentify.id]);

        utilitiesModule.removeElementsFromArray(propertyNames, unnecessaryStats);

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