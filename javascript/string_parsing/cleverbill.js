const fs = require("fs");
const utilitiesModule = require('../utilities');

const responseDir = "./javascript/string_parsing/cleverbill_utilities";



const MessageTypes = {
    EIGHT_BALL: "eight_ball",
    WHO: "who",
    WHERE: "where",
    WHEN: "when",
    HOW: "how",
    UNANSWERABLE: "unanswerable"
}

const magic8BallIndicators = [
    "should", "shouldnt", "can", "cant", "could", "couldnt",
    "do", "dont", "does", "doesnt", "did", "didnt",
    "will", "willnt", "would", "wouldnt", "were", "werent",
    "are", "arent", "is", "isnt", "have", "havent",
    "has", "hasnt", "am"
];

const whoIndicators = [
    "who", "whom", "whos", "whose", "whomstve"
];

const whereIndicators = [
    "where", "wheres", "whereve"
];

const whenIndicators = [
    "when"
];

const howIndicators = [
    "how"
];

const unanswerableIndicators = [
    "what", "whats", "whatll", "why",
    "whys", "which", "whichll"
];



module.exports = {

    //Make big bill answer questions
    parseTextForQuestions: function(bot, message) {
        if (message.mentions.users.size == 1 && message.mentions.users.first().id == bot.user.id) {

            let userMsg = message.content;

            //Only respond to users that start their message with a bbill mention
            if (!userMsg.startsWith(`<@${bot.user.id}>`)) return false;

            //Remove the mention, as well as all of the spaces in front of the user's message
            userMsg = userMsg.replace(`<@${bot.user.id}>`, "");
            let spaceCount = 0;
            while (userMsg.startsWith(" ")) {
                userMsg = userMsg.slice(1);
                spaceCount++;
            }

            //Insult them if they're adding a bunch of bullshit spaces in front of their message
            if (spaceCount > 5) {
                message.channel.send(`why the fuck you are adding so many spaces in front of your message`);
                return true;
            }

            //If the user just @'s Big Bill with no message, call them an idiot
            if (!userMsg) {
                message.channel.send(`What? ${utilitiesModule.getRandomNameInsult(message.author)}`);
                return true;
            }

            //If the user yells at big bill, make him feel bad
            if (userMsg.match(/[a-zA-Z]+/) && userMsg == userMsg.toUpperCase()) {
                message.channel.send(`don't yell at me :(`);
                return true;
            }

            //Clean up the string to make parsing easier
            userMsg = userMsg.toLowerCase();
            userMsg = userMsg.replace("'", "");
            userMsg = userMsg.replace(".", "");

            //Split every word in the message into its own array element
            msgArray = userMsg.split(" ");

            let msgType;
            for (let i = 0; i < msgArray.length; i++) {
                if (magic8BallIndicators.includes(msgArray[i]))
                    msgType = MessageTypes.EIGHT_BALL;
                else if (whoIndicators.includes(msgArray[i]))
                    msgType = MessageTypes.WHO;
                else if (whereIndicators.includes(msgArray[i]))
                    msgType = MessageTypes.WHERE;
                else if (whenIndicators.includes(msgArray[i]))
                    msgType = MessageTypes.WHEN;
                else if (howIndicators.includes(msgArray[i]))
                    msgType = MessageTypes.HOW;
                else if (unanswerableIndicators.includes(msgArray[i]))
                    msgType = MessageTypes.UNANSWERABLE;
                
                //If we found a match, break out of the loop
                if (msgType != undefined) break;
            }



            //Response time
            switch (msgType) {

                //Non-question responses
                case undefined:
                    message.channel.send(`You have to ask something, ${utilitiesModule.getRandomNameInsult(message.author)}`);
                    break;
                
                

                //EIGHT-BALL responses
                case MessageTypes.EIGHT_BALL:
                    let orAmount = 0;
                    for (let i = 0; i < msgArray.length; i++)
                        if (msgArray[i] == "or")
                            orAmount++;

                    if (orAmount <= 0) {
                        let eightBallResponses = utilitiesModule.readHyphenTextFile(`${responseDir}/eight_ball_responses.txt`);
                        message.channel.send(eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)]);
                    }
                    else {
                        let prefixes = ["Probably", "Most likely", "Almost certainly", "Definitely"];
                        message.channel.send(`${prefixes[Math.floor(Math.random() * prefixes.length)]} option ${Math.ceil(Math.random() * (orAmount + 1))}`);
                    }
                    break;
                
                

                //WHO responses
                case MessageTypes.WHO:
                    message.channel.send(message.channel.members.random().displayName);
                    break;
                
                
                
                //WHERE responses
                case MessageTypes.WHERE:
                    let whereResponses = utilitiesModule.readHyphenTextFile(`${responseDir}/where_responses.txt`);
                    whereResponses.push(`Somewhere in ${message.channel.members.random().displayName}'s house`);

                    message.channel.send(whereResponses[Math.floor(Math.random() * whereResponses.length)]);
                    break;
                
                
                
                //WHEN responses
                case MessageTypes.WHEN:
                    let whenResponses = [];
                    let pastTense = false;

                    for (let i = 0; i < msgArray.length; i++) {
                        if (msgArray[i] == "was" || msgArray[i] == "were" || msgArray[i] == "did") {
                            pastTense = true;
                            break;
                        }
                    }
                    
                    if (pastTense) {
                        whenResponses = utilitiesModule.readHyphenTextFile(`${responseDir}/when_past_responses.txt`);
                        whenResponses.push(`About ${Math.ceil(Math.random() * 23)} hours and ${Math.ceil(Math.random() * 59)} minutes ago`);
                        whenResponses.push(`On ${message.channel.members.random().displayName}'s next birthday`);
                    }
                    else {
                        whenResponses = utilitiesModule.readHyphenTextFile(`${responseDir}/when_past_responses.txt`);
                        whenResponses.push(`In about ${Math.ceil(Math.random() * 23)} hours and ${Math.ceil(Math.random() * 59)} minutes`);
                        whenResponses.push(`On ${message.channel.members.random().displayName}'s last birthday`);
                    }
                    message.channel.send(whenResponses[Math.floor(Math.random() * whenResponses.length)]);
                    break;
                
                
                
                //HOW responses
                case MessageTypes.HOW:
                    let howResponses = [];
                    let quantityType = 0;

                    for (let i = 0; i < msgArray.length; i++) {
                        if (msgArray[i] == "much") { quantityType = 1; break; }
                        if (msgArray[i] == "many") { quantityType = 2; break; }
                    }

                    switch (quantityType) {
                        case 0:
                            message.channel.send("I can't answer that :(");
                            break;

                        case 1:
                            howResponses = utilitiesModule.readHyphenTextFile(`${responseDir}/how_much_responses.txt`);
                            message.channel.send(howResponses[Math.floor(Math.random() * howResponses.length)]);
                            break;

                        case 2:
                            howResponses = utilitiesModule.readHyphenTextFile(`${responseDir}/how_many_responses.txt`);
                            howResponses.push(Math.floor(Math.random() * 100));
                            howResponses.push(Math.floor(Math.random() * 10000));
                            howResponses.push(Math.floor(Math.random() * 100) - 100);

                            message.channel.send(howResponses[Math.floor(Math.random() * howResponses.length)]);
                            break;
                    }
                    break;
                
                
                
                //UNANSWERABLE responses
                case MessageTypes.UNANSWERABLE:
                    //message.channel.send("I can't answer that :(");
                    message.channel.send({ embed: { image: { url: "https://cdn.discordapp.com/attachments/527341248214990850/597251600515334144/ConcernFrog.png" } } });
                    break;

            }

            //Return after answering a question, because there definitely isn't going to be a command
            return true;
        }
        else {
            return false;
        }
    }
    
};