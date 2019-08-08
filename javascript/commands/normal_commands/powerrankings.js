module.exports.run = async (bot, message, args) => {

    message.channel.send(`F`);

    /*genUtils.readJSONFile(dataLoc, (userDataJson) => {

        //Sort users in order of power and list them
        let powerRankingsString = `- - - - - - - - - -\n`;
        let userArray = [];
        for (let userID in userDataJson) {  //Get all users that have the "power" property
            if (userDataJson[userID].hasOwnProperty("power")) {
                userArray.push(userDataJson[userID]);
            }
        }
        userArray.sort((a,b) => { return a.power - b.power });  //Sort them by their power property, from lowest to highest
        userArray.reverse();
        for (let i = 0; i < userArray.length; i++) {
            powerRankingsString = powerRankingsString.concat(`**${userArray[i].username}:** ${userArray[i].power}\n`);
        }
        powerRankingsString = powerRankingsString.concat(`- - - - - - - - - -`);

        message.channel.send(powerRankingsString);
    
    });*/

}

module.exports.help = {
    name: "powerrankings",
    description: "Displays the power levels of all known users",
    usage: "!powerrankings",
    example: "!powerrankings",
    funFacts: [
        "Power rankings used to be actively updated in a channel called \"big-bills-bot-chamber\". This, however, required Big Bill to have permissions \
        that he might not have, such as creating the channel if it didn't exist, and setting the permissions within the channel. Furthermore, the list could \
        theoretically break the 2000 character limit of messages. Because of these reasons, the command was changed to post the list of users in a more \
        compact format."
    ]
}