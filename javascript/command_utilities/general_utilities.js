const Discord = require("discord.js");
const fs = require("fs");

const insultData = require("../../data/static_command_data/insult_data.json");
const whitelist = require("../../data/static_command_data/command_whitelist.json");



module.exports.normalEmotes = [
    '😀', '😬', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😉',
    '😊', '🙂', '🙃', '☺', '😋', '😌', '😍', '😘', '😗', '😙',
    '😚', '😜', '😝', '😛', '🤑', '🤓', '😎', '🤗', '😏', '😶',
    '😐', '😑', '😒', '🙄', '🤔', '😳', '😞', '😟', '😠', '😡',
    '😔', '😕', '🙁', '☹', '😣', '😖', '😫', '😩', '😤', '😮',
    '😱', '😨', '😰', '😯', '😦', '😧', '😢', '😥', '😪', '😓',
    '😭', '😵', '😲', '🤐', '😷', '🤒', '🤕', '😴',
    '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
    '👏', '🖕', '👁', '👀', '🤠', '🤡', '🤢', '🤣', '🤤', '🤥',
    '🤧', '👮', '🚶', '🏃', '🐶', '🐱', '🐭', '🐹', '🐻', '🐵',
    '🐺', '⭐', '🦍', '🦊', '🍑', '🍆', '🥑', '🥚', '💎', '🔫',
    '💣', '⚔', '🛡', '☠', '💯', '❤', '💛', '💚', '💙', '💜',
    '☢', '♋', '❓', '💲', '💬', '🖤', '🅰', '🏳', '🌈'
];



//Returns random line from list_of_names_to_insult_people_with as a string
function getRandomNameInsult(message) {
    return insultData.insults[Math.floor(Math.random() * insultData.insults.length)];
}
module.exports.getRandomNameInsult = getRandomNameInsult;



//Return array consisting of every read line from a text file
//also removes the hyphens from the beginning of the lines
function readHyphenTextFile(fileLocation, callback) {

    fs.readFile(fileLocation, (err, data) => {
        if (err) console.error(err);

        let readLines = data.toString().split("\n");
        for (let i = 0; i < readLines.length; i++) readLines[i] = readLines[i].substr(1);
        callback(readLines);
    });

}
module.exports.readHyphenTextFile = readHyphenTextFile;



//Return url of an image posted in the current channel, or null if there were no images in the last 10 messages
function getMostRecentImageURL(message) {

    return message.channel.fetchMessages({ limit: 10 })
    .then((messagesToCheck) => {
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
module.exports.getMostRecentImageURL = getMostRecentImageURL;



//Send a message to the bill-bayou of every server bbill is in
//if bill-bayou doesn't exist in the server, create it
function sendGlobalMessage(bot, msg) {

    bot.guilds.forEach((guild) => {

        let billBayou = guild.channels.find(channel => (channel.name === "bill-bayou" && channel.type === "text"));

        //If we found the bill-bayou channel, post to that
        if (billBayou) {
            billBayou.send(msg);
        }

        //Otherwise, we'll check to see if bill is allowed to create the bill-bayou
        else {

            let billGuildMember = guild.members.get(bot.user.id);

            if (!billGuildMember) {
                console.log(`Bill was unable to find himself in ${guild.name}`);
            }
            else {

                //If bill is allowed to make the bill-bayou, do so and then post the message to it
                if (billGuildMember.hasPermission(["MANAGE_CHANNELS"])) {
                    guild.createChannel(`bill-bayou`, { type: `text` })
                        .then((createdChannel) => {
                            createdChannel.send(msg);
                        })
                        .catch(console.error);
                }
                else {
                    //Don't post anything if bill isn't allowed to make a bill-bayou :(
                }

            }

        }

    });

}
module.exports.sendGlobalMessage = sendGlobalMessage;



function getGlobalEmote(bot, emoteName) {
    let emoteGuild = bot.guilds.get("589954446415626260");
    let foundEmote = emoteGuild.emojis.find(emote => emote.name === emoteName);
    if (foundEmote) {
        return `<:${foundEmote.name}:${foundEmote.id}>`;
    }
    else {
        return `😔`;
    }
}
module.exports.getGlobalEmote = getGlobalEmote;



function verifyWhitelistCommandCall(message, command) {
    if (!whitelist[command]) throw `Error: command ${command} does not exist in whitelist databse!`;
    else if (!whitelist[command].users) throw `Error: command ${command} does not contain a users array!`;
    else if (!whitelist[command].servers) throw `Error: command ${command} does not contain a servers array!`;

    if (!whitelist[command].servers.includes(message.guild.id)) {
        if (!whitelist[command].users.includes(message.author.id)) {
            if (command == "admin")
                message.channel.send(`You are not a Big Bill admin!!! You cannot use that command, ${getRandomNameInsult(message)}`);
            else
                message.channel.send(`This server isn't whitelisted to use the ${command} command, ${getRandomNameInsult(message)}`);
            return false;
        }
    }
    return true;
}
module.exports.verifyWhitelistCommandCall = verifyWhitelistCommandCall;



//Remove X stuff from Y array
//Because javascript is almost entirely pass by reference, we don't need to return anything (everything we
//do to arrayToRemoveStuffFrom affects the passed in array no matter where it is)
function removeElementsFromArray(arrayToRemoveStuffFrom, stuffToRemove) {
    
    for (let i = 0; i < arrayToRemoveStuffFrom.length; i++) {
        for (let j = 0; j < stuffToRemove.length; j++) {
            if (arrayToRemoveStuffFrom[i] == stuffToRemove[j]) {
                arrayToRemoveStuffFrom.splice(i, 1);
            }
        }
    }

}
module.exports.removeElementsFromArray = removeElementsFromArray;



//Shrinks a string down to the specified length, optionally adding elipses if it surpasses the length
function shrinkString(str, length, addElipses = false) {

    //If it's already less than the requested length, or if the requested length is three or less, return
    if (str.length <= length || length <= 5) {
        return str;
    }

    //Otherwise, do the operations
    else {

        if (!addElipses) {
            str = str.substr(0, length);
            return str;
        }
        else {
            str = str.substr(0, length - 5);
            str += `(...)`;
            return str;
        }

    }

}
module.exports.shrinkString = shrinkString;



//Verify if the provided args are in the correct format
function getArgLetterAndValue(args, message) {

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
module.exports.getArgLetterAndValue = getArgLetterAndValue;



//Verify if the input numerical value is valid
function verifyNumVal(value, minValue, maxValue, valueName, message) {

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
module.exports.verifyNumVal = verifyNumVal;



//Same as verifyNumVal, but with an additional check to see if it's an integer
function verifyIntVal(value, minValue, maxValue, valueName, message) {

    //If the value isn't a number
    if (isNaN(value)) {
        message.channel.send(`${valueName} must be an integer, ${getRandomNameInsult(message)}`);
        return undefined;
    }

    //If the value isn't an integer
    if (value % 1 != 0) {
        message.channel.send(`${valueName} must be an integer, ${getRandomNameInsult(message)}`);
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
module.exports.verifyIntVal = verifyIntVal;



function verifyBoolVal(value, valueName, message) {

    if (value != "true" && value != "false") {
        message.channel.send(`${valueName} must be either **true** or **false**, ${getRandomNameInsult(message)}`);
        return undefined;
    }

    return value;

}
module.exports.verifyBoolVal = verifyBoolVal;



//Lerp between two values
function lerp(min, max, alpha) {
    return min * (1 - alpha) + max * alpha;
}
module.exports.lerp = lerp;