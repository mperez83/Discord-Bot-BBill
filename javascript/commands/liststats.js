const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/userData.json", function (userDataJson) {

        if (args.length == 0) {
            if (!userDataJson[message.author.id]) userDataJson[message.author.id] = {username: message.author.username};

            let statsString = "here are your stats:\n- - - - - - - - - -\n";
            propertyNames = Object.getOwnPropertyNames(userDataJson[message.author.id]);
            propertyNames.sort();
            for (let i = 0; i < propertyNames.length; i++) {
                //console.log(propertyNames[i] + ": " + userDataJson[message.author.id][propertyNames[i]]);
                statsString = statsString.concat("**" + propertyNames[i] + ":** " + userDataJson[message.author.id][propertyNames[i]] + "\n");
            }
            statsString = statsString.concat("- - - - - - - - - -");
            message.reply(statsString);
        }
        else if (args.length == 1) {
            if (message.mentions.users.size == 1) {
                let mentionedUserID = message.mentions.users.first().id;

                if (mentionedUserID == message.author.id) {
                    message.channel.send("what the fuck are you doing");
                    return;
                }

                if (mentionedUserID == bot.user.id) {
                    message.channel.send("don't do that what the fuck");
                    return;
                }

                if (!userDataJson[mentionedUserID]) {
                    message.channel.send("That user isn't in my database yet!!! Tell them to do some shit first. " + utilitiesModule.getRandomNameInsult());
                    return;
                }

                let statsString = "here are " + userDataJson[mentionedUserID].username + "'s stats:\n- - - - - - - - - -\n";
                propertyNames = Object.getOwnPropertyNames(userDataJson[mentionedUserID]);
                propertyNames.sort();
                for (let i = 0; i < propertyNames.length; i++) {
                    statsString = statsString.concat("**" + propertyNames[i] + ":** " + userDataJson[mentionedUserID][propertyNames[i]] + "\n");
                }
                statsString = statsString.concat("- - - - - - - - - -");
                message.reply(statsString);
            }
            else {
                message.channel.send("You have to @ someone if you want their stats, " + utilitiesModule.getRandomNameInsult());
            }
        }
        else {
            message.channel.send("Too many parameters, " + utilitiesModule.getRandomNameInsult());
        }

    });
}

module.exports.help = {
    name: "liststats"
}