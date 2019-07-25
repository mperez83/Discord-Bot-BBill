const fs = require("fs");

const ahm = require("./achievement_handler");

const userDataLoc = "./data/general_data/user_data.json";



//Returns random line from list_of_names_to_insult_people_with as a string
function getRandomNameInsult(message) {
    incrementUserDataValue(message.author, "socialDeviancy", 1);
    let socialDeviancyStat = getUserDataValue(message.author, "socialDeviancy");
    if (socialDeviancyStat != undefined && socialDeviancyStat >= 100) {
        ahm.awardAchievement(message, ahm.achievement_list_enum.SOCIAL_DEVIANT);
    }

    let nameInsults = fs.readFileSync("./data/general_data/list_of_names_to_insult_people_with.txt").toString().split("\n");
    for (let i = 0; i < nameInsults.length; i++) {
        nameInsults[i] = nameInsults[i].substring(1);               //Removes hyphen
        nameInsults[i] = nameInsults[i].replace(/\r?\n|\r/g, '');   //Removes newline character
    }
    return nameInsults[Math.floor(Math.random() * nameInsults.length)];
}
module.exports.getRandomNameInsult = getRandomNameInsult;



//Return array consisting of every read line from a text file
//also removes the hyphens from the beginning of the lines
module.exports.readHyphenTextFile = function(fileLocation) {
    let readLines = fs.readFileSync(fileLocation).toString().split("\n");
    for (let i = 0; i < readLines.length; i++) readLines[i] = readLines[i].substring(1);
    return readLines;
}



//Attempts to read JSON file, and creates a new one if the provided fileDir doesn't exist
function readJSONFile(fileDir, callback) {
    fs.readFile(fileDir, function readFileCallback(err, data) {
        if (err) {
            //console.error(err);
            let tempData = {};
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
module.exports.readJSONFile = readJSONFile;



//Get a value inside userData.json of a given user
function getUserDataValue(user, valueName) {
    readJSONFile(userDataLoc, function (userDataJson) {
        if (!userDataJson[user.id]) userDataJson[user.id] = {username: user.username};
        return userDataJson[user.id][valueName];
    });
}
module.exports.getUserDataValue = getUserDataValue;



//Increases a value inside userData.json of a given user by a given amount
function incrementUserDataValue(user, valueName, amount) {
    readJSONFile(userDataLoc, function (userDataJson) {
        if (!userDataJson[user.id]) userDataJson[user.id] = {username: user.username};
        if (!userDataJson[user.id][valueName]) userDataJson[user.id][valueName] = 0;
        userDataJson[user.id][valueName] += amount;
        fs.writeFileSync(userDataLoc, JSON.stringify(userDataJson, null, 4));
    });
}
module.exports.incrementUserDataValue = incrementUserDataValue;



//Updates a value inside userData.json of a given user to some value
function updateUserDataValue(user, valueName, newValue) {
    readJSONFile(userDataLoc, function (userDataJson) {
        if (!userDataJson[user.id]) userDataJson[user.id] = {username: user.username};
        userDataJson[user.id][valueName] = newValue;
        fs.writeFileSync(userDataLoc, JSON.stringify(userDataJson, null, 4));
    });
}
module.exports.updateUserDataValue = updateUserDataValue;


//(DEPRECATED) Attempt to give a user a new "Powerful" role
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



//Return url of an image posted in the current channel, or null if there were no images in the last 10 messages
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
            errorMessage = `I didn't find any messages containing images whatsoever in the last ten messages, ${getRandomNameInsult(message)}`;
        }

        else if (validURL.match(/\.(jpeg|jpg|gif|png)(\?v=1)*$/) == null) {
            errorMessage = `The image url I found doesn't have a valid file extension. ${getRandomNameInsult(message)}`;
            validURL = null;
        }

        if (errorMessage) message.channel.send(errorMessage);

        return validURL;
    })
    .catch(console.error);

}



//Send a message to the bill-bayou of every server bbill is in
//if bill-bayou doesn't exist in the server, create it
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



//Remove X stuff from Y array
//Because javascript is almost entirely pass by reference, we don't need to return anything (everything we
//do to arrayToRemoveStuffFrom affects the passed in array no matter where it is)
module.exports.removeElementsFromArray = function(arrayToRemoveStuffFrom, stuffToRemove) {

    for (let i = 0; i < arrayToRemoveStuffFrom.length; i++) {
        for (let j = 0; j < stuffToRemove.length; j++) {
            if (arrayToRemoveStuffFrom[i] == stuffToRemove[j]) {
                arrayToRemoveStuffFrom.splice(i, 1);
            }
        }
    }

}



//Verify if the provided args are in the correct format
module.exports.getArgLetterAndValue = function(args, message) {

    //Check that there's an even number of arguments
    if ((args.length % 2) != 0) {
        message.channel.send(`Invalid argument format, ${getRandomNameInsult(message)} (there should be an even amount of inputs)`);
        return undefined;
    }

    //Check that the current argument starts with a hyphen
    if (args[0][0] != '-') {
        message.channel.send(`Invalid argument provided, ${getRandomNameInsult(message)} (the argument you want to provide needs to start with a hyphen)`);
        return undefined;
    }

    //Check that the current argument is exactly 2 characters long
    if (args[0].length != 2) {
        message.channel.send(`Invalid argument provided, ${getRandomNameInsult(message)} (the start of an argument should be a hyphen and a letter, e.g. -d)`);
        return undefined;
    }

    //If nothing above proc'd, return the letter and value
    let returnObject = {letter: args[0][1], value: args[1]};
    args.splice(0, 2);
    return returnObject;

}



//Verify if the input numerical value is valid
module.exports.verifyNumVal = function(value, minValue, maxValue, valueName, message) {

    //If the value isn't a number
    if (isNaN(value)) {
        message.channel.send(`${valueName} must be a number, ${getRandomNameInsult(message)}`);
        return undefined;
    }

    //If the value is less than the minimum value
    if (value < minValue) {
        message.channel.send(`${valueName} must be equal to or greater than ${minValue}, ${getRandomNameInsult(message)}`);
        return undefined;
    }

    //If the value is greater than the max value
    if (value > maxValue) {
        message.channel.send(`${valueName} must be equal to or less than ${maxValue}, ${getRandomNameInsult(message)}`);
        return undefined;
    }

    return value;

}