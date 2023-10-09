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
const chalk = require('chalk');
const { MessageReaction } = require('discord.js');
const wait = require('timers/promises').setTimeout;

module.exports = async (level = 0, message) => {
	var __json = false;

	if (typeof level !== 'number')
		return false;

	if (typeof message === 'object')
	{
		try {
			message = JSON.stringify( message );
			__json = true;
		} catch (err) {
			console.log(`\n${chalk.redBright(`[ERROR]`)}\t${chalk.whiteBright.bold(err)}\n`);
			return false;
		}
	}

	if (typeof message !== 'string')
		return false;

	message = message.trim();

	if (!__json && !message.endsWith('.') && !message.endsWith(']') && !message.endsWith('!') && !message.endsWith('?'))
		message += '.';

	var szLevel = '';
	switch (level) {
		case 1:
			szLevel = chalk.yellow.bold(`[WARN]\t`);
			break;
		case 2:
			szLevel = chalk.redBright.bold(`[ERROR]\t`);
			break;
		case 3:
			szLevel = chalk.magentaBright.bold(`[DEBUG]\t`);
			break;
		default:
			szLevel = chalk.blueBright.bold(`[INFO]\t`);
	}

	console.log(szLevel + chalk.grey(message));
	return true;
}