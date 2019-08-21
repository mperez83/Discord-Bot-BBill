const Discord = require("discord.js");

const genUtils = require("./general_utilities");

function pageTurnFilter (reaction, user) {
    return user.id != "315755145365553155" && (reaction.emoji.name === '⬅' || reaction.emoji.name ==='➡');
};

const collectorDuration = 20000;



class EmbedList {

    constructor(message, list, nameOfList, attribToList, entriesPerPage) {
        this.message = message;
        this.list = list;
        this.nameOfList = nameOfList;
        this.attribToList = attribToList;
        this.entriesPerPage = entriesPerPage;

        this.listMessage = undefined;
        this.page = 1;
    }

    createMessage(startEntryNumber=1) {
        if (startEntryNumber != 1) this.setPageToEntryNumber(startEntryNumber);

        let initList = new Discord.RichEmbed();
        initList.addField(this.nameOfList, this.getEntriesOnPage());

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
        updatedList.addField(this.nameOfList, this.getEntriesOnPage());
        this.listMessage.edit(updatedList);
    }

    getEntriesOnPage() {
        let returnMsg = ``;

        let curIndex = Math.max(0, (this.page - 1) * this.entriesPerPage);            //Math.max so that the curIndex is never -1
        let endIndex = Math.min(curIndex + this.entriesPerPage, this.list.length);    //Math.max so that the endIndex doesn't exceed the length of the list

        while (curIndex < endIndex) {
            returnMsg += `**__${curIndex + 1}:__** ${this.list[curIndex][this.attribToList]}\n`;
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

    setPageToEntryNumber(entryNumber) {
        this.page = Math.ceil(entryNumber / this.entriesPerPage);
    }

}
module.exports.EmbedList = EmbedList;



class SpecialEmbedList extends EmbedList {

    constructor(message, list, nameOfList, attribToList, entriesPerPage, parenthesisAttrib) {
        super(message, list, nameOfList, attribToList, entriesPerPage);
        this.parenthesisAttrib = parenthesisAttrib;
    }

    getEntriesOnPage() {
        let returnMsg = ``;

        let curIndex = Math.max(0, (this.page - 1) * this.entriesPerPage);            //Math.max so that the curIndex is never -1
        let endIndex = Math.min(curIndex + this.entriesPerPage, this.list.length);    //Math.max so that the endIndex doesn't exceed the length of the list
        
        while (curIndex < endIndex) {
            returnMsg += `**__${curIndex + 1}:__** (${this.list[curIndex][this.parenthesisAttrib]}) ${this.list[curIndex][this.attribToList]}\n`;
            curIndex++;
        }

        return returnMsg;
    }

}
module.exports.SpecialEmbedList = SpecialEmbedList;