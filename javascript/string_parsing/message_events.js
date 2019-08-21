const dbUtils = require(`../database_stuff/user_database_handler`);

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

        let user = message.author;



        //Handle increasing how much ascii the user has typed
        let userMiscData = dbUtils.getMiscDataEntry(user);
        userMiscData.ascii_typed += message.content.length;
        if (userMiscData.ascii_typed >= 10000) {
            message.react(`💬`);
            userMiscData.ascii_typed = 0;
            userMiscData.wisdom_shared++;
        }
        dbUtils.setMiscDataEntry(userMiscData);



        //1 in 10,000 chance of big bill reacting with 20 random emoji
        if (Math.ceil(Math.random() * 10000) == 69) {
            let clonedArrayOfEmoji = [...emojiSampling];

            for (let i = 0; i < 20; i++) {
                let randomIndex = Math.floor(Math.random() * clonedArrayOfEmoji.length);
                message.react(clonedArrayOfEmoji[randomIndex]);
                clonedArrayOfEmoji.splice(randomIndex, 1);
            }
        }

        

        //1 in 100,000 chance of big bill saying that there was a 1 in 100,000 chance of responding
        if (Math.ceil(Math.random() * 100000) == 69) {
            message.channel.send(`There was a 1 in 100,000 chance of this message appearing, what the hell`);
        }

    }
    
};