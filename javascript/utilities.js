const fs = require("fs");

module.exports.getRandomNameInsult = function() {
    let nameInsults = fs.readFileSync("./data/list of names to insult people with.txt").toString().split("\n");
    for (let i = 0; i < nameInsults.length; i++) nameInsults[i] = nameInsults[i].substring(1);
    return nameInsults[Math.floor(Math.random() * nameInsults.length)];
}



module.exports.readJSONFile = function(fileDir, callback) {
    fs.readFile(fileDir, function readFileCallback(err, data) {
        if (err) {
            //console.error(err);
            let tempData = {}
            fs.writeFile(fileDir, JSON.stringify(tempData), function (err) {
                if (err) throw err;
                callback(tempData);
            });
        }
        else {
            callback(JSON.parse(data, "utf8"));
        }
    });
}
//This is just because incrementUserDataValue calls readJSONFile, but I don't know how to call a module.exports function in the same file
function temporaryReadJSONFile(fileDir, callback) {
    fs.readFile(fileDir, function readFileCallback(err, data) {
        if (err) {
            //console.error(err);
            let tempData = {}
            fs.writeFile(fileDir, JSON.stringify(tempData), function (err) {
                if (err) throw err;
                callback(tempData);
            });
        }
        else {
            callback(JSON.parse(data, "utf8"));
        }
    });
}

//checkNested checks a given json object for if it has a specific property
//I don't know why this shit works, I just found it online lmao
//This might not even be needed (see !index for where it could be used but isn't)
module.exports.checkNested = function(obj /*, level1, level2, ... levelN*/) {
    for (var i = 1; i < arguments.length; i++) {
        if (!obj.hasOwnProperty(arguments[i])) {
            return false;
        }
        obj = obj[arguments[i]];
    }
    return true;
}

module.exports.incrementUserDataValue = function(user, valueName, amount) {
    temporaryReadJSONFile("./data/userData.json", function (userDataJson) {
        if (!userDataJson[user.id]) userDataJson[user.id] = {username: user.username};
        if (!userDataJson[user.id][valueName]) userDataJson[user.id][valueName] = 0;
        userDataJson[user.id][valueName] += amount;
        fs.writeFileSync("./data/userData.json", JSON.stringify(userDataJson));
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
            errorMessage = `I didn't find any messages containing images whatsoever in the last ten messages, ${this.getRandomNameInsult()}`;
        }

        else if (validURL.match(/\.(jpeg|jpg|gif|png)(\?v=1)*$/) == null) {
            errorMessage = `The image url I found doesn't have a valid file extension. ${this.getRandomNameInsult()}`;
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



/*module.exports.checkAndUpdateIndexList = function(bot, indexListJson) {
    bot.guilds.array().forEach(function(guild) {
        if (!guild.channels.find("name", "big-bills-bot-chamber")) guild.createChannel("big-bills-bot-chamber", "text", [{
            id: guild.id,
            deny: ['SEND_MESSAGES']
          }]).then(chamberChannel => updateIndexList(chamberChannel, indexListJson));
        else updateIndexList(guild.channels.find("name", "big-bills-bot-chamber"), indexListJson);
    });
}
function updateIndexList(chamberChannel, indexListJson) {
    chamberChannel.fetchMessages().then(function (messages) {

        //Concatonate the json of indexes into a single string
        let indexListString = "**- - - INDEX LIST - - -**\n\n";
        let count = 1;
        for (let key in indexListJson) {
            if (indexListJson.hasOwnProperty(key)) {
                indexListString = indexListString.concat("**" + count + ":** " + key + "\n");
                count++;
            }
        }

        msgArray = messages.array();
        let foundMsg = false;
        let msgIndex = 0;

        //Check if the INDEX LIST message is in this channel
        for (let i = 0; i < msgArray.length; i++) {
            if (msgArray[i].content.includes("**- - - INDEX LIST - - -**") && msgArray[i].author.bot) {
                foundMsg = true;
                msgIndex = i;
                break;
            }
        }

        if (foundMsg) msgArray[msgIndex].edit(indexListString);
        else chamberChannel.send(indexListString);
    }).catch(console.error);
}*/



/*module.exports.checkAndUpdatePowerRankingList = function(bot, userDataJson) {
    bot.guilds.array().forEach(function(guild) {
        if (!guild.channels.find("name", "big-bills-bot-chamber")) guild.createChannel("big-bills-bot-chamber", "text", [{
            id: guild.id,
            deny: ['SEND_MESSAGES']
          }]).then(chamberChannel => updatePowerRankingList(chamberChannel, userDataJson));
        else updatePowerRankingList(guild.channels.find("name", "big-bills-bot-chamber"), userDataJson);
    });
}
function updatePowerRankingList(chamberChannel, userDataJson) {
    chamberChannel.fetchMessages().then(function (messages) {

        //Sort users in order of power and list them
        let powerRankingsString = "**- - - POWER RANKINGS - - -**\n\n";
        let userArray = [];
        for (let userID in userDataJson) {  //Get all users that have the "power" property
            if (userDataJson[userID].hasOwnProperty("power")) {
                userArray.push(userDataJson[userID]);
            }
        }
        userArray.sort(function(a,b){ return a.power - b.power });  //Sort them by their power property, from lowest to highest
        userArray.reverse();
        for (let i = 0; i < userArray.length; i++) {
            powerRankingsString = powerRankingsString.concat("**" + userArray[i].username + ":** " + userArray[i].power + "\n");
        }

        //Check if the POWER RANKINGS message is in this channel
        msgArray = messages.array();
        for (let i = 0; i < msgArray.length; i++) {
            if (msgArray[i].content.includes("**- - - POWER RANKINGS - - -**") && msgArray[i].author.bot) {
                msgArray[i].edit(powerRankingsString);
                return;
            }
        }
        chamberChannel.send(powerRankingsString);   //If we didn't find the message, just send a new one
    }).catch(console.error);
}*/



/*module.exports.checkAndUpdateAudioList = function(bot, audioNamesList) {
    bot.guilds.array().forEach(function(guild) {
        if (!guild.channels.find("name", "big-bills-bot-chamber")) guild.createChannel("big-bills-bot-chamber", "text", [{
            id: guild.id,
            deny: ['SEND_MESSAGES']
          }]).then(chamberChannel => updateAudioList(chamberChannel, audioNamesList));
        else updateAudioList(guild.channels.find("name", "big-bills-bot-chamber"), audioNamesList);
    });
}
function updateAudioList(chamberChannel, audioNamesList) {
    chamberChannel.fetchMessages().then(function (messages) {

        //Concatonate the list of audio names into a single string
        let audioNamesListString = "**- - - AUDIO LIST - - -**\n\n";
        let count = 1;
        for (let i = 0; i < audioNamesList.length; i++) {
            audioNamesListString = audioNamesListString.concat("**" + count + ":** " + audioNamesList[i] + "\n");
            count++;
        }

        msgArray = messages.array();
        let foundMsg = false;
        let msgIndex = 0;

        //Check if the AUDIO LIST message is in this channel
        for (let i = 0; i < msgArray.length; i++) {
            if (msgArray[i].content.includes("**- - - AUDIO LIST - - -**") && msgArray[i].author.bot) {
                foundMsg = true;
                msgIndex = i;
                break;
            }
        }

        if (foundMsg) msgArray[msgIndex].edit(audioNamesListString);
        else chamberChannel.send(audioNamesListString);
    }).catch(console.error);
}*/