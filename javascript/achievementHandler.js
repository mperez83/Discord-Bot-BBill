const fs = require("fs");

const utilitiesModule = require("./utilities");

const achievementDataLoc = "./data/general_data/userAchievementData.json";

const achievement_list_enum =
{
    FIRST_PRESTIGE: "First Prestige!",
    FOUR_TWENTY: "420",
    POWER_HUNGRY: "Power Hungry",
    TIME_DILATION: "Time Dilation",
    JUST_REALLY_LUCKY: "Just Really Lucky",
    SECRET_PHRASE: "Secret Phrase",
    SECRET_PORYGON: "Secret Porygon",
    LOVELY_KOMUGI: "Lovely Komugi",
    SOCIAL_DEVIANT: "Social Deviant",
    SHIBA_LOVER: "Shiba Lover",
    LOYAL_LABOURER: "Loyal Labourer"
}

const achievement_list = 
{

    "First Prestige!":
    {
        description: "Prestige for the first time",
        gamer_score: 10,
        secret: false
    },

    "420":
    {
        description: "Say the magic number at the witching hour",
        gamer_score: 10,
        secret: false
    },

    "Power Hungry":
    {
        description: "Attempt to do a power call immediately after having done one",
        gamer_score: 5,
        secret: false
    },

    "Time Dilation":
    {
        description: "Attempt to do a power call with 0h 0m 0s left",
        gamer_score: 15,
        secret: false
    },

    "Just Really Lucky":
    {
        description: "There's a 1 in 100,000 chance every message to get this achievement",
        gamer_score: 0,
        secret: true
    },

    "Secret Phrase":
    {
        description: "Say the secret phrase",
        gamer_score: 10,
        secret: true
    },

    "Secret Porygon":
    {
        description: "Find the secret porygon",
        gamer_score: 5,
        secret: true
    },

    "Lovely Komugi":
    {
        description: "Unboxed a legendary komugi",
        gamer_score: 20,
        secret: false
    },

    "Social Deviant":
    {
        description: "Be a special snowflake",
        gamer_score: 5,
        secret: false
    },

    "Shiba Lover":
    {
        description: "Unboxed over 1000 shibes",
        gamer_score: 20,
        secret: false
    },

    "Loyal Labourer":
    {
        description: "Crafted over 500 items",
        gamer_score: 10,
        secret: false
    }

}



module.exports.achievement_list = achievement_list;
module.exports.achievement_list_enum = achievement_list_enum;



//Return an array of the specified user's achievements
function getUserAchievementObj(userID, callback) {

    updateUserAchievementData(userID, () => {
        utilitiesModule.readJSONFile(achievementDataLoc, function (uadJson) {
            callback(uadJson[userID]);
        });
    });

}
module.exports.getUserAchievementObj = getUserAchievementObj;



//Makes sure the user has an entry for every achievement in achievement_list
function updateUserAchievementData(userID, callback) {
    let achNames = Object.keys(achievement_list);
    achNames.sort();

    utilitiesModule.readJSONFile(achievementDataLoc, function (uadJson) {
        if (!uadJson[userID]) uadJson[userID] = {achievements: {}, gamer_score: 0};

        for (let i = 0; i < achNames.length; i++) {
            if (!uadJson[userID].achievements[achNames[i]]) uadJson[userID].achievements[achNames[i]] = false;
        }

        //Rebuild the achievement list object in alphabetical order
        tempObj = Object.assign(uadJson[userID].achievements);
        uadJson[userID].achievements = {};

        for (let i = 0; i < achNames.length; i++) {
            uadJson[userID].achievements[achNames[i]] = tempObj[achNames[i]];
        }

        fs.writeFileSync(achievementDataLoc, JSON.stringify(uadJson, null, 4));

        callback();
    });
}
module.exports.updateUserAchievementData = updateUserAchievementData;



//Resets all of the user's achievement data back to default
function resetUserAchievementData(userID, callback) {
    let achNames = Object.keys(achievement_list);
    achNames.sort();

    utilitiesModule.readJSONFile(achievementDataLoc, function (uadJson) {
        uadJson[userID] = {achievements: {}, gamer_score: 0};

        for (let i = 0; i < achNames.length; i++) {
            uadJson[userID].achievements[achNames[i]] = false;
        }

        fs.writeFileSync(achievementDataLoc, JSON.stringify(uadJson, null, 4));

        callback();
    });
}
module.exports.resetUserAchievementData = resetUserAchievementData;



//Gives someone an achievement
function awardAchievement(message, achName) {
    getUserAchievementObj(message.author.id, (userAchObj) => {
        if (userAchObj.achievements[achName] == undefined) {
            message.channel.send(`Michael made me attempt to assign an invalid achievement "${achName}" to someone, go yell at him`);
            return;
        }

        if (userAchObj.achievements[achName] == true) {
            return;
        }
        else {
            userAchObj.achievements[achName] = true;
            utilitiesModule.readJSONFile(achievementDataLoc, function (uadJson) {
                uadJson[message.author.id].achievements = userAchObj.achievements;
                uadJson[message.author.id].gamer_score += achievement_list[achName].gamer_score;
                fs.writeFileSync(achievementDataLoc, JSON.stringify(uadJson, null, 4));
                message.react(`❗`);
            });
        }
    });
}
module.exports.awardAchievement = awardAchievement;