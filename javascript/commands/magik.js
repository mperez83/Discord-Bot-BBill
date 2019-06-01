const gm = require("gm");

module.exports.run = async (bot, message, args) => {
    message.channel.send({ files: ["./graphics/testImage.png"]});
    gm("./graphics/testImage.png")
        .implode(-1.2)
        .write("./graphics/resultImage.png", function(err) {
            if (err) console.log(err);
            message.channel.send({ files: ["./graphics/resultImage.png"]});
        });
    
    /*let filename = Date.now();
    let pos = 62;
    let bodywidth = 15;
    let command;
    
    command = message.content.split(/\s/)[0];
    
    let a = command.split("a").length-2;
    if (a > 20) { a = 20; }
    let catlength = pos+a*bodywidth;
    
    let catimg = gm()
        .in("-page", "+0+0")
        .in("./static/cat/catbutt.png");
    
    for(pos; pos < catlength; pos += bodywidth) {
        catimg
            .in("-page", "+"+pos+"+0")
            .in("./static/cat/catbody.png");
    }
    
    catimg
        .in("-page", "+"+pos+"+0")
        .in("./static/cat/cathead.png")
        .background("transparent")
        .mosaic()
        .write("./static/cat/"+filename+".png", function(e){
            if(e) { console.log(e); }
            bot.sendFile(message.channel.id, "./static/cat/"+filename+".png", "cat.png", function(){
                if(e) { console.log(e); }
                fs.unlink("./static/cat/"+filename+".png", function(e){
                    if(e) { console.log(e); }
                });
            });
        });*/
}

module.exports.help = {
    name: "magik"
}