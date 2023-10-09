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
const { DiscordAPIError } = require('discord.js');

Logger = require('./log.js'),
chalk = require('chalk'),
escape_markdown = require('./EscapeMarkdown.js'),
wait = require('timers/promises').setTimeout;

module.exports = {

	/**
	 * @param {object} client
	 * @param {string|number} id
	 * @author mtfy
	 * @returns {Promise}
	 */
	userThrottle: async function(client, id) {
		return new Promise(async function(resolve) {
			if (typeof client !== 'object' || client === null)
				throw new TypeError(`Unexpected type of '${typeof client}' passed as first argument. Expecting 'object'`);

			var Throttle = {
				ok			:	false,
				seconds		:	0.0,
				message		:	null
			};

			client.db.query(`SELECT q_date FROM lookup_usage_logs WHERE user_id = ? ORDER BY q_date DESC LIMIT 1`, [id], function(error, results, fields) {
				if (error)
					throw new Error(error);

				if (results.length) {
					const last_date = parseFloat(results[0].q_date) ,
						now = new Date().getTime() / 1000,
						diff = Math.round(now - last_date);
					
					if ( diff < 7) {
						Throttle.seconds = diff;
						var msg = (Throttle.seconds >= 2) ? `**${Throttle.seconds}** seconds` : 'a second';
						Throttle.message = `You're being rate limited. Please try again in ${msg}.`;
						resolve(Throttle);
						return;
					} else {
						var d = new Date();
						d.setUTCHours(0,0,0,0);	
						d = d.getTime() / 1000;
						client.db.query(`SELECT COUNT(id) AS num_lookups FROM lookup_usage_logs WHERE q_date > ? AND user_id = ?`, [d, id], function(err, result, _fields) {
							if (err)
								throw new Error(err);

							if ( result.length  && result[0].num_lookups >= client.config.OSINT_FREE_DAY  ) {
								var hrs = Math.round(((d + 86400) - (new Date().getTime() / 1000))/3600);
								Throttle.ok = false;
								if ( hrs <= 1 )
									hrs = '**within an hour**';
								else
									hrs = 'in **' + hrs + '** hours';
								Throttle.message = `You can look up a maximum of **${client.config.OSINT_FREE_DAY}** ${((client.config.OSINT_FREE_DAY) ? 'query' : 'queries')} daily. Please try again  ${hrs}!`;
							}
							else
								Throttle.ok = true;

							resolve(Throttle);
							return;
						});
					}

				} else {
					Throttle.ok = true;
					resolve(Throttle);
				}
			});
		});
	},
	
	/**
	 * 
	 * @param {object} client 
	 * @param {object} interaction
	 * @param {string} search
	 * @param {number} type
	 * @author mtfy
	 * @returns {Promise}
	 */
	addSearchLog: async function(client, interaction, search, type) {
		return new Promise(async function(resolve, reject) {
			if (typeof client !== 'object' || client === null)
				throw new TypeError(`Unexpected type of '${typeof client}' passed as first argument. Expecting 'object'`);

			if (typeof interaction !== 'object' || interaction === null)
				throw new TypeError(`Unexpected type of '${typeof interaction}' passed as second argument. Expecting 'object'`);
			
			if (typeof search !== 'string' || search === null)
				throw new TypeError(`Unexpected type of '${typeof search}' passed as third argument. Expecting 'string'`);

			const q_date = (new Date().getTime() / 1000);

			await module.exports.getUser(client, interaction.user.id).then(user => {
				client.db.query(`INSERT INTO lookup_usage_logs (user_id, q_date, search, type, channel_id, guild_id) VALUES (?, ?, ?, ?, ?, ?)`, [user.id, q_date, search, type, interaction.channel.id, interaction.guild.id], function (error, results, fields) {
					if (error)
						throw new Error(error);
					
					resolve(results);
				});
			}).catch(err => {
				throw new Error(err);
			});
		});
	},

	/**
	 * 
	 * @param {object} client 
	 * @param {string|number} id 
	 * @author mtfy
	 * @returns {Promise}
	 */
	insertUser: async function(client, id) {
		return new Promise(async function(resolve, reject) {
			const dateNow = (new Date() / 1000);
			await client.users.fetch(id).then(user => {
				if (typeof user !== 'object' || user === null || !user.hasOwnProperty('id') || !user.hasOwnProperty('username') || !user.hasOwnProperty('discriminator') || typeof user.id === 'undefined')
					throw new Error('Unable to fetch user');
				
				client.db.query(`INSERT INTO users (id, username, discriminator, avatar, banner, bot, system, first_seen, last_update) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user.id, user.username, parseInt(user.discriminator), user.avatar, user.banner, ((user.bot) ? 1 : 0), ((user.system) ? 1 : 0), dateNow, dateNow], function(error, results, fields) {
					if (error) {
						//Logger(2, `${chalk.whiteBright.bold((typeof error.errno !== 'undefined' ? '[0x' + String(error.errno).padStart(8, '0') + ']' : ''))} ${chalk.yellowBright(error.code)} ${chalk.white('MySQL => ' + error.sqlMessage)} ...\n\t${chalk.yellowBright('Executed query: ')} ${chalk.whiteBright(error.sql)}`);
						throw new Error(error);
					}

					resolve(results);
				});
			}).catch(err => {
				throw new DiscordAPIError(err);
			});
		});
	},
	
	/**
	 * @author mtfy
	 * @param {object} client 
	 * @param {string|number} id
	 * @returns {Promise}
	 */
	getUser: async function(client, id) {
		return new Promise(function(resolve, reject) {

			if (typeof client !== 'object' || client === null)
				throw new TypeError(`Unexpected type of '${typeof client}' passed as first argument. Expecting 'object'`);
			
			if ((typeof id !== 'string' && typeof id !== 'number') || id === null)
				throw new TypeError(`Unexpected type of '${typeof id}' passed as second argument. Expecting 'string' or 'number'`);
			
			if (!client.hasOwnProperty('db'))
				throw new Error(`Supposed property 'db' does not not exist in onject passed in the first argument`);

			if (id.length < 15)
				throw new Error('Invalid user ID passed in the second argument');

			var g_User = {
				id				:	id,
				username		:	null,
				discriminator	:	null,
				avatar			:	null,
				banner			:	null,
				bot				:	null,
				system			:	null,
				last_update		:	null
			};

			client.db.query(`SELECT username, discriminator, avatar, banner, bot, system, first_seen, last_update FROM users WHERE id = ?`, [id], async function (error, results, fields) {
				if (error) {
					//Logger(2, `${chalk.whiteBright.bold('[0x' + String(error.errno).padStart(8, '0') + ']')} ${chalk.yellowBright(error.code)} ${chalk.white('MySQL => ' + error.sqlMessage)} ...\n\t${chalk.yellowBright('Executed query: ')} ${chalk.whiteBright(error.sql)}`);
					throw new Error(error);
				}

				const dateNow = (new Date().getTime() / 1000);

				if (!results.length)
				{
					await module.exports.insertUser(client, id)
					.then(result => {
						resolve(result);
						return;
					})
					.catch(err => {
						throw new Error(err);
					});
				}
				else
				{
					const last_update = (results[0].last_update),
					diff = Math.floor(dateNow - last_update);

					// Compare last_update against user defined TTL in .env
					if (diff > client.config.CACHE_TTL.USERS) {
						var updateRequired = false;
						// Check for fresh data
						await client.users.fetch(id).then(user => {

							const fields = ['username', 'discriminator', 'avatar', 'banner'];
							Object.keys(user).forEach(key => {
								if (fields.includes(key)) {
									if (user[key] !== results[0][key]) {
										updateRequired = true;
									}
								}
							});

							if (updateRequired) {
								client.db.query(`UPDATE users SET username = ?, discriminator = ?, avatar = ?, banner = ?, last_update= ? WHERE id = ?`, [user.username, parseInt(user.discriminator), user.avatar, user.banner, dateNow, user.id], function(_error, _results, _fields ) {
									if (_error)
										reject(_error);
									else {

										if (typeof _results === 'object' && _results.hasOwnProperty('message') && typeof _results.message === 'string')
											Logger(0, `${chalk.green(_results.message + ')')}`);

										Object.keys(user).forEach(key => {
											if (g_User.hasOwnProperty(key))
												g_User[key] = user[key];
										});
									}
								});
							} else {
								Object.keys(results[0]).forEach(key => {
									if (g_User.hasOwnProperty(key))
										g_User[key] = results[0][key];
								});
								resolve(g_User);
							}

						}).catch(err => {
							throw new Error(err);
						});
					} else {
						Object.keys(results[0]).forEach(key => {
							if (g_User.hasOwnProperty(key))
								g_User[key] = results[0][key];
						});

						resolve(g_User);
					}	
				}
			});
		});
	},


	//////////////////////////////////////////////////////////////////
	//														  	 	//
	//		Open Source Intelligence |  Database Lookup Engine	 	//
	//														  	 	//
	//////////////////////////////////////////////////////////////////
	/**
	 * 
	 * @param {object} client 
	 * @param {string} __search 
	 * @param {integer} __type 
	 * @returns Promise
	 */
	DatabaseLookup	:	async function(client, __search, __type = 0) {
		return new Promise (function(p_Resolve) {
			DataResult = {
				error		:	false,
				message		:	'',
				color		:	client.config.COLOR.INFO,
				speed		:	null,
				results		:	{
					count	:	0,
					data	:	false
				}
			};
		
			const start = (new Date()).getTime();
				
			Logger(0, `Invoking an existing MysQL connection from TID ${chalk.yellow('0x' + String(client.db.threadId).padStart(8, '0'))}`);
			
			__search = __search.trim();
			var __query = '', __params = [];
	
			__params.push(__search);
			
			switch (__type)
			{
				case 1:
					__query = `SELECT breach, username, email, hash, salt, password, dob, regip, lastip, hwid, scraped_data FROM ${client.config.OSINT_LOOKUP_TBL} WHERE username = ? OR username LIKE ?`;
					__params.push(__search + ' %');
					break;
	
				default:
					__query = `SELECT breach, username, email, hash, salt, password, dob, regip, lastip, hwid FROM ${client.config.OSINT_LOOKUP_TBL} WHERE email = ?`;
			}

			client.db.query(__query, __params, function (error, results, fields) {
				if (error) {
					Logger(2, `${chalk.whiteBright.bold('[0x' + String(error.errno).padStart(8, '0') + ']')} ${chalk.redBright('MySQL => ' + error.sqlMessage)} ...\n\t${chalk.yellowBright('Executed query: ')} ${chalk.whiteBright(error.sql)}`);
					DataResult.error = true;
					DataResult.message = 'Data cluster unresponsive. Socket connection timed out. Please see the console for more details or try again later!!!';
					DataResult.color = client.config.COLOR.ERROR;
					p_Resolve(DataResult);
					return;
				} else {
					if (typeof results !== 'object')
					{
						Logger(1, chalk.whiteBright(`Unexpected type of "${chalk.white.bold(typeof results)}" for (local var)${chalk.white.bold('results')} returned by MySQl. Expected: "${chalk.white.bold('object')}"`));
						DataResult.error = true;
						DataResult.message = 'Something went wrong on the server side. Please try again later!';
						DataResult.color = client.config.COLOR.ERROR;
						p_Resolve(DataResult);
						return;
					}

					const end = (new Date()).getTime();
					DataResult.speed = (end - start);
	
					const len = results.length;
					
					if (len < 1)
					{
						Logger(0, 'OSINT:\tNo results found for "' + chalk.whiteBright(__search) + '" ...');
						DataResult.error = false;
						DataResult.message = 'Unable to find results matching with keyword **' + escape_markdown(__search) + '**';
						DataResult.color = client.config.COLOR.INFO;
						p_Resolve(DataResult);
						return;
					}
					DataResult.error			=	false;
					DataResult.color			=	client.config.COLOR.OK;
					DataResult.results.count	=	len;
					DataResult.results.data		=	results;
					DataResult.message			=	`Successfully found **${len}** result${ ( ( len > 1 ) ? 's' : '' ) } matching the search parameter \`${escape_markdown(__search)}\`.`
					p_Resolve(DataResult);
					return;
					
				}
			});
			
		});
	}
	
};