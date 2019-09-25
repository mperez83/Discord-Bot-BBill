const Discord = require("discord.js");

const thoughts = [
    `nope. not into that very much at all`,
    `don't like that`,
    `get that outta here`,
    `begone`
];



module.exports.run = async (bot, message, args) => {

    let msg = "";

    //10% chance for twinkie doge to voice its thoughts
    if (Math.floor(100 * Math.random()) < 25) {
        msg += `<:vtwinkie1:626326797038125066><:thinky1:525918684061892619>${thoughts[Math.floor(thoughts.length * Math.random())]}<:thinky2:525918684313813023>\n`;
    }
    else {
        msg += `<:vtwinkie1:626326797038125066>\n`;
    }

    for (let i = 0; i < 30; i++) {
        msg += `<:vtwinkie2:626326796375162890>\n`;
    }
    msg += `<:vtwinkie3:626326796765495316>`;

    message.channel.send(msg);

}

module.exports.help = {
    name: "sfw",
    description: "Purges the chat of its sins",
    usage: "!sfw",
    example: "!sfw",
    funFacts: [
        `If I recall correctly, this was the first command ever created. The concept of posting an image three times in a row was an easy enough task to act \
        as my intro to Discord.js.`,
        `This command used to be three "sfw sasuke" images posted one after another. The new doge train is much more efficient, and tonally appropriate.`
    ]
}