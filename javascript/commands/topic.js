const fs = require("fs");
const utilitiesModule = require('../utilities');
const dataLoc = "./data/general_data/serverData.json";

module.exports.run = async (bot, message, args) => {
    if (message.channel.type == "dm") {
        message.channel.send(`you can't use this in a dm, ${utilitiesModule.getRandomNameInsult()}`);
        return;
    }

    utilitiesModule.readJSONFile(dataLoc, function (serverDataJson) {

        //View topic
        if (args.length == 0) {
            if (!utilitiesModule.checkNested(serverDataJson, message.guild.id, "topic")) {
                message.channel.send("there is no topic set yet");
                return;
            }
            else {
                let topicDateStr = JSON.parse(serverDataJson[message.guild.id].topic.topicDate);
                let topicDate = new Date(topicDateStr);

                let hours = topicDate.getHours();
                let minutes = ((topicDate.getMinutes() < 10) ? '0' : '') + topicDate.getMinutes();
                let ampm = (hours >= 12) ? "pm" : "am";
                hours = hours % 12;
                let strTime = hours + ":" + minutes + " " + ampm;

                message.channel.send(`topic: ${serverDataJson[message.guild.id].topic.topicText}\n(Last updated ${topicDate.toLocaleDateString("en-US")} at ${strTime} by **${serverDataJson[message.guild.id].topic.topicCreator}**)`);
            }
        }

        //Set topic
        else {
            //if (message.member.hasPermission("ADMINISTRATOR"))

            let newTopicText = args.join(" ");

            if (!serverDataJson[message.guild.id]) serverDataJson[message.guild.id] = {topic: {topicText:undefined, topicDate:undefined, topicCreator:undefined}};
            serverDataJson[message.guild.id].topic.topicText = newTopicText;
            message.channel.send(`Topic set to "${serverDataJson[message.guild.id].topic.topicText}"`);

            let topicDate = new Date();
            serverDataJson[message.guild.id].topic.topicDate = JSON.stringify(topicDate);

            serverDataJson[message.guild.id].topic.topicCreator = message.author.username;

            fs.writeFile(dataLoc, JSON.stringify(serverDataJson), function(err) {if (err) return err;});
        }

    });
}

module.exports.help = {
    name: "topic"
}