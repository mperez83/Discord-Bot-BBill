module.exports.run = async (bot, message, args) => {
    message.channel.send({ files: ["./misc stuff/piplup.png"] });
}

module.exports.help = {
    name: "piplup"
}