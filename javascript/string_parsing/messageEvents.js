const fs = require("fs");

const utilitiesModule = require('../utilities');
const config = require("../../data/general_data/config.json");

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
    handleEvents: function(message) {

        //Record how many characters someone just typed to their data file
        let user = message.author;
        utilitiesModule.readJSONFile("./data/general_data/userData.json", function(userDataJson) {
            if (!userDataJson[user.id]) userDataJson[user.id] = {username: user.username, asciiTyped: 0};
            userDataJson[user.id].asciiTyped += message.content.length;

            //If the user has typed a LOT, make big bill react and increase the user's wisdomShared stat by 1
            if (userDataJson[user.id].asciiTyped >= 10000) {
                message.react("💬");
                userDataJson[user.id].asciiTyped = 0;
                if (!userDataJson[user.id].wisdomShared) userDataJson[user.id].wisdomShared = 0;
                userDataJson[user.id].wisdomShared++;
            }

            fs.writeFileSync("./data/general_data/userData.json", JSON.stringify(userDataJson, null, 4));
        });

        //If the user has gone over 10000 characters, make bbill react and reset their asciiTyped stat

        //1 in 10000 chance of big bill reacting with 20 random emoji
        if (Math.ceil(Math.random() * 10000) == 69) {
            let clonedArrayOfEmoji = [...emojiSampling];

            for (let i = 0; i < 20; i++) {
                let randomIndex = Math.floor(Math.random() * clonedArrayOfEmoji.length);
                message.react(clonedArrayOfEmoji[randomIndex]);
                clonedArrayOfEmoji.splice(randomIndex, 1);
            }
        }

    }
    
};