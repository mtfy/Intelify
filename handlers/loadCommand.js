/***
 *      _____       _       _ _  __       
 *     |_   _|     | |     | (_)/ _|      
 *       | |  _ __ | |_ ___| |_| |_ _   _ 
 *       | | | '_ \| __/ _ \ | |  _| | | |
 *      _| |_| | | | ||  __/ | | | | |_| |
 *     |_____|_| |_|\__\___|_|_|_|  \__, |
 *                                   __/ |
 *                                  |___/ 	
 *										
 *		Author: Motify <coder@outlook.ie> (https://github.com/mtfy)
 *		Copyright © Motify, 2023.
 *		
 */
const chillout = require("chillout");
const readdirRecursive = require("recursive-readdir");
const { resolve, relative } = require("path");
const Logger = require('../utilities/helpers/log.js');

module.exports = async (client) => {
    let interactionsPath = resolve('./commands');
    let interactionFiles = await readdirRecursive(interactionsPath);

    await chillout.forEach(interactionFiles, (interactionFile) => {
        const start = Date.now();
        const rltPath = relative(__dirname, interactionFile);
        const command = require(interactionFile);
		const i = command.name.length, max_i = 3;
        if (i > max_i) {
			Logger(1, `Skipping: "${rltPath}" | The filename exceeded the maximum character count (${i}/${max_i})`);
            return;
        }

        if (!command.name?.length) {
			Logger(1, 'Skipping: The file does not have name');
            return;
        }

        if (client.slash.has(command.name)) {
			Logger(0, `Skipping: "${command.name[1]}" as it has already been loaded`);
            return;
        }

        client.slash.set(command.name, command);
     //   console.log(`[INFO] "${command.type == "CHAT_INPUT" ? `/${command.name.join(" ")}` : `${command.name[0]}`}" ${command.name[1] || ""}  ${command.name[2] || ""} The interaction has been uploaded. (it took ${Date.now() - start}ms)`);
        });

        if (client.slash.size > 0) {
			Logger(0, `Total of ${client.slash.size} interactions were loaded!`);
        } else {
            Logger(1, `No interactions were found. Is everything setup properly?`);
        }
}