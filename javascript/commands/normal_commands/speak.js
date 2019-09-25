const Discord = require(`discord.js`);
const fs = require("fs");

const genUtils = require('../../command_utilities/general_utilities');

let serverDispatchers = new Discord.Collection();



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

        files.forEach((file) => {
            let croppedFile = file.slice(0, -4);
            audioFiles.push(croppedFile);
        });

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

        //Else, confirm that the input audio name is in audioFiles (return if it isn't)
        else {
            if (!audioFiles.includes(inputAudioName)) {
                message.channel.send(`that's not a valid audio file, ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
        }



        //Join the voice channel
        if (message.member.voiceChannel) {

            //If the member voice channel differs from where bill is, set bill to the member's voice channel
            if (message.member.voiceChannel != message.guild.voiceConnection) {
                voiceChannel = message.member.voiceChannel;
                voiceChannel.join()
                    .then((connection) => {

                        //If the server isn't currently playing any audio, play audio
                        if (!serverDispatchers.has(`${message.guild.id}`)) {
                            const dispatcher = connection.playFile(`./audio/${inputAudioName}.mp3`);
                            serverDispatchers.set(`${message.guild.id}`, dispatcher);
                            dispatcher.on("end", (reason) => {
                                serverDispatchers.delete(`${message.guild.id}`);
                                if (reason != `switching audio`) voiceChannel.leave();
                            });
                        }

                        //Else, stop the audio and play something different
                        else {
                            serverDispatchers.get(`${message.guild.id}`).end(`switching audio`);

                            const dispatcher = connection.playFile(`./audio/${inputAudioName}.mp3`);
                            serverDispatchers.set(`${message.guild.id}`, dispatcher);
                            dispatcher.on("end", (reason) => {
                                serverDispatchers.delete(`${message.guild.id}`);
                                if (reason != `switching audio`) voiceChannel.leave();
                            });
                        }

                    })
                    .catch(console.error);
            }

        }
        else {
            message.channel.send(`you have to be in a voice channel, ${genUtils.getRandomNameInsult(message)}`);
        }

    });

}

module.exports.help = {
    name: "speak",
    description: "Plays the specified audio file in all of the servers Big Bill is in, or a random audio file if no name is provided",
    usage: "!speak [name]",
    example: "!speak mind flood 2",
    funFacts: [
        `I finally got around to fixing it! This command has spent the longest amount of time on the backburner, before getting the well-needed \
        revamp it deserves.`
    ]
}