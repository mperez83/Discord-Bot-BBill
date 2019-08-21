const Discord = require("discord.js");
const garfield = require("garfield");


const dbUtils = require(`../../database_stuff/user_database_handler`);



module.exports.run = async (bot, message, args) => {
    let garfEmbed = new Discord.RichEmbed()
        .setImage(garfield.random())
        .setColor(`#ffa600`);
    message.channel.send(garfEmbed);
    dbUtils.addMiscDataValue(message.author, "garfield_revenance", Math.ceil(25 + (Math.random() * 100)));
}

module.exports.help = {
    name: "garfield",
    description: "Posts a random garfield comic",
    usage: "!gafrield",
    example: "!garfeild",
    funFacts: [
        "There are well over 26^1999 ways to invoke garfield, which is far above theoretical infinity",
        "Garfield was the first comic command to be implemented, but it remained classified as a normal command until explosm, homestuck, \
        and nedroid were implemented."
    ]
}