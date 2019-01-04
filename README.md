# Discord-Bot-BBill
A chat bot for discord, utilizing <a href="https://github.com/hydrabolt/discord.js/">discord.js</a>

It's a relatively simple bot with virtually no practical purposes. I'm mostly working on it to better my understanding of JavaScript and node.js, and provide a few goofs and gaffs for some friends.

# Commands:
- !power: Assesses the caller's power level
- !powercheck: Checks the caller's power level, and displays when next they can use the !power command
- !prestige: Enhances the caller if their power level is admirable
- !liststats: Lists all of the caller's stats
- !topic [newTopic]: Displays current topic or changes it to a new one
- !index (imageName): Indexes the most recently posted image (within ten messages) under a given name
- !indexCall [imageName]: Posts the image under the given index name (posts a random index if unspecified)
- !indexDelete (imageName): Deletes the index under the given name
- !shibe: Posts a random shibe from the gallery
- !speak [audioName]: Plays the specified audio file to all servers (plays a random one if unspecified)
- !sfw: Purges the chat of its sins
- !image (searchName): Searches google for the specified input and posts the first image found
- !rimage (searchName): Searches google for the specified input and posts a random image from the first 50 results
- !gif (searchName): Searches google for the specified input and posts the first gif found
- !rgif (searchName): Searches google for the specified input and posts a random gif from the first 50 results
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
- Format created json files to be readable
- Look for more node.js modules to utilize
- More secret commands
