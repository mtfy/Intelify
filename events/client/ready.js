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
const Logger = require('../../utilities/helpers/log.js');
const wait = require('timers/promises').setTimeout;
const { ActivityType, PresenceUpdateStatus } = require('discord.js');
const { setInterval } = require('timers/promises');
const { getUser } = require('./../../utilities/helpers/sql.js');

module.exports = async (client) => {
	await wait(2000);

	await Logger(0, chalk.greenBright(`Success`) + '...');
	await Logger(0, `Logged in as ${ chalk.whiteBright(client.user.tag) + ' | ' + chalk.whiteBright(client.user.id) }`);

    const guilds = client.guilds.cache.size;
    const members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    const channels = client.channels.cache.size;

	await Logger(0, `Serving ${chalk.whiteBright(guilds)} guild${ ( (guilds !== 1) ? 's' : '' ) } in total.`);

	

	try {
		await client.user.setPresence({
			activities: [{ 
				name: '/database',
				type: ActivityType.Listening
			  }],
			  status: PresenceUpdateStatus.DoNotDisturb
		});
		await Logger(0, `Updated the activity presence for ${ chalk.whiteBright( client.user.tag ) }`);

		client.is_ready = true;
	} catch (err) {
		await Logger(2, err.toString());
	}
	
};
	