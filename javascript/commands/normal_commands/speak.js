const fs = require("fs");

const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {

    try {
        if (!genUtils.verifyWhitelistCommandCall(message, "admin")) return;
    }
    catch (err) {
        console.error(err);
    }

    

    let inputAudioName = args.join(" ");
    let audioFiles = [];

    fs.readdir("./audio/", (err, files) => {

        if (err) console.error(err);

        for (let file in files) {
            let croppedFile = file.slice(0, -4);
            audioFiles.push(croppedFile);
        }

        //If no name is entered, set the name of the audio file to some random filename from the audio folder
        if (inputAudioName.length == 0) {
            if (audioFiles.length == 0) {
                message.channel.send(`There are no audio files to play yet, ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            else {
                let randomIndex = Math.floor(Math.random() * audioFiles.length);
                inputAudioName = audioFiles[randomIndex];
            }
        }

        bot.guilds.array().forEach((guild) => {
            voiceChannel = undefined;

            for (let i = 0; i < guild.channels.array().length - 1; i++) {
                if (guild.channels.array()[i].type == "voice") {
                    voiceChannel = guild.channels.array()[i];
                    break;
                }
            }

            voiceChannel.join()
                .then((connection) => {
                    connection.playFile(`./audio/${inputAudioName}.mp3`);
                })
                .catch(console.error);
        });

    });

}

module.exports.help = {
    name: "speak",
    description: "Plays the specified audio file in all of the servers Big Bill is in, or a random audio file if no name is provided",
    usage: "!speak [name]",
    example: "!speak mind flood 2",
    funFacts: [
        `This is one of the most dysfunctional commands Big Bill has. It frequently just doesn't work, and when it does, it has an issue that causes him to \
        make every subsequent speak call take half a second longer to process, with no upper bound.`
    ]
}