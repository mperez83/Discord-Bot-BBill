const fs = require("fs");

const genUtils = require('../../command_utilities/general_utilities');

const dataLoc = "./data/general_data/server_data.json";



module.exports.run = async (bot, message, args) => {

    if (message.channel.type == "dm") {
        message.channel.send(`you can't use this in a dm, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    message.channel.send(`This command needs to be updated to the new information read/write system :(`);

    /*genUtils.readJSONFile(dataLoc, (serverDataJson) => {

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

            let topicDate = new Date();
            serverObj.topic.topicDate = JSON.stringify(topicDate);

            serverObj.topic.topicCreator = message.author.username;

            serverDataJson[currentServer] = serverObj;
            fs.writeFile(dataLoc, JSON.stringify(serverDataJson, null, 4), (err) => {
                if (err) console.error(err);
                message.channel.send(`Topic set to "${serverObj.topic.topicText}"`);
            });
        }

    });*/

}

module.exports.help = {
    name: "topic",
    description: "Changes the topic to the specified input, or displays the current topic if no input is provided",
    usage: "!topic [input]",
    example: "!topic Hello, World!",
    funFacts: [
        "This command was inspired by Northernlion's Moobot command \"topic\" which, simply put, stores a string that can be brought up at any time. \
        It also records who set the topic, and how long ago it was set. This was before I realized Discord channels have built in topics that can be set, \
        making this command obsolete, but I wanted to keep it in anyway.",
        "This is the least used command."
    ]
}