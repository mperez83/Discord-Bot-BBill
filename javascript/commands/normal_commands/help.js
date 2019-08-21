const Discord = require("discord.js");
const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {

    args = args.join(" ");

    //If no args, post github link and explain alternate help functionality
    if (args.length == 0) {
        message.channel.send(
`A robust list of commands and how they're used can be found at https://github.com/mperez83/Discord-Bot-BBill
If you want a quick rundown of a specific command, use !help [commandName] to post that.
${genUtils.getRandomNameInsult(message)}`
        );
    }

    //If an arg was supplied, post info about it
    else {

        let cmd = bot.commands.get(args);

        if (!cmd) {
            message.channel.send(`"${args}" is not a command! ${genUtils.getRandomNameInsult(message)}`);
            return;
        }
        else {
            let name = cmd.help.name;
            let description = cmd.help.description;
            let usage = cmd.help.usage;
            let example = cmd.help.example;
            let funFacts = cmd.help.funFacts;

            let newEmbed = new Discord.RichEmbed()
                .addField(`${getRandomEmote(message)} **__Name__**`, name)
                .addField(`${getRandomEmote(message)} **__Description__**`, description);
            
            if (usage == example) {
                newEmbed
                    .addField(`${getRandomEmote(message)} **__Usage/Example__**`, usage);
            }
            else {
                newEmbed
                    .addField(`${getRandomEmote(message)} **__Usage__**`, usage, true)
                    .addField(`${getRandomEmote(message)} **__Example__**`, example, true);
            }
            
            newEmbed.addField(`${getRandomEmote(message)} **__Fun Fact__**`, funFacts[Math.floor(Math.random() * funFacts.length)]);

            message.channel.send(newEmbed);
        }

    }

}

module.exports.help = {
    name: "help",
    description: "Posts information about the specified command, or links to the GitHub page if no command is provided",
    usage: "!help (command)",
    example: "!help power",
    funFacts: [
        `!help help doesn't give you an achievement, sorry`,
        `This was the least fun command to implement. It involved no puzzle solving; just the tedious transferring of data from one file to the next.`
    ]
}

function getRandomEmote(message) {
    if (message.channel.type == "dm" || message.guild.emojis.size == 0) {
        return genUtils.normalEmotes[Math.floor(Math.random() * genUtils.normalEmotes.length)];
    }
    else {
        let emoteList = genUtils.normalEmotes.slice(0);
        let guildEmotes = message.guild.emojis.array();
        for (let i = 0; i < guildEmotes.length; i++) emoteList.push(guildEmotes[i]);
        return emoteList[Math.floor(Math.random() * emoteList.length)];
    }
}