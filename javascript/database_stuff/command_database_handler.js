const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/databases/command_database.sqlite');

sql.pragma("synchronous = 1");
sql.pragma("journal_mode = wal");

verifyTable("command_data");



function verifyTable(tableToVerify) {
    switch (tableToVerify) {
        
        case "command_data":
            let commandDataTable = sql.prepare("SELECT * FROM sqlite_master WHERE type='table' AND name='command_data';").get();
            if (!commandDataTable) {
                console.log(`Table "command_data" not found! Generating now.`);
                sql.prepare(`CREATE TABLE command_data (command_name TEXT, call_count INTEGER, PRIMARY KEY (command_name));`).run();
            }
            break;
        
        default:
            console.error(`Error: Attempted to verify unknown table "${tableToVerify}"`);
            break;

    }
}

function getCommandData(commandName) {
    let commandEntry = sql.prepare(`SELECT * FROM command_data WHERE command_name="${commandName}"`).get();

    if (!commandEntry) {
        commandEntry = {
            command_name: commandName,
            call_count: 0
        }
    }

    return commandEntry;
}