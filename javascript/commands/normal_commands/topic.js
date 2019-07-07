const fs = require("fs");

const utilitiesModule = require('../../utilities');

const dataLoc = "./data/general_data/serverData.json";



module.exports.run = async (bot, message, args) => {

    if (message.channel.type == "dm") {
        message.channel.send(`you can't use this in a dm, ${utilitiesModule.getRandomNameInsult(message.author)}`);
        return;
    }

    utilitiesModule.readJSONFile(dataLoc, function (serverDataJson) {

        currentServer = message.guild.id;
        serverObj = serverDataJson[currentServer];

        //View topic
        if (args.length == 0) {
            if (!serverObj) {
                message.channel.send(`this server has no data yet!! set a topic, or do something else to create some data idk`);
                return;
            }
            else if (!serverObj.topic) {
                message.channel.send(`this server has no topic set yet`);
                return;
            }
            else {
                let topicDateStr = JSON.parse(serverObj.topic.topicDate);
                let topicDate = new Date(topicDateStr);

                let hours = topicDate.getHours();
                let minutes = ((topicDate.getMinutes() < 10) ? '0' : '') + topicDate.getMinutes();
                let ampm = (hours >= 12) ? "pm" : "am";
                hours = hours % 12;
                let strTime = `${hours}:${minutes} ${ampm}`;

                message.channel.send(`topic: ${serverObj.topic.topicText}\n(Last updated ${topicDate.toLocaleDateString("en-US")} at ${strTime} by **${serverObj.topic.topicCreator}**)`);
            }
        }

        //Set topic
        else {
            let newTopicText = args.join(" ");

            if (!serverObj) serverObj = {topic: {topicText:undefined, topicDate:undefined, topicCreator:undefined}};

            serverObj.topic.topicText = newTopicText;
            message.channel.send(`Topic set to "${serverObj.topic.topicText}"`);

            let topicDate = new Date();
            serverObj.topic.topicDate = JSON.stringify(topicDate);

            serverObj.topic.topicCreator = message.author.username;

            serverDataJson[currentServer] = serverObj;
            fs.writeFile(dataLoc, JSON.stringify(serverDataJson, null, 4), function(err) {if (err) return err;});
        }

    });

}

module.exports.help = {
    name: "topic"
}