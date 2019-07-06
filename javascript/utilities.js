const fs = require("fs");



module.exports.getRandomNameInsult = function(user) {
    this.incrementUserDataValue(user, "socialDeviancy", 1);
    let nameInsults = fs.readFileSync("./data/general_data/list_of_names_to_insult_people_with.txt").toString().split("\n");
    for (let i = 0; i < nameInsults.length; i++) nameInsults[i] = nameInsults[i].substring(1);
    return nameInsults[Math.floor(Math.random() * nameInsults.length)];
}



module.exports.readJSONFile = function(fileDir, callback) {
    fs.readFile(fileDir, function readFileCallback(err, data) {
        if (err) {
            //console.error(err);
            let tempData = {}
            fs.writeFile(fileDir, JSON.stringify(tempData, null, 4), function (err) {
                if (err) throw err;
                callback(tempData);
            });
        }
        else {
            callback(JSON.parse(data, "utf8"));
        }
    });
}



module.exports.incrementUserDataValue = function(user, valueName, amount) {
    this.readJSONFile("./data/general_data/userData.json", function (userDataJson) {
        if (!userDataJson[user.id]) userDataJson[user.id] = {username: user.username};
        if (!userDataJson[user.id][valueName]) userDataJson[user.id][valueName] = 0;
        userDataJson[user.id][valueName] += amount;
        fs.writeFileSync("./data/general_data/userData.json", JSON.stringify(userDataJson, null, 4));
    });
}



module.exports.bequeathPowerfulStatus = function(guild, guildMember) {
    let powerfulRole = guild.roles.find("name", "Powerful");
    if (!powerfulRole) {
        guild.createRole({
            name: "Powerful",
            color: "RED",
            hoist: true,
            position: 1
        }).then(role => guildMember.addRole(role));
    }
    else {
        guildMember.addRole(powerfulRole);
    }
}



module.exports.getMostRecentImageURL = function(message) {

    return message.channel.fetchMessages({ limit: 10 })
    .then(messagesToCheck => {
        let validURL;

        for (let i = 0; i < messagesToCheck.size; i++) {

            let curMessage = messagesToCheck.array()[i];

            if (curMessage.attachments.size > 0) {
                let potentialImage = curMessage.attachments.last();

                //This is the only way I know of to check if an attachment is an image
                if (potentialImage.width != undefined && potentialImage.height != undefined) {
                    validURL = potentialImage.url;
                    break;
                }
            }

            if (curMessage.embeds.length > 0) {
                let potentialImage = curMessage.embeds[curMessage.embeds.length - 1];

                //If the embed contains an image, use that
                if (potentialImage.image != null) {
                    validURL = potentialImage.image.url;
                    break;
                }

                //Or, if the embed contains a url, use that
                else if (potentialImage.url != null) {
                    validURL = potentialImage.url;
                    break;
                }
            }

        }

        let errorMessage;

        if (!validURL) {
            errorMessage = `I didn't find any messages containing images whatsoever in the last ten messages, ${this.getRandomNameInsult(message.author)}`;
        }

        else if (validURL.match(/\.(jpeg|jpg|gif|png)(\?v=1)*$/) == null) {
            errorMessage = `The image url I found doesn't have a valid file extension. ${this.getRandomNameInsult(message.author)}`;
            validURL = null;
        }

        if (errorMessage) message.channel.send(errorMessage);

        return validURL;
    })
    .catch(console.error);

}



module.exports.sendGlobalMessage = function(bot, msg) {
    let guilds = bot.guilds;
    for (let i = 0; i < guilds.size; i++) {
        billBayou = guilds.array()[i].channels.find("name", "bill-bayou");
        if (!billBayou) {
            guilds.array()[i].createChannel('bill-bayou', { type: 'text' })
                .then(() => {
                    billBayou = guilds.array()[i].channels.find("name", "bill-bayou");
                    billBayou.send(msg);
                })
                .catch(console.error);
        }
        else {
            billBayou.send(msg);
        }
    }
}



module.exports.removeElementsFromArray = function(arrayToRemoveStuffFrom, stuffToRemove) {

    for (let i = 0; i < arrayToRemoveStuffFrom.length; i++) {
        for (let j = 0; j < stuffToRemove.length; j++) {
            if (arrayToRemoveStuffFrom[i] == stuffToRemove[j]) {
                arrayToRemoveStuffFrom.splice(i, 1);
            }
        }
    }

}