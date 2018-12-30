module.exports.run = async (bot, message, args) => {
    message.channel.send({ files: ["./misc stuff/sylveon.gif"] });
}

module.exports.help = {
    name: "sylveon"
}