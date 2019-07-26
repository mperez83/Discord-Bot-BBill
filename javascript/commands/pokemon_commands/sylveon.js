const Discord = require("discord.js");



module.exports.run = async (bot, message, args) => {

    let newEmbed = new Discord.RichEmbed();
    newEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/584243997049094145/sylveon.gif`);
    message.channel.send(newEmbed);
    
}

module.exports.help = {
    name: "sylveon"
}