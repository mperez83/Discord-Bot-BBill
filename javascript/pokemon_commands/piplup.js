module.exports.run = async (bot, message, args) => {
    //message.channel.send({ files: ["./graphics/pokemon_stuff/piplup.png"] });
    message.channel.send({
        embed: {
            image: {
                url: "https://cdn.discordapp.com/attachments/527341248214990850/584243982482145280/piplup.png"
            }
        }
    });
}

module.exports.help = {
    name: "piplup"
}