const utilitiesModule = require('../../utilities');

const dataLoc = "./data/general_data/userData.json";



module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile(dataLoc, function (userDataJson) {

        //Sort users in order of power and list them
        let powerRankingsString = `- - - - - - - - - -\n`;
        let userArray = [];
        for (let userID in userDataJson) {  //Get all users that have the "power" property
            if (userDataJson[userID].hasOwnProperty("power")) {
                userArray.push(userDataJson[userID]);
            }
        }
        userArray.sort(function(a,b){ return a.power - b.power });  //Sort them by their power property, from lowest to highest
        userArray.reverse();
        for (let i = 0; i < userArray.length; i++) {
            powerRankingsString = powerRankingsString.concat(`**${userArray[i].username}:** ${userArray[i].power}\n`);
        }
        powerRankingsString = powerRankingsString.concat(`- - - - - - - - - -`);

        message.channel.send(powerRankingsString);
    
    });
}

module.exports.help = {
    name: "powerrankings"
}