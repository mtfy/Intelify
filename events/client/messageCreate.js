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
const {getUser} = require('../../utilities/helpers/sql.js');
const Logger = require('../../utilities/helpers/log.js');
const chalk = require('chalk');

module.exports = async (client, message) => {
	if (!client.is_ready || typeof message === 'undefined' || !message.hasOwnProperty('author')|| typeof message.author !== 'object' || message.author === null || !message.author.hasOwnProperty('username') || typeof message.author.username !== 'string')
		return;
	
	if (message.system || typeof message.type !== 'number' || !client.message_types.includes(message.type) || !message.inGuild())
		return;

    await getUser(client, message.author.id).then(u => {
		Logger(0, `Synchronized database for ${chalk.white(u.username + '#' + u.discriminator)}!`);
	}).catch(error => {
		Logger(1, error.toString());
	});
}