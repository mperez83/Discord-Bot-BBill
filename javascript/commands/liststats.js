const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/userData.json", function (userDataJson) {
        if (!userDataJson[message.author.id]) userDataJson[message.author.id] = {username: message.author.username};

        let statsString = "here are your stats:\n- - - - - - - - - -\n";
        propertyNames = Object.getOwnPropertyNames(userDataJson[message.author.id]);
        for (let i = 0; i < propertyNames.length; i++) {
            //console.log(propertyNames[i] + ": " + userDataJson[message.author.id][propertyNames[i]]);
            statsString = statsString.concat("**" + propertyNames[i] + ":** " + userDataJson[message.author.id][propertyNames[i]] + "\n");
        }
        statsString = statsString.concat("- - - - - - - - - -");
        message.reply(statsString);
    });
}

module.exports.help = {
    name: "liststats"
}