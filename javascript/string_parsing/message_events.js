const fs = require("fs");

const genUtils = require('../command_utilities/general_utilities');
const ahm = require("../command_utilities/achievement_handler");

const emojiSampling = [
    '😊', '😬', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😉',
    '😊', '🙂', '🙃', '☺', '😋', '😌', '😍', '😘', '😗', '😙',
    '😚', '😜', '😝', '😛', '🤑', '🤓', '😎', '🤗', '😏', '😶',
    '😐', '😑', '😒', '🙄', '🤔', '😳', '😞', '😟', '😠', '😡',
    '😔', '😕', '🙁', '☹', '😣', '😖', '😫', '😩', '😤', '😮',
    '😱', '😨', '😰', '😯', '😦', '😧', '😢', '😥', '😪', '😓',
    '😭', '😵', '😲', '🤐', '😷', '🤒', '🤕', '😴', '💩', '😹',
    '👺', '👍', '👎', '✌', '👌', '👁', '👅', '👃', '👀', '🤘',
    '🖕', '🌝', '🍆', '🍑', '💯', '💙', '💚', '💛', '❤', '💜',
    '🅰', '🅱'
];



module.exports = {

    //Check for all random events on every single message
    handleEvents: (message) => {



        //Record how many characters someone just typed to their data file
        let user = message.author;
        genUtils.readJSONFile("./data/general_data/user_data.json", (userDataJson) => {
            if (!userDataJson[user.id]) userDataJson[user.id] = {username: user.username, asciiTyped: 0};
            userDataJson[user.id].asciiTyped += message.content.length;

            //If the user has typed a LOT, make big bill react and increase the user's wisdomShared stat by 1
            if (userDataJson[user.id].asciiTyped >= 10000) {
                message.react("💬");
                userDataJson[user.id].asciiTyped = 0;
                if (!userDataJson[user.id].wisdomShared) userDataJson[user.id].wisdomShared = 0;
                userDataJson[user.id].wisdomShared++;
            }

            fs.writeFile("./data/general_data/user_data.json", JSON.stringify(userDataJson, null, 4), (err) => { if (err) console.error(err) });
        });



        //1 in 10,000 chance of big bill reacting with 20 random emoji
        if (Math.ceil(Math.random() * 10000) == 69) {
            let clonedArrayOfEmoji = [...emojiSampling];

            for (let i = 0; i < 20; i++) {
                let randomIndex = Math.floor(Math.random() * clonedArrayOfEmoji.length);
                message.react(clonedArrayOfEmoji[randomIndex]);
                clonedArrayOfEmoji.splice(randomIndex, 1);
            }
        }

        

        //1 in 100,000 chance of big bill giving the Just Really Lucky achievement
        if (Math.ceil(Math.random() * 100000) == 69) {
            ahm.awardAchievement(message, ahm.achievement_list_enum.JUST_REALLY_LUCKY);
        }

    }
    
};