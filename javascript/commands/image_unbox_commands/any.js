const fs = require("fs");
const imageUnboxModule = require("../../command_utilities/image_unbox");



module.exports.run = async (bot, message, args) => {
    fs.readdir(`./javascript/commands/image_unbox_commands/`, (err, files) => {
        if (err) console.error(err);

        let imageUnboxCommands = files.filter((f) =>  {
            return f != "any.js" && f.split(".").pop() === "js";
        });

        for (let i = 0; i < imageUnboxCommands.length; i++) {
            imageUnboxCommands[i] = imageUnboxCommands[i].slice(0, -3);
        }
        
        imageUnboxModule.unboxImage(message, imageUnboxCommands[Math.floor(imageUnboxCommands.length * Math.random())]);
    });
}

module.exports.help = {
    name: "any",
    description: "Posts a random image from any of the other image unbox commands",
    usage: "!any",
    example: "!any",
    funFacts: [
        `Fitting with how random many of the other aspects of bill is, this command seemed appropriate.`
    ]
}