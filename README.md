# Discord-Bot-BBill
A chat bot for discord, utilizing <a href="https://github.com/hydrabolt/discord.js/">discord.js</a>

Its functionalities are mostly for entertainment purposes. Commands range from querying Google Images for a specified image, posting random image files from a specific directory, utilizing GraphicsMagick and ImageMagick to modify images posted in chat, and so on.

This bot must have the following permissions in order to function correctly:

- General Permissions:
  * Read Text Channels & See Voice Channels
  * Manage Channels (this one is so that Big Bill can create a "bill-bayou" to send certain messages to, rather than spamming other channels)

- Text Permissions:
  * Send Messages
  * Embed Links
  * Attach Files
  * Read Message History
  * Add Reactions

- Voice Permissions:
  * Connect
  * Speak
  * Use Voice Activity



# Normal Commands
- !craft:			Composes a random crafting recipe out of emotes
- !garfield:			Posts a random garfield comic
- !gif (searchName):		Searches google for the specified input and posts the first gif found
- !image (searchName):		Searches google for the specified input and posts the first image found
- !index (indexName):		Indexes the most recently posted image (within ten messages) under a given name
- !indexCall [indexName]:	Posts a random index, or a specific index if an indexName is supplied
- !liststats [@user]:		Lists all of the caller's stats, or a specific user's stats if @user is supplied
- !power:			Assesses the caller's power level
- !powercheck:			Checks the caller's power level, and displays when next they can use the !power command
- !powerrankings:		Displays the powerrankings of all known users
- !prestige:			Enhances the caller if their power level is admirable
- !pride:			Posts a random pride flag
- !rgif (searchName):		Searches google for the specified input and posts a random gif from the first 50 results
- !rimage (searchName):		Searches google for the specified input and posts a random image from the first 50 results
- !sfw:				Purges the chat of its sins
- !speak [audioName]:		Plays a random audio file in all of the servers Big Bill is in, or a specific audio file if audioName is supplied
- !topic [newTopic]:		Displays current topic, or changes it to a new one if newTopic is supplied
- !urban [searchName]:		Posts a random Urban Dictionary article, or a specific one if searchName is supplied
- !weight			Posts how large Big Bill is in gigabytes

# Image Unbox Commands
- !fumika:	Posts a random fumika from the fumika directory
- !ham:		Posts a random ham from the hamster directory
- !shibe:	Posts a random shibe from the shibe directory

# Magik Commands (these apply GraphicsMagick manipulations to the most recent images posted in the channel)
- !amama:	Cuts the image in half, and reflects the right half of the image onto the left half
- !average:	Averages the image
- !carbonite:	Freezes the image in carbonite
- !deepfry:	Deepfries the image
- !deflate:	Deflates the image
- !distort:	Distorts the image with liquid rescaling
- !doge:	Creates a doge that's as long as there are o's in the command call
- !emotify:	Makes the image less than 256kb
- !enhance:	Applies random modifications to the image
- !giygas:	???
- !heatmap:	Generates a heatmap of the image
- !inflate:	Inflates the image
- !inkblot:	Turns the image into an inkblot
- !intensify:	Intensifies the image
- !irradiate:	Irradiates the image
- !melt:	Melts the image
- !obabo:	Cuts the image in half, and reflects the left half of the image onto the right half
- !singe:	Singes the image
- !spider:	Creates a spider out of the image
- !undulate:	Undulates the image



# Todo:
The trello board containing all upcoming features can be found here: https://trello.com/b/fYoxfMoT/big-bills-board

# Currently used modules:
- request
- urban-dictionary
- node-gyp
- node-opus
- gm
- request-promise
- garfield
- get-folder-size
- htmlparser2