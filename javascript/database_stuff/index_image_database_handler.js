const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/databases/index_image_database.sqlite');

sql.pragma("synchronous = 1");
sql.pragma("journal_mode = wal");



function getIndexedImageByName(guild, indexName) {
    verifyServerIndexTable(guild);

    let indexEntry = sql.prepare(`SELECT * FROM [${guild.id}] WHERE index_name = "${indexName}"`).get();
    if (!indexEntry) {
        indexEntry = {
            index_name: undefined,
            url: undefined,
            culprit: undefined,
            direct_calls: 0,
            accidental_calls: 0
        }
    }
    
    return indexEntry;
}
module.exports.getIndexedImageByName = getIndexedImageByName;

function setImageIndex(guild, updatedIndexEntry) {
    sql.prepare(`INSERT INTO [${guild.id}] (index_name, url, culprit, direct_calls, accidental_calls) VALUES (@index_name, @url, @culprit, @direct_calls, @accidental_calls);`).run(updatedIndexEntry);
    sql.prepare(`INSERT OR REPLACE INTO valid_servers (server_id) VALUES ("${guild.id}");`).run();
}
module.exports.setImageIndex = setImageIndex;

function updateImageIndexData(guild, updatedIndexEntry) {
    sql.prepare(`UPDATE [${guild.id}] SET direct_calls = ${updatedIndexEntry.direct_calls} WHERE index_name = "${updatedIndexEntry.index_name}"`).run();
    sql.prepare(`UPDATE [${guild.id}] SET accidental_calls = ${updatedIndexEntry.accidental_calls} WHERE index_name = "${updatedIndexEntry.index_name}"`).run();
}
module.exports.updateImageIndexData = updateImageIndexData;



function getIndexedImageByUrl(guild, url) {
    verifyServerIndexTable(guild);
    let indexEntry = sql.prepare(`SELECT * FROM [${guild.id}] WHERE url = "${url}"`).get();
    if (!indexEntry) return undefined;
    else return indexEntry;
}
module.exports.getIndexedImageByUrl = getIndexedImageByUrl;

function getRandomIndex(guild) {
    verifyServerIndexTable(guild);
    let indexEntry = sql.prepare(`SELECT * FROM [${guild.id}] ORDER BY RANDOM() LIMIT 1;`).get();
    if (!indexEntry) return undefined;
    else return indexEntry;
}
module.exports.getRandomIndex = getRandomIndex;

function getAllIndices(guild) {
    verifyServerIndexTable(guild);
    return sql.prepare(`SELECT * FROM [${guild.id}]`).all();
}
module.exports.getAllIndices = getAllIndices;

function removeIndex(guild, indexName) {
    verifyServerIndexTable(guild);
    sql.prepare(`DELETE FROM [${guild.id}] WHERE index_name = "${indexName}"`).run();
}
module.exports.removeIndex = removeIndex;



function getValidServer() {
    let validServer = sql.prepare(`SELECT * FROM valid_servers ORDER BY RANDOM() LIMIT 1;`).get();
    if (!validServer) return undefined;
    else return validServer.server_id;
}
module.exports.getValidServer = getValidServer;

function invalidateServer(guild) {
    sql.prepare(`DELETE FROM valid_servers WHERE server_id = "${guild.id}"`).run();
}
module.exports.invalidateServer = invalidateServer;



function verifyServerIndexTable(guild) {
    let serverIndexTable = sql.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='${guild.id}';`).get();
    
    if (!serverIndexTable) {
        console.log(`An index table for ${guild.name} does not exist! Generating one for them now...`);
        sql.prepare(`CREATE TABLE [${guild.id}] (index_name TEXT, url TEXT, culprit TEXT, direct_calls INTEGER, accidental_calls INTEGER)`).run();
    }
}