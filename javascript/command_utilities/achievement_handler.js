const fs = require("fs");

const genUtils = require("./general_utilities");

const achList = require("./achievement_list.json");
module.exports.achList = achList;

const achievementDataLoc = "./data/general_data/user_achievement_data.json";

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
    LOYAL_LABOURER: "Loyal Labourer",
    SAILOR_MOUTH: "Sailor Mouth",
    FAULTY_SLEUTH: "Faulty Sleuth",
    CHITTER_CHATTER: "Chitter-Chatter"
}
module.exports.achievement_list_enum = achievement_list_enum;



//Return an array of the specified user's achievements
function getUserAchievementObj(userID, callback) {
    updateUserAchievementData(userID, () => {
        genUtils.readJSONFile(achievementDataLoc, (uadJson) => {
            callback(uadJson[userID]);
        });
    });
}
module.exports.getUserAchievementObj = getUserAchievementObj;



//Makes sure the user has an entry for every achievement in achList
function updateUserAchievementData(userID, callback) {
    let achNames = Object.keys(achList);
    achNames.sort();

    genUtils.readJSONFile(achievementDataLoc, (uadJson) => {
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

        fs.writeFile(achievementDataLoc, JSON.stringify(uadJson, null, 4), (err) => {
            if (err) console.error(err)
            callback();
        });
    });
}
module.exports.updateUserAchievementData = updateUserAchievementData;



//Resets all of the user's achievement data back to default
function resetUserAchievementData(userID, callback) {
    let achNames = Object.keys(achList);
    achNames.sort();

    genUtils.readJSONFile(achievementDataLoc, (uadJson) => {
        uadJson[userID] = {achievements: {}, gamer_score: 0};

        for (let i = 0; i < achNames.length; i++) {
            uadJson[userID].achievements[achNames[i]] = false;
        }

        fs.writeFile(achievementDataLoc, JSON.stringify(uadJson, null, 4), (err) => {
            if (err) console.error(err);
            callback();
        });
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
            genUtils.readJSONFile(achievementDataLoc, (uadJson) => {
                uadJson[message.author.id].achievements = userAchObj.achievements;
                uadJson[message.author.id].gamer_score += achList[achName].gamer_score;
                fs.writeFile(achievementDataLoc, JSON.stringify(uadJson, null, 4), (err) => {
                    if (err) console.error(err);
                    message.react(`❗`);
                });
            });
        }
    });
}
module.exports.awardAchievement = awardAchievement;