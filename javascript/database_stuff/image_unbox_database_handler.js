const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/databases/image_unbox_database.sqlite');

sql.pragma("synchronous = 1");
sql.pragma("journal_mode = wal");



function getAmountUnboxed(imageType, imageName) {
    //Verify unbox_image_table
    let serverIndexTable = sql.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='total_unbox_data';`).get();
    if (!serverIndexTable) {
        console.log(`A total unbox data table does not exist! Generating one now...`);
        sql.prepare(`CREATE TABLE total_unbox_data (image_type TEXT, image_name TEXT, total_unboxed INTEGER, PRIMARY KEY(image_type, image_name))`).run();
    }

    let imageEntry = sql.prepare(`SELECT * FROM total_unbox_data WHERE image_type="${imageType}" AND image_name="${imageName}"`).get();
    if (!imageEntry) {
        imageEntry = {
            image_type: imageType,
            image_name: imageName,
            total_unboxed: 0
        }
    }
    
    return imageEntry;
}
module.exports.getAmountUnboxed = getAmountUnboxed;

function getRarity(guild, imageType, imageName) {
    //Verify guild table
    let serverIndexTable = sql.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='${guild.id}';`).get();
    if (!serverIndexTable) {
        console.log(`A rarity table for ${guild.name} does not exist! Generating one for them now...`);
        sql.prepare(`CREATE TABLE [${guild.id}] (image_type TEXT, image_name TEXT, rarity TEXT, PRIMARY KEY(image_type, image_name))`).run();
    }

    let rarityEntry = sql.prepare(`SELECT * FROM [${guild.id}] WHERE image_type="${imageType}" AND image_name="${imageName}"`).get();
    if (!rarityEntry) {
        rarityEntry = {
            image_type: imageType,
            image_name: imageName,
            rarity: "Not set yet"
        }
    }
    
    return rarityEntry;
}
module.exports.getRarity = getRarity;



function updateAmountUnboxed(updatedEntry) {
    sql.prepare(`INSERT INTO total_unbox_data (image_type, image_name, total_unboxed) VALUES ("${updatedEntry.image_type}", "${updatedEntry.image_name}", ${updatedEntry.total_unboxed}) ON CONFLICT (image_type, image_name) DO UPDATE SET total_unboxed=${updatedEntry.total_unboxed};`).run();
}
module.exports.updateAmountUnboxed = updateAmountUnboxed;

function updateRarity(guild, updatedRarity) {
    sql.prepare(`INSERT INTO [${guild.id}] (image_type, image_name, rarity) VALUES ("${updatedRarity.image_type}", "${updatedRarity.image_name}", "${updatedRarity.rarity}") ON CONFLICT (image_type, image_name) DO UPDATE SET rarity="${updatedRarity.rarity}";`).run();
}
module.exports.updateRarity = updateRarity;