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
const escape_markdown	=	require('./EscapeMarkdown.js'),
{ EmbedBuilder }		=	require('discord.js');

module.exports =  {

	/**
	 * @param {string} emnail
	 * @param {string} email
	 * @author mtfy
	 * @returns {Promise}
	 */
	validateMail: async function (email) {
		return new Promise(async function(resolve, reject){
			if ( typeof email !== 'string' )
				throw new TypeError(`Unexpected type of '${typeof email}' passed as first argument. Expeting 'string'.`);
			
			const pattern = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/g	

			if(!pattern.test(email))
				reject(`Sorry, but **${escape_markdown(email)}** is not a valid email address.\nPlease correct your search parameter and try again!`);
			else
				resolve(true);
		});
	},

	/**
	 * @param {object} client
	 * @param {object} interaction
	 * @param {string} userAvatar
	 * @param {string} searchData
	 * @param {string} dataType
	 * @author mtfy
	 * @returns {Promise}
	 */
	validateSearchDataType: function (client, interaction, userAvatar, searchData, dataType) {
		return new Promise(async function(resolve, reject) {
			const e = new EmbedBuilder();
			embed_prefix		=	String('**\u{200E}\u{20}** ').repeat(2),
			nSize				=	String(searchData).length;

			if ( dataType === null || 'string' !== typeof dataType)
				dataType = 'user';
			else
				dataType = String(dataType).toLowerCase();

			switch ( dataType ) {
				case 'user':
				case 'username':
					dataType = 1;
					if (nSize < 3 || nSize > 25)
					{
						e.setDescription(`Sorry, but **${escape_markdown(searchData)}** is too heavy to iterate over millions rows within a second.\nPlease optimize your search parameter and try again!\n${embed_prefix}`).setColor(client.config.COLOR.WARN).setFooter({ iconURL: userAvatar, text: `Requested by ${(('string' === typeof interaction.user.discriminator && '0' === interaction.user.discriminator) ? interaction.user.username : interaction.user.tag)}` }).setTimestamp(Date.now());
						interaction.reply({embeds:[e]}).catch(err => Logger(2, err.toString()));
						reject(e);
					} else {
						resolve(dataType);
					}
					break;
				
				case 'mail':
				case 'email': {
					dataType = 0;
					module.exports.validateMail(searchData).then((ok) => {
						resolve(dataType);
						return;
					}).catch((message) => {
						e.setDescription(`${message}\n${embed_prefix}`).setColor(client.config.COLOR.WARN).setFooter({ iconURL: userAvatar, text: `Requested by ${(('string' === typeof interaction.user.discriminator && '0' === interaction.user.discriminator) ? interaction.user.username : interaction.user.tag)}` }).setTimestamp(Date.now());
						interaction.reply({embeds:[e]}).catch(err => Logger(2, err.toString()));
						throw new Error(e);	
					});

					break;
				}

				case 'ip': {
					e.setColor(client.config.COLOR.WARN).setDescription(`Unfortunately the data type for \`${dataType}\` is unavailable at the moment!\nPlease come back again later.`).setFooter({ iconURL: userAvatar, text: `Requested by ${(('string' === typeof interaction.user.discriminator && '0' === interaction.user.discriminator) ? interaction.user.username : interaction.user.tag)}` }).setTimestamp(Date.now());
					interaction.reply({embeds:[e]}).catch(err => Logger(2, err.toString()));
					reject(e);
					break;
				}

				default: {
					e.setColor(client.config.COLOR.ERROR).setDescription(`Unrecognized data type **${escape_markdown( dataType )}** received.`).setFooter({ iconURL: userAvatar, text: `Requested by ${(('string' === typeof interaction.user.discriminator && '0' === interaction.user.discriminator) ? interaction.user.username : interaction.user.tag)}` }).setTimestamp(Date.now())
						.addFields([
							{ name: '\u{300C} MAIL \u{300D}',		value: 'Search by email address\nExample \u{2192} `/database samppapamppa1@gmail.com mail`\nDefault \u{2192} **No**',	inline: true },
							{ name: '\u{300C} USERNAME \u{300D}',	value: 'Search by online alias, nickname, username\nExample \u{2192} `/database motify`\nDefault \u{2192} **Yes**',	inline: true },
							{ name: '\u{300C} IP \u{300D}',			value: 'Search for IP address\nExample \u{2192} `/database 91.152.32.56 ip`\nDefault \u{2192} **No**',	inline: true }
						]);
					reject(e);
				}
			}

		});
	}
};