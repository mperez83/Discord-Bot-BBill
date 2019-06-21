# Discord-Bot-BBill
A chat bot for discord, utilizing <a href="https://github.com/hydrabolt/discord.js/">discord.js</a>

It's a relatively simple bot with virtually no practical purposes; I'm mostly working on it to better my understanding of JavaScript and node.js. It has some commands, and basic text parsing for periodic silly interactions.

# Commands:
- !gif (searchName): Searches google for the specified input and posts the first gif found
- !image (searchName): Searches google for the specified input and posts the first image found
- !index (imageName): Indexes the most recently posted image (within ten messages) under a given name
- !indexCall [imageName]: Posts the image under the given index name (posts a random index if unspecified)
- !liststats: Lists all of the caller's stats
- !power: Assesses the caller's power level
- !powercheck: Checks the caller's power level, and displays when next they can use the !power command
- !powerrankings: Displays the powerrankings of all known users
- !prestige: Enhances the caller if their power level is admirable
- !rgif (searchName): Searches google for the specified input and posts a random gif from the first 50 results
- !rimage (searchName): Searches google for the specified input and posts a random image from the first 50 results
- !sfw: Purges the chat of its sins
- !shibe: Posts a random shibe from the gallery
- !speak [audioName]: Plays the specified audio file to all servers (plays a random one if unspecified)
- !topic [newTopic]: Displays current topic, or changes it to a new one
- !urban [searchName]: Searches urban dictionary for the specified input and posts the article for it (grabs a random article if unspecified)
- some secret commands

# Installation
- Install node.js
- Clone this repo to some directory
- Create your own discord bot from their website
- Get that bot's token and set it inside the data/config.json
- Set all the other data/config.json
- Run start.bat

# Todo:
- Track who indexes something
- Achievements
- Globally announce when someone gets a power of 69
- Globally announce when someone gets a power of 1
- Alphabetically sort stats
- Fix index list display (have it show through multiple pages of a message)
- Fix audio list display (have it show through multiple pages of a message)
- Make shibe/indexcall/urban messages pretty by combining them into one embeded message

# Currently used modules:
- request
- urban-dictionary
- node-gyp
- node-opus
- gm
- request-promise
