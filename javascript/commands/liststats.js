const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/userData.json", function (userDataJson) {

        if (args.length == 0) {
            if (!userDataJson[message.author.id]) userDataJson[message.author.id] = {username: message.author.username};

            let statsString = "here are your stats:\n- - - - - - - - - -\n";
            propertyNames = Object.getOwnPropertyNames(userDataJson[message.author.id]);
            for (let i = 0; i < propertyNames.length; i++) {
                //console.log(propertyNames[i] + ": " + userDataJson[message.author.id][propertyNames[i]]);
                statsString = statsString.concat("**" + propertyNames[i] + ":** " + userDataJson[message.author.id][propertyNames[i]] + "\n");
            }
            statsString = statsString.concat("- - - - - - - - - -");
            message.reply(statsString);
        }
        else if (args.length == 1) {
            if (message.mentions.length == 1) {
                /*let mentionedUserID = message.mentions.users.first().id;
                //if (!userDataJson[mentionedUserID]) userDataJson[mentionedUserID] = {username: message.mentions.users.first().username};

                let statsString = "here is " + userDataJson + " stats:\n- - - - - - - - - -\n";
                propertyNames = Object.getOwnPropertyNames(userDataJson[message.author.id]);
                for (let i = 0; i < propertyNames.length; i++) {
                    //console.log(propertyNames[i] + ": " + userDataJson[message.author.id][propertyNames[i]]);
                    statsString = statsString.concat("**" + propertyNames[i] + ":** " + userDataJson[message.author.id][propertyNames[i]] + "\n");
                }
                statsString = statsString.concat("- - - - - - - - - -");
                message.reply(statsString);*/
            }
            else {
                message.channel.send("You have to @ someone if you want their stats, " + utilitiesModule.getRandomNameInsult());
            }
            console.log(args);
        }
        else {
            message.channel.send("Too many parameters, " + utilitiesModule.getRandomNameInsult());
        }

    });
}

module.exports.help = {
    name: "liststats"
}