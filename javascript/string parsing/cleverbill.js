const utilitiesModule = require('../utilities');

module.exports = {

    //Make big bill answer questions
    parseTextForQuestions: function(message) {
        if (message.mentions.users.size == 1 && message.mentions.users.exists("id", "315755145365553155")) {

            let userMsg = message.content;
            if (!userMsg.startsWith("<@315755145365553155>")) return;   //Only respond to users that start their message with a bbill mention

            userMsg = userMsg.replace("<@315755145365553155>", "");

            if (!userMsg) { //If the user just @'s Big Bill with no message
                message.channel.send("What? " + utilitiesModule.getRandomNameInsult());
                return true;
            }

            if (userMsg == userMsg.toUpperCase()) {
                message.channel.send("don't yell at me :(");
                return true;
            }

            userMsg = userMsg.toLowerCase();
            userMsg = userMsg.replace("'", "");
            userMsg = userMsg.replace(".", "");
            msgArray = userMsg.split(" ");
            if (msgArray[0] == "") msgArray.splice(0, 1);
            let msgType = 0;

            for (let i = 0; i < msgArray.length; i++) {
                //Magic 8 Ball questions
                if (msgArray[i] == "should" || msgArray[i] == "shouldnt"
                    || msgArray[i] == "can" || msgArray[i] == "cant"
                    || msgArray[i] == "do" || msgArray[i] == "dont"
                    || msgArray[i] == "does" || msgArray[i] == "doesnt"
                    || msgArray[i] == "did" || msgArray[i] == "didnt"
                    || msgArray[i] == "will" || msgArray[i] == "would" || msgArray[i] == "wouldnt"
                    || msgArray[i] == "were" || msgArray[i] == "werent"
                    || msgArray[i] == "are" || msgArray[i] == "arent"
                    || msgArray[i] == "is" || msgArray[i] == "isnt"
                    || msgArray[i] == "have" || msgArray[i] == "havent"
                    || msgArray[i] == "has" || msgArray[i] == "hasnt"
                    || msgArray[i] == "am") { msgType = 1; break; }
                //Who/Whom questions
                if (msgArray[i] == "who" || msgArray[i] == "whom"
                    || msgArray[i] == "whos" || msgArray[i] == "whomstve") { msgType = 2; break; }
                //Where questions
                if (msgArray[i] == "where") { msgType = 3; break; }
                //When questions
                if (msgArray[i] == "when") { msgType = 4; break; }
                //How much/many questions
                if (msgArray[i] == "how") { msgType = 5; break; }
                //Unanswerable questions
                if (msgArray[i] == "what" || msgArray[i] == "whats" || msgArray[i] == "whatll"
                    || msgArray[i] == "why" || msgArray[i] == "whys"
                    || msgArray[i] == "which" || msgArray[i] == "whichll") { msgType = 6; break; }
            }

            switch (msgType) {
                case 0:
                    message.channel.send("You have to ask something, " + utilitiesModule.getRandomNameInsult());
                    break;

                case 1:
                    let orAmount = 0;
                    for (let i = 0; i < msgArray.length; i++)
                        if (msgArray[i] == "or")
                            orAmount++;

                    if (orAmount <= 0) {
                        let magic8BallAnswers = [
                            "It is certain",
                            "It is decidedly so",
                            "Without a doubt",
                            "Yes definitely",
                            "You may rely on it",
                            "As I see it, yes",
                            "Most likely",
                            "Outlook good",
                            "Yes",
                            "Signs point to yes",
                            "Reply hazy try again",
                            "Ask again later",
                            "Better not tell you now",
                            "Cannot predict now",
                            "Concentrate and ask again",
                            "Don't count on it",
                            "My reply is no",
                            "My sources say no",
                            "Outlook not so good",
                            "Very doubtful"
                        ];
                        message.channel.send(magic8BallAnswers[Math.floor(Math.random() * magic8BallAnswers.length)]);
                    }
                    else {
                        let prefixes = ["Probably", "Most likely", "Almost certainly", "Definitely"];
                        message.channel.send(`${prefixes[Math.floor(Math.random() * prefixes.length)]} option ${Math.ceil(Math.random() * (orAmount + 1))}`);
                    }

                    break;

                case 2:
                    message.channel.send(message.channel.members.random().displayName);
                    break;

                case 3:
                    locations = [
                        "Somewhere in " + message.channel.members.random().displayName + "'s house",
                        "Somewhere in __**my**__ house",
                        "Probably somewhere at AGDQ"
                    ];
                    message.channel.send(locations[Math.floor(Math.random() * locations.length)]);
                    break;

                case 4:
                    let times = [];
                    let pastTense = false;
                    for (let i = 0; i < msgArray.length; i++) {
                        if (msgArray[i] == "was" || msgArray[i] == "were" || msgArray[i] == "did") {
                            pastTense = true;
                            break;
                        }
                    }
                    if (pastTense) {
                        times = [
                            "Yesterday",
                            "Last week",
                            "Two days ago",
                            "An hour ago",
                            "About " + Math.ceil(1 + Math.random() * 22) + " hours and " + Math.ceil(1 + Math.random() * 58) + "minutes ago",
                            "A month ago, I think?",
                            "Last year",
                            "June 27th, 1980",
                            "When I was two millennia old",
                            "Sometime in 2007",
                            "Sometime in the 90s",
                            "Never"
                        ];
                    }
                    else {
                        times = [
                            "At 8pm",
                            "In five (5) minutes",
                            "In a little over an hour",
                            "Tomorrow",
                            "The day after tomorrow",
                            "Next Wednesday",
                            "Sometime in March",
                            "On New Years Eve",
                            "In about " + Math.ceil(1 + Math.random() * 22) + " hours and " + Math.ceil(1 + Math.random() * 58) + " minutes",
                            //"When " + message.channel.members.random().displayName + " loses their virginity",
                            "At the heat death of the universe"
                        ];
                    }
                    message.channel.send(times[Math.floor(Math.random() * times.length)]);
                    break;

                case 5:
                    let amounts = [];
                    let quantityType = 0;
                    for (let i = 0; i < msgArray.length; i++) {
                        if (msgArray[i] == "much") { quantityType = 1; break; }
                        if (msgArray[i] == "many") { quantityType = 2; break; }
                    }
                    switch (quantityType) {
                        case 0:
                            //message.channel.send({ embed: { image: { url: "http://i.imgur.com/nvOiUcW.jpg" } } });
                            message.channel.send("I can't answer that :(");
                            break;
                        case 1:
                            amounts = [
                                "A lot",
                                "A little",
                                //"Enough to fill your ass",
                                "Enough to fill a fuckin book",
                                "A bit",
                                "Too much",
                                "Way too much"
                            ];
                            message.channel.send(amounts[Math.floor(Math.random() * amounts.length)]);
                            break;
                        case 2:
                            amounts = [
                                Math.floor(Math.random() * 100),
                                "Too many",
                                "Way too many",
                                "A few"
                            ];
                            message.channel.send(amounts[Math.floor(Math.random() * amounts.length)]);
                            break;
                    }
                    break;

                case 6:
                    message.channel.send("I can't answer that :(");
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