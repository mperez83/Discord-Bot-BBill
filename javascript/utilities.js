const fs = require("fs");

module.exports.getRandomNameInsult = function() {
    let nameInsults = fs.readFileSync("./misc stuff/list of names to insult people with.txt").toString().split("\n");
    for (let i = 0; i < nameInsults.length; i++) nameInsults[i] = nameInsults[i].substring(1);
    return nameInsults[Math.floor(Math.random() * nameInsults.length)];
}

module.exports.getRandomParameterInsult = function() {
    let tooManyParametersInsults = fs.readFileSync("./misc stuff/too many parameters insults.txt").toString().split("\n");
    for (let i = 0; i < tooManyParametersInsults.length; i++) tooManyParametersInsults[i] = tooManyParametersInsults[i].substring(1);
    return tooManyParametersInsults[Math.floor(Math.random() * tooManyParametersInsults.length)];
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

module.exports.incrementUserDataValue = function(message, valueName) {
    temporaryReadJSONFile("./data/userData.json", function (userDataJson) {
        if (!userDataJson[message.author.id]) userDataJson[message.author.id] = {username: message.author.username};
        if (!userDataJson[message.author.id][valueName]) userDataJson[message.author.id][valueName] = 0;
        userDataJson[message.author.id][valueName]++;
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



module.exports.checkAndUpdateIndexList = function(bot, indexListJson) {
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
        msgArray = messages.array();
        let foundMsg = false;
        let msgIndex = 0;

        //Check if the INDEX LIST message is in this channel
        for (let i = 0; i < msgArray.length; i++) {
            if (msgArray[i].content.includes("**- - - INDEX LIST - - -**") && msgArray[i].author.bot) {
                //console.log("found the message: " + msgArray[i].content);
                foundMsg = true;
                msgIndex = i;
                break;
            }
        }

        //Concatonate the json of indexes into a single string
        let indexListString = "**- - - INDEX LIST - - -**\n\n";
        indexListString = indexListString.concat("*Max Index Slots: " + indexListJson.indexCap.toFixed(3) + "*\n\n");
        let count = 1;
        for (let key in indexListJson) {
            if (indexListJson.hasOwnProperty(key)) {
                indexListString = indexListString.concat("**" + count + ":** " + key + "\n");
                count++;
            }
        }

        if (foundMsg) msgArray[msgIndex].edit(indexListString);
        else chamberChannel.send(indexListString);
    }).catch(console.error);
}



module.exports.checkAndUpdateAudioList = function(bot, audioNamesList) {
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
        msgArray = messages.array();
        let foundMsg = false;
        let msgIndex = 0;

        //Check if the AUDIO LIST message is in this channel
        for (let i = 0; i < msgArray.length; i++) {
            if (msgArray[i].content.includes("**- - - AUDIO LIST - - -**") && msgArray[i].author.bot) {
                //console.log("found the message: " + msgArray[i].content);
                foundMsg = true;
                msgIndex = i;
                break;
            }
        }

        //Concatonate the list of audio names into a single string
        let audioNamesListString = "**- - - AUDIO LIST - - -**\n\n";
        let count = 1;
        for (let i = 0; i < audioNamesList.length; i++) {
            audioNamesListString = audioNamesListString.concat("**" + count + ":** " + audioNamesList[i] + "\n");
            count++;
        }

        if (foundMsg) msgArray[msgIndex].edit(audioNamesListString);
        else chamberChannel.send(audioNamesListString);
    }).catch(console.error);
}