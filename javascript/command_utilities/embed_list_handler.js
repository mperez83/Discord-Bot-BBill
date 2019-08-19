const Discord = require("discord.js");

function pageTurnFilter (reaction, user) {
    return user.id != "315755145365553155" && (reaction.emoji.name === '⬅' || reaction.emoji.name ==='➡');
};

const collectorDuration = 10000;





class EmbedList {

    constructor(message, list, col1, col2) {
        this.message = message;
        this.listMessage = undefined;
        this.list = list;
        this.col1 = col1;
        this.col2 = col2;
        this.page = 1;
        this.entriesPerPage = 10;
        this.createMessage();
    }

    createMessage() {
        let initList = new Discord.RichEmbed();
        initList.addField(`Power Rankings`, this.getEntriesOnPage());
        this.message.channel.send(initList)
            .then((sentMsg) => {
                this.listMessage = sentMsg;
                sentMsg.react(`⬅`)
                    .then(() => sentMsg.react(`➡`))
                    .then(() => {
                        let collector = sentMsg.createReactionCollector(pageTurnFilter, { time: collectorDuration });
                        collector.on('collect', (reaction, reactionCollector) => {
                            switch (reaction.emoji.name) {
                                case `⬅`:
                                    this.prevPage();
                                    break;
                                case `➡`:
                                    this.nextPage();
                                    break;
                            }
                        });
                        collector.on('end', () => {
                            sentMsg.react(`❌`);
                        });
                    });
            });
    }

    updateMessage() {
        let updatedList = new Discord.RichEmbed();
        updatedList.addField(`Power Rankings`, this.getEntriesOnPage());
        this.listMessage.edit(updatedList);
    }

    getEntriesOnPage() {
        let returnMsg = ``;

        let curIndex = Math.max(0, (this.page - 1) * this.entriesPerPage);            //Math.max so that the curIndex is never -1
        let endIndex = Math.min(curIndex + this.entriesPerPage, this.list.length);    //Math.max so that the endIndex doesn't exceed the length of the list

        while (curIndex < endIndex) {
            returnMsg += `${curIndex + 1}: (${this.list[curIndex][this.col1]}) ${this.list[curIndex][this.col2]}\n`;
            curIndex++;
        }

        return returnMsg;
    }

    prevPage() {
        if (this.page == 1) return;
        this.page--;
        this.updateMessage();
    }

    nextPage() {
        if (this.page == Math.ceil(this.list.length / this.entriesPerPage)) return;
        this.page++;
        this.updateMessage();
    }

}
module.exports.EmbedList = EmbedList;