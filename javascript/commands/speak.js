const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    var inputAudioName = args.join(" ");

    let audioFiles = [];
    fs.readdirSync("./audio/").forEach(file => {
        let croppedFile = file.slice(0, -4);
        audioFiles.push(croppedFile);
    });

    //If no name is entered, set the name of the audio file to some random filename from the audio folder
    if (inputAudioName.length == 0) {
        if (audioFiles.length == 0) {
            message.channel.send("There are no audio files to play yet, " + utilitiesModule.getRandomNameInsult());
            return;
        }
        else {
            let randomIndex = Math.floor(Math.random() * audioFiles.length);
            inputAudioName = audioFiles[randomIndex];
        }
    }

    bot.guilds.array().forEach(function(guild) {
        voiceChannel = undefined;

        for (let i = 0; i < guild.channels.array().length - 1; i++) {
            if (guild.channels.array()[i].type == "voice") {
                voiceChannel = guild.channels.array()[i];
                break;
            }
        }

        voiceChannel.join().then(connection => {
            connection.playFile("./audio/" + inputAudioName + ".mp3");
        })
            .catch(console.error);
    });
}

module.exports.help = {
    name: "speak"
}