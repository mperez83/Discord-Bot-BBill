const config = require("../../data/general_data/config.json");
const utilitiesModule = require('../utilities');



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
    checkForRandomEvents: function(message) {

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