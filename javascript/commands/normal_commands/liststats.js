const genUtils = require('../../command_utilities/general_utilities');



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



    message.channel.send(`This command needs to be updated to the new information read/write system :(`);

    /*genUtils.readJSONFile(dataLoc, (userDataJson) => {

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

    });*/
    
}

module.exports.help = {
    name: "liststats",
    description: "Lists all of a @'d user's stats, or the caller's stats if no user is provided",
    usage: "!liststats [user]",
    example: "!liststats @Star",
    funFacts: [
        "The whole idea of stats was created because I found the idea of users seeing other user's stats and not knowing how they got them to be endlessly amusing. \
        To this day, nobody has found out how to attain sin.",
        "There are an egregious amount of stats that can be acquired. None of them are intuitive."
    ]
}