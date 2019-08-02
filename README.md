# Discord-Bot-BBill
# Overview
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



# Commands
**Note:** ( ) indicates a required parameter, [ ] indicates an optional parameter.

## Normal Commands
-------------------------
| Command name | Description | Example |
| :------------------ | :------------ | :--------- |
| **!craft** | Composes a random crafting recipe out of the available emotes | !craft |
| **!garfield** | Posts a random garfield comic | !gafrield |
| **!gif (input)** | Searches google for the specified input and posts the first gif found | !gif sad cat dance |
| **!help [command]** | Posts information about the specified command, or links to this page if no command is provided | !help power |
| **!image (input)** | Searches google for the specified input and posts the first image found | !image sad cat |
| **!index (name)** | Indexes the most recently posted image (wihtin ten messages) under the given name | !index when you get the victory royale |
| **!indexcall [name]** | Posts the index under the specified name if one exists, or a random index if no name is provided | !indexcall when you get the victory royale |
| **!liststats [user]** | Lists all of a @'d user's stats, or the caller's stats if no user is provided | !liststats Star |
| **!power** | Assesses the caller's power level | !power |
| **!powercheck** | Checks the caller's power level, and displays when next they can use the !power command | !powercheck |
| **!powerrankings** | Displays the power levels of all known users | !powerrankings |
| **!prestige** | Enhances the caller if their power level is admirable | !prestige |
| **!pride** | Posts a random pride flag, as well as some information about it | !pride |
| **!rgif (input)** | Searches google for the specified input and posts a random gif from the first 50 results | !rgif sad cat dance |
| **!rimage (input)** | Searches google for the specified input and posts a random image from the first 50 results | !rimage sad cat |
| **!scp [number]** | Attempts to post the specified SCP article number, or a random one if no number is provided | !scp 173 |
| **!sfw** | Purges the chat of its sins | !sfw |
| **!speak [name]** | Plays the specified audio file in all of the servers Big Bill is in, or a random audio file if no name is provided | !speak mind flood 2 |
| **!topic [input]** | Changes the topic to the specified input, or displays the current topic if no input is provided | !topic Hello, World! |
| **!urban [input]** | Searches urban dictionary for the specified input and posts the article about it, or posts a random urban dictionary article if no input is provided | !urban (800)-588-2300 |
| **!weight** | Posts how large Big Bill is in gigabytes | !weight |

## Image Unbox Commands
-------------------------
| Command name | Description | Example |
| :------------------ | :------------ | :--------- |
| **!fumika** | Posts a random fumika from the fumika directory | !fumika |
| **!ham** | Posts a random ham from the ham directory | !ham |
| **!shibe** | Posts a random shibe from the shibe directory | !shibe |

Images that are unboxed can be assigned rarities by the caller. Upon the image showing up in the chat, the caller has 15 seconds to say one of the following keywords to assign the image a rarity:

* Common
* Uncommon
* Rare
* Epic
* Legendary

Doing so will permanently mark that image with the supplied rarity.

## Magik Commands
-------------------------
Magik commands perform [GraphicsMagick](https://github.com/aheckmann/gm) operations on the most recently posted image in chat. Big Bill **will not** search farther than ten messages in the past for an image to perform the operation on.

| Command name | Description | Example |
| :------------------ | :-----------: | :--------- |
| **!amama** | Cuts the image in half, and reflects the right half of the image onto the left half | !amama |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527666605396721684/606728891897348097/1564725844079.png) | |
| **!average** | Creates 100 copies of the image, applying random implode operations to each one, and then produces one image which is the average of them all | !average |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527666605396721684/606729612306939905/1564726015554.png) | |
| **!carbonite** | Freezes the image in carbonite | !carbonite |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527341248214990850/606730706420367360/1564726276942.png) | |
| **!deepfry** | Deepfries the image | !deepfry |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527341248214990850/606731003393998848/1564726347233.png) | |
| **!deflate [intensity]** | Deflates the image by the specified intensity (defaults to 1) | !deflate 1 |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527341248214990850/606731390012358666/1564726439974.png) | |
| **!doge** | Creates a doge that's as long as there are o's in the command call | !doooge |
| | ![](https://cdn.discordapp.com/attachments/527341248214990850/606731868578250772/1564726554034.png) | |
| **!emotify** | Makes the image less than 256kb, if it isn't already | !emotify |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png) | |
| **!enhance** | Applies four random GraphicsMagick operations to the image | !enhance |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527341248214990850/606735884007637005/1564727511386.png) | |
| **!giygas** | ??? | !giygas |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527341248214990850/606736183602708492/1564727582205.png) | |
| **!heatmap** | Generates a heatmap of the image | !heatmap |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527341248214990850/606736578945220619/1564727676629.png) | |
| **!inflate [intensity]** | Inflates the image by the specified intensity (defaults to 1) | !inflate 1 |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527341248214990850/606736923586854914/1564727759224.png) | |
| **!inkblot** | Turns the image into an inkblot | !inkblot |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527341248214990850/606737198087274507/1564727824180.png) | |
| **!obabo** | Cuts the image in half, and reflects the left half of the image onto the right half | !obabo |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527341248214990850/606737489058594816/1564727893695.png) | |
| **!singe [intensity]** | Singes the image by the specified intensity (defaults to 1) | !singe 50 |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527341248214990850/606737860489379860/1564727982649.png) | |
| **!spider** | Creates an eldritch spider from the image | !spider |
| | ![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)![](https://cdn.discordapp.com/attachments/527341248214990850/606738342280691712/1564728096783.png) | |

## Advanced Magik Commands
-------------------------
These particular magik commands use a more intricate parameter system that allow for more specific results. The parameter format is based on inputting a letter/value pair, like so:

>!someCommand -(letter) (value)

The letters represent a specific option within the command that can be manipulated; for example, **-s** in a **!distort** call represents the scale option that can be manipulated.  There can be as many letter/value pairs as is necessary for the command call, as long as the letters are valid, and the values for those letters are valid.



| Command name | Description |
| :--------------- | :--------------------------- |
| **!distort** | Distorts the image with liquid rescaling |

### Parameters
| Letter  | Description | Value Type | Min Value | Max Value | Default Value |
| :------ | :------------- | :----------- | :----------- | :----------- | :-------------- |
| **-s** | Scale modifier that determines what percentage scale the image will change to with liquid rescaling before scaling back to 100% | Float | 1 | 99 | 50 |

### Example
![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)

>!distort -s 60

![](https://cdn.discordapp.com/attachments/527341248214990850/606748256948453376/1564730461361.png)



| Command name | Description |
| :---------------- | :---------------- |
| **!intensify** | Intensifies the image |

### Parameters
| Letter  | Description | Value Type | Min Value | Max Value | Default Value |
| :------ | :------------- | :----------- | :----------- | :----------- | :-------------- |
| **-i** | Intensity of which the gif will jolt around | Float | 1 | 90 | 5 |
| **-c** | Frame Count determines how many frames there will be in the resulting gif | Integer | 2 | 20 | 12 |
| **-d** | Frame Delay determines how little delay there is between each frame of the gif | Integer | 2 | 10 | 6 |

### Example
![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)

>!intensify -i 10 -c 16 -d 3

![](https://cdn.discordapp.com/attachments/527341248214990850/606750913348239389/1564731094488.gif)



| Command name | Description |
| :---------------- | :----------------- |
| **!irradiate** | Irradiates the image |

### Parameters
| Letter  | Description | Value Type | Min Value | Max Value | Default Value |
| :------ | :------------- | :----------- | :----------- | :----------- | :-------------- |
| **-s** | Scale modifier that determines what percentage scale the image will change to with liquid rescaling before scaling back to 100% | Float | 10 | 90 | 50 |
| **-c** | Frame Count determines how many frames there will be in the resulting gif | Integer | 2 | 20 | 12 |
| **-d** | Frame Delay determines how little delay there is between each frame of the gif | Integer | 2 | 10 | 6 |

### Example
![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)

>!irradiate -s 60 -c 15 -d 5

![](https://cdn.discordapp.com/attachments/527341248214990850/606752870104039450/1564731560892.gif)



| Command name | Description |
| :-------------- | :--------------- |
| **!melt** | Melts the image |

### Parameters
| Letter  | Description | Value Type | Min Value | Max Value | Default Value |
| :------ | :----------- | :------------- | :---------- | :------------ | :--------------- |
| **-s** | Scale modifier that determines what percentage scale the image will change to with liquid rescaling before scaling back to 100% | Float | 1 | 99 | 25 |
| **-c** | Frame Count determines how many frames there will be in the resulting gif | Integer | 10 | 40 | 24 |
| **-d** | Frame Delay determines how little delay there is between each frame of the gif | Integer | 2 | 10 | 6 |
| **-p** | Ping Pong determines if the gif will reverse back to 100% after reaching the target scale value | Boolean | N/A | N/A | False |
| **-w** | Sin Wave determines if the gif should attempt to ease its scaling motions in accordance to a sin wave | Boolean | N/A | N/A | False |

### Example
![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)

>!melt -s 40 -c 40 -d 4 -p true -w false

![](https://cdn.discordapp.com/attachments/527341248214990850/606754395027406878/1564731923861.gif)



| Command name | Description |
| :----------------- | :---------------- |
| **!undulate** | Undulates the image |

### Parameters
| Letter  | Description | Value Type | Min Value | Max Value | Default Value |
| :------ | :------------- | :----------- | :----------- | :----------- | :-------------- |
| **-i** | Intensity determines how strong the imploding values will be | Float | 0.1 | 10 | 1 |
| **-c** | Frame Count determines how many frames there will be in the resulting gif | Integer | 5 | 30 | 20 |
| **-d** | Frame Delay determines how little delay there is between each frame of the gif | Integer | 2 | 10 | 6 |

### Example
![](https://cdn.discordapp.com/attachments/527666605396721684/606728751291564057/party_pikachu.png)

>!melt -s 40 -c 40 -d 4 -p true -w false

![](https://cdn.discordapp.com/attachments/527341248214990850/606756264206270474/1564732369966.gif)



# Todo
The trello board containing all upcoming features can be found here: https://trello.com/b/fYoxfMoT/big-bills-board

# External modules utilized
* [request](https://www.npmjs.com/package/request)
	* Utilized in anything related to making web calls
* [urban-dictionary](https://www.npmjs.com/package/urban-dictionary)
	* Utilized in the !urban command
* [node-gyp](https://www.npmjs.com/package/node-gyp)
	* ??? Might delete
* [node-opus](https://www.npmjs.com/package/node-opus)
	* Utilized in voice chat related functionalities
* [gm](https://www.npmjs.com/package/gm)
	* Utilized in all magik commands
* [request-promise](https://www.npmjs.com/package/request-promise)
	* Utilized in place of some request calls to make the code a little prettier
* [garfield](https://www.npmjs.com/package/garfield)
	* Utilized in the !garfield command
* [get-folder-size](https://www.npmjs.com/package/get-folder-size)
	* Utilized in the !weight command to more easily determine the size of Big Bill
* [htmlparser2](https://www.npmjs.com/package/htmlparser2)
	* Utilized in the !scp command to more easily parse through the html page
