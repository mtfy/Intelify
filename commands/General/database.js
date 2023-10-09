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
const { EmbedBuilder, AttachmentBuilder, ApplicationCommandOptionType, InteractionResponse } = require('discord.js'),
Logger			=	require('../../utilities/helpers/log.js');
const {DatabaseLookup, addSearchLog, userThrottle}	=	require('../../utilities/helpers/sql.js');
const { validateSearchDataType } = require('./../../utilities/helpers/dataTypeHelper.js'),
chalk			= 	require('chalk'),
md5				=	require('js-md5'),
fs				=	require('fs');

module.exports = {
    name: ['database'],
    description: 'Motify\'s intelligent OSINT tool to find out whether your information has been exposed online.',
	options: [
		{
			name: 'keyword',
            description: 'An email address, username, or similar to look for.',
            type: ApplicationCommandOptionType.String,
            required: true
		},
        {
            name: 'datatype',
            description: 'Which datatypes should Intelify look from? | MAIL, USERNAME (default), IP',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {
		if ( !client.is_ready )
			return;

		const	uAvatar			=	( (interaction.user.avatar !== null) ? interaction.user.displayAvatarURL({ format: ((interaction.user.avatar.startsWith('a_')) ? 'gif' : 'png'), size: 2048 }) : interaction.user.defaultAvatarURL),
				uTimeStamp		=	Date.now();
		var		mSearch			=	interaction.options.getString('keyword'),
				dataType		=	interaction.options.getString('datatype');

		const iterateObject	=	function*(obj) {
			for (let k in obj) yield [ k, obj[k] ];
		},
		embed_prefix		=	String('**\u{200E}\u{20}** ').repeat(2);

		await validateSearchDataType(client, interaction, uAvatar, mSearch, dataType).then(mDataType => {
			userThrottle(client, interaction.user.id).then(Throttle => {
				if (Throttle.ok) {
					DatabaseLookup(client, mSearch, mDataType)
					.then(DataLookup => {
						addSearchLog(client, interaction, mSearch, mDataType).then(() => {
							Logger(0, `Archived search log for ${chalk.white((('string' === typeof interaction.user.discriminator && '0' === interaction.user.discriminator) ? interaction.user.username : interaction.user.tag))}. Search keyword ["${chalk.white(mSearch)}"]`);
							var measurement_time = '';
							if (DataLookup.speed !== null)
								measurement_time = '\nThe operation took **' + (DataLookup.speed / 1000).toString() + '** seconds.'
							
							const embed = new EmbedBuilder()
								.setColor(DataLookup.color)
								.setDescription(`${DataLookup.message}${measurement_time}\n${embed_prefix}`)
								.setFooter({ iconURL: uAvatar, text: `Requested by ${(('string' === typeof interaction.user.discriminator && '0' === interaction.user.discriminator) ? interaction.user.username : interaction.user.tag)}` })
								.setTimestamp(uTimeStamp);
							
							const g_Embed =	(DataLookup.results.count <= 5) ? true : false;
	
							if (DataLookup.error === false &&
								DataLookup.results.count > 0 &&
								DataLookup.results.data !== false &&
								( typeof DataLookup.results.data === 'object' ))
							{
								
								var data = [];
	
								for ( var i = 0; i != DataLookup.results.data.length; ++i )
								{
									if ( g_Embed ) {
										while (data.length)
											data.pop();
									}
	
									if ( typeof DataLookup.results.data[i] !== 'object' || DataLookup.results.data[i] === null)
										continue;
									
									var _name = '', _tmp = [];
	
									for (let [ key, val ] of iterateObject(DataLookup.results.data[i])) {
										if ( typeof key !== 'undefined' && key !== null && key === 'breach') {
											_name = (g_Embed) ? '**' + val + '**' : val;
										} else if (typeof val === 'string' && val !== null && val.length > 0 ) {
											
											switch(key) {
												case 'regip':
													key = 'Registration_IP';
													break;
	
												case 'lastip':
													key = 'Last_IP';
													break;
	
												case 'dob':
													key = 'Date of Birth';
													break;
											}
											val = val.replace(/\r\n|\n/g, ' - ').replace(/\t| {2,4}/g, ' ');
											if (g_Embed) {
												val = escape_markdown(val);
												
												if (val.length > 58)
													val = '`' + val + '`';
	
												data.push(embed_prefix + '\u{300C} ' + String(key).toUpperCase() + ' \u{300D} ' + val);
											}
											else
											{
												key = key.toUpperCase();
												var tabs = '\t\t';
												if (key.length < 8)
													tabs += '\t';
												_tmp.push(key + tabs + val);
											}
											
										}
									}
	
									if ( g_Embed )
										embed.addFields([{name : _name, value : data.join('\n')}]);
									else
										data.push(`BREACH\t\t\t${_name}\n\n` + _tmp.join('\n'));
									
								}
							}
	
							var fileName = '';
	
							if ( !g_Embed )
							{
								fileName = md5(interaction.user.tag + interaction.user.id + (new Date().getTime()).toString()).toUpperCase().substring(16, 32) + '.txt';
								fs.writeFile('./tmp/' + fileName, client.config.ASCII_LOGO + `\n\n\tRequested by ${(('string' === typeof interaction.user.discriminator && '0' === interaction.user.discriminator) ? interaction.user.username : interaction.user.tag)} [${interaction.user.id}]\n\t@ ${(new Date(uTimeStamp)).toISOString()}\n\n${String('-').repeat(122)}` + data.join('\n' + String('-').repeat(122) + '\n'), (error) => {
									if (error) {
										Logger(2, `Unable to write a buffer into "${chalk.whiteBright(fileName)}"\n\t${error.toString()}`);
										embed.addFields([{name: 'Error', value: '**Unable to perform I/O operation on server side. Please try again later.**'}]).setColor(client.config.COLOR.ERROR);
									} else {
										const Attachment = new AttachmentBuilder()
											.setFile('./tmp/' + fileName, fileName)
											.setDescription(`Database lookup results for a query requested by <@${interaction.user.id}>.`);
										interaction.reply({ embeds: [embed], files: [Attachment] })
										.then((res) => {
											Logger(0, `Successfully sent a response to OSINT database query requested by ${(('string' === typeof interaction.user.discriminator && '0' === interaction.user.discriminator) ? interaction.user.username : interaction.user.tag)}`);
										}).catch((err) => {
											Logger(1, `Unable to reply to an interaction initiated by ${(('string' === typeof interaction.user.discriminator && '0' === interaction.user.discriminator) ? interaction.user.username : interaction.user.tag)}\n\t${chalk.redBright(err)}`);
										}).then(()=> {
											fs.unlink('./tmp/' + fileName, function(err) {
												if (err)
													Logger(1, `Unable to delete file "${chalk.whiteBright(fileName)}"\n\t${err}`);
												else
													Logger(0, `Successfully deleted file "${chalk.whiteBright(fileName)}"`);
											});
										});
									}
								});
							}
							else
								interaction.reply({ embeds: [embed] });	
						}).catch(e => {
							Logger(2, e.toString());
							return;
						});
					});
				} else {
					const e_RateLimited = new EmbedBuilder()
					.setColor(client.config.COLOR.WARN)
					.setDescription(`${embed_prefix}\n${Throttle.message}\n${embed_prefix}`)
					.setFooter({ iconURL: uAvatar, text: `Requested by ${(('string' === typeof interaction.user.discriminator && '0' === interaction.user.discriminator) ? interaction.user.username : interaction.user.tag)}` })
					.setTimestamp(uTimeStamp);
					interaction.reply({embeds:[e_RateLimited]}).catch(_error => Logger(2, _error.toString()));
				}
			}).catch(err => {
				Logger(2, err.toString());
				return;
			});	
		}).catch(e => {
			Logger(2, e);
		})
		
    }
}
