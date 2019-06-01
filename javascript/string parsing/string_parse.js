const utilitiesModule = require('../utilities');

module.exports = {

    //Parse message for bad emotes
    parseTextForBadEmotes: function(message) {

        let badEmotes = [
            "<:GWfroggyFeelsUpMan:400751139563241473>",
            "<:GWqlabsFeelsKCHHH:403294831893282820>",
            "<:GWqlabsFeelsFunnyMan:398950861361119233>",
            "<:FeelsCreep:416072792732073987>"
        ];

        for (let i = 0; i < badEmotes.length; i++) {
            if (message.content.includes(badEmotes[i])) {
                utilitiesModule.incrementUserDataValue(message.author, "sin", 1);
            }
        }

        //Don't return true/false, just increment the value and move on

    },



    //Parse message for @everyone
    parseTextForAtEveryone: function(message) {

        if (message.mentions.everyone) {
            message.channel.send(">:0");
            return true;
        }

        return false;

    },



    //Parse message for string of text, which must match punctuation and capitalization exactly
    parseTextForSpecificString: function(message) {
        
        let userMsg = message.content;



        //Quieres?
        if (userMsg == "quieres?") {
            let dudCheck = Math.floor(Math.random() * 20);
            if (dudCheck == 0) {
                //message.channel.send({ files: ["./graphics/quieres.png"] });
                message.channel.send({
                    embed: {
                        image: {
                            url: "https://cdn.discordapp.com/attachments/527341248214990850/584247880013971466/anti-quieres.png"
                        }
                    }
                });
            }
            else {
                //message.channel.send({ files: ["./graphics/anti-quieres.png"] });
                message.channel.send({
                    embed: {
                        image: {
                            url: "https://cdn.discordapp.com/attachments/527341248214990850/584241610242523136/quieres.png"
                        }
                    }
                });
            }

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

            if (foundNonAChar) {
                //Do nothing
            }
            else {
                if (ACount >= Math.ceil(userMsg.length / 2)) {
                    //message.channel.send({ files: ["./graphics/AaAAAaaaAAaAaaaaAaAAAAAaAaAa.jpg"] });
                    message.channel.send({
                        embed: {
                            image: {
                                url: "https://cdn.discordapp.com/attachments/527341248214990850/584252304992108577/AaAAAaaaAAaAaaaaAaAAAAAaAaAa.jpg"
                            }
                        }
                    });
                    return true;
                }
            }
        }



        //Check for yelling
        if (message.mentions.users.array().length == 0 && userMsg == userMsg.toUpperCase() && userMsg.length >= 10) {
            message.channel.send("stop yelling");
            return true;
        }

        return false;

    },



    //Parse message for string of text, disregarding punctuation and capitalization
    parseTextForLooseString: function(message) {

        let userMsg = message.content;

        userMsg = userMsg.toLowerCase();
        userMsg = userMsg.replace("'", "");
        userMsg = userMsg.replace(".", "");
        userMsg = userMsg.replace("!", "");
        userMsg = userMsg.replace("?", "");

        //msgArray = userMsg.split(" ");
        //if (msgArray[0] == "") msgArray.splice(0, 1);

        //Bring out the dancing lobsters
        if (userMsg == "bring out the dancing lobsters") {
            //message.channel.send({ files: ["./graphics/dancing lobsters.gif"] });
            message.channel.send({
                embed: {
                    image: {
                        url: "https://cdn.discordapp.com/attachments/527341248214990850/584238997598109706/dancing_lobsters.gif"
                    }
                }
            });
            return true;
        }

        return false;
        
    }
    
};