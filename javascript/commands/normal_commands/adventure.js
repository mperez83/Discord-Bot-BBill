const genUtils = require('../../command_utilities/general_utilities');
const advUtils = require('../../command_utilities/adventure_utilities');



module.exports.run = async (bot, message, args) => {

    let billsAdventureChannel = message.guild.channels.find(channel => (channel.name === "bills-adventure" && channel.type === "text"))

    //If bills-adventure already exists
    if (billsAdventureChannel) {

        if (args == "deletesave") {
            if (!message.member.hasPermission(["ADMINISTRATOR"])) {
                message.channel.send(`Only admins can delete a saved game! ${genUtils.getRandomNameInsult(message)}`);
            }
            else {
                message.channel.send(`Are you absolutely sure you want to delete this server's save? There's no recovering it when done. React to this \
message with 💣 to complete the action. (After 15 seconds, this message won't read any more reactions)`)
                    .then((msg) => {

                        const rarityFilter = (reaction, user) => {
                            return reaction.emoji.name === '💣' && user.id === message.author.id;
                        };

                        msg.awaitReactions(rarityFilter, { max: 1, time: 15000, errors: ['time'] })
                            .then((collected) => {
                                let channelToDelete = msg.guild.channels.find(channel => (channel.name === "bills-adventure" && channel.type === "text"));
                                if (channelToDelete) {
                                    channelToDelete.delete()
                                        .then(() => {
                                            msg.react(`✅`);
                                        })
                                        .catch(console.error);
                                }
                            })
                            .catch((collected) => {
                                msg.react(`❌`);
                            });

                    });
            }
        }
        else {
            message.channel.send(`Adventure channel already exists! Use the command "!adventure deletesave" to delete this server's save.`);
        }

    }

    //If bills-adventure doesn't exist
    else {

        if (args == "newgame") {

            if (!message.member.hasPermission(["ADMINISTRATOR"])) {
                message.channel.send(`Only admins can start a new game! ${genUtils.getRandomNameInsult(message)}`);
            }
            else {

                let guild = message.guild;
                let billGuildMember = guild.members.get(bot.user.id);

                if (!billGuildMember) {
                    console.error(`Bill was unable to find himself in ${guild.name} while running the adventure command`);
                }
                else {

                    if (billGuildMember.hasPermission(["MANAGE_CHANNELS"])) {

                        guild.createChannel(`bills-adventure`, {
                            type: `text`,
                            permissionOverwrites: [

                                //Default role permissions
                                {
                                    id: guild.defaultRole.id,
                                    deny: ['SEND_MESSAGES']
                                },

                                //Bill permissions
                                {
                                    id: bot.user.id,
                                    allow: ['SEND_MESSAGES']
                                }

                            ]
                        })
                            .then((createdChannel) => {
                                message.react(`✅`);
                                advUtils.drawInit(createdChannel);
                            })
                            .catch(console.error);

                    }
                    else {
                        message.channel.send(`I don't have the manage channels permission to start the adventure :(`);
                    }

                }

            }

        }
        else {
            message.channel.send(`No save detected! Please type the following command "!adventure newgame" in order to start a new game. (Only admins can \
start a new game. **Starting a new game will create a new channel called "bills-adventure".**)`);
        }

    }

}

module.exports.help = {
    name: "adventure",
    description: "Sends Big Bill on an adventure",
    usage: "!adventure",
    example: "!adventure",
    funFacts: [
        "This command was on hiatus for the longest time, as more and more smaller things kept popping up that I wanted to implement."
    ]
}