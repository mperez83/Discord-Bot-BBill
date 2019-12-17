const Discord = require("discord.js");

const config = require("../../data/general_data/config.json");
const dbUtils = require(`../database_stuff/user_database_handler`);

const secretPhrases = [
    `rusty bullet holes`,
    `there is no such thing as ethical consumption under capitalism`,
    `hamster`
];

const swears = [ "ass", "bastard", "bitch", "cuck", "cunt", "damn", "fuck", "hell", "ligma", "shit" ];



module.exports = {

    //Parse message for bad emotes
    parseTextForBadEmotes: (message) => {

        let badEmotes = [
            "<:GWfroggyFeelsUpMan:400751139563241473>",
            "<:GWqlabsFeelsKCHHH:403294831893282820>",
            "<:GWqlabsFeelsFunnyMan:398950861361119233>",
            "<:FeelsCreep:416072792732073987>"
        ];

        for (let i = 0; i < badEmotes.length; i++) {
            if (message.content.includes(badEmotes[i])) {
                message.react(`😒`);
                //genUtils.incrementUserDataValue(message, "sin", 1);
                break;
            }
        }

        return false;

    },



    //Parse message for @everyone
    parseTextForAtEveryone: (message) => {

        if (message.mentions.everyone) {
            message.react(`😡`);
            return true;
        }

        return false;

    },



    //Parse message for string of text, which must match punctuation and capitalization exactly
    parseTextForSpecificString: (message) => {
        
        let userMsg = message.content;



        //Quieres?
        if (userMsg == "quieres?") {
            let quieresEmbed = new Discord.RichEmbed();
            quieresEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/597251600515334144/ConcernFrog.png`);

            let dudCheck = Math.floor(Math.random() * 20);
            if (dudCheck == 0)
                quieresEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/584247880013971466/anti-quieres.png`);
            else
                quieresEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/584241610242523136/quieres.png`);
                
            message.channel.send(quieresEmbed);

            return true;
        }



        //AAAAAaaaAAAAaAaAaAAAAA
        if (userMsg.length >= 10) {
            let ACount = 0;
            let foundNonAChar = false;

            for (let i = 0; i < userMsg.length; i++) {
                let ch = userMsg.charAt(i);

                if (ch != 'a' && ch != 'A') {
                    foundNonAChar = true;
                    break;
                }

                if (userMsg.charAt(i) == 'A') ACount++;
            }

            if (!foundNonAChar) {

                if (ACount >= Math.ceil(userMsg.length / 2)) {
                    let aaaaaaaaaaEmbed = new Discord.RichEmbed();
                    aaaaaaaaaaEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/584252304992108577/AaAAAaaaAAaAaaaaAaAAAAAaAaAa.jpg`);
                    message.channel.send(aaaaaaaaaaEmbed);
                    return true;
                }

            }
        }



        //Check for yelling
        if (message.mentions.users.size == 0 && userMsg.match(/^([^a-z]*[A-Z]\s*){20,}[^a-z]*$/)) {
            let yellingEmbed = new Discord.RichEmbed();
            yellingEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/584252304992108577/AaAAAaaaAAaAaaaaAaAAAAAaAaAa.jpg`);
            message.channel.send(yellingEmbed);
            return true;
        }



        //F in chat
        if (userMsg == "F") {
            message.react("🇫");
            return true;
        }



        //If none of the above triggered, return false, which allows main.js to continue
        return false;

    },



    //Parse message for string of text, disregarding punctuation and capitalization
    parseTextForLooseString: (message) => {

        let userMsg = message.content;

        userMsg = userMsg.toLowerCase();
        userMsg = userMsg.replace("'", "");
        userMsg = userMsg.replace(".", "");
        userMsg = userMsg.replace("!", "");
        userMsg = userMsg.replace("?", "");



        //Bring out the dancing lobsters
        if (userMsg == "bring out the dancing lobsters") {
            let lobstersEmbed = new Discord.RichEmbed();
            lobstersEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/584238997598109706/dancing_lobsters.gif`);
            message.channel.send(lobstersEmbed);
            return true;
        }



        //Post that dog
        if (userMsg === "post that dog") {
            let dogEmbed = new Discord.RichEmbed();
            dogEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/637082158334214164/chrome_2019-10-24_17-17-01.png`);
            message.channel.send(dogEmbed);
            return true;
        }



        //Post that hamster
        if (userMsg === "post that hamster") {
            let hamEmbed = new Discord.RichEmbed();
            hamEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/637083093227798537/chrome_2019-10-24_17-20-24.png`);
            message.channel.send(hamEmbed);
            return true;
        }



        //Post him
        if (userMsg === "post him") {
            let himEmbed = new Discord.RichEmbed();
            himEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/651551194572914716/hamburglar.jpg`);
            message.channel.send(himEmbed);
            return true;
        }



        //React to messages containing a reference to bbill
        if (userMsg.includes("big bill") || userMsg.includes("bbill") || userMsg.includes("bill")) {
            if (Math.ceil(Math.random() * 100) <= 10) message.react("👁");
        }



        //React to messages containing the word "fuck" if the message before that was from bbill
        if (userMsg.includes("fuck")) {
            message.channel.fetchMessages({ limit: 2 })
                .then(messages => {
                    //Check if the message before the one the user sent was from billiams himself
                    if (messages.last().author.bot && messages.last().author.id == config.id) {
                        messages.first().react(`😠`);
                    }
                })
                .catch(console.error);
        }



        //If the user says the secret phrase, give them the achievement
        if (secretPhrases.includes(userMsg)) {
            message.react(`😮`);
        }



        //If the user says 420, check the time to see if they get the achievement
        if (userMsg == "420") {
            let today = new Date();
            let curHour = (today.getUTCHours() > 12) ? today.getUTCHours() - 12 : today.getUTCHours();
            let curMinute = today.getUTCMinutes();
            if (curHour == 4 && curMinute == 20) {
                message.react(`🍆`);
            }
        }



        //React to messages containing swear words
        let totalSwearCount = 0;

        for (let i = 0; i < swears.length; i++) {
            let regExObj = new RegExp(swears[i], "g");
            totalSwearCount += (userMsg.match(regExObj) || []).length;
        }

        if (totalSwearCount > 0) {
            dbUtils.addMiscDataValue(message.author, "swears_spoken", totalSwearCount);
        }

        return false;
        
    }
    
};