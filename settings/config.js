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
 *										
 *		Author: Motify <coder@outlook.ie> (https://github.com/mtfy)
 *		Copyright © Motify, 2023.
 *		
 */
require('dotenv').config();
const base64_decode 	=	require('./../utilities/helpers/base64_decode.js');

module.exports = {
    TOKEN: process.env.TOKEN || '',
    EMBED_COLOR: process.env.EMBED_COLOR || '#000001',
    OWNER_ID: process.env.OWNER_ID || '',
	CLIENT_ID: process.env.CLIENT_ID || '0',
	OSINT_LOOKUP_TBL: process.env.OSINT_LOOKUP_TABLE_NAME || 'db',
	OSINT_FREE_DAY: 25, // Maximum number of lookups for free per day
	CACHE_TTL: {
		USERS:		parseInt(process.env.USERS_CACHE_TTL)
	},
	MYSQL: {
		HOST:		process.env.MYSQL_HOST || '127.0.0.1',
		PORT:		parseInt(process.env.MYSQL_PORT) || 3306,
		USER:		base64_decode(process.env.MYSQL_USERNAME),
		PASSWD:		base64_decode(process.env.MYSQL_PASSWORD),
		DATABASE:	base64_decode(process.env.MYSQL_DATABASE)
	},
	ASCII_LOGO: '       ###                                           \t\t\n\t#  #    # ##### ###### #      # ###### #   # \t\t\n\t#  ##   #   #   #      #      # #       # #  \t\t\n\t#  # #  #   #   #####  #      # #####    #   \t\t\n\t#  #  # #   #   #      #      # #        #   \t\t\n\t#  #   ##   #   #      #      # #        #   \t\t\n\t### #    #   #   ###### ###### # #        #   \t\t\n\t                                       ',
	COLOR: {
		ERROR:	'#d9534f',
		OK:		'#5cb85c',
		INFO:	'#5bc0de',
		WARN:	'#f0ad4e'
	},
    DEV_ID: [], // if you want to use command bot only, you can put your id here example: ["123456789", "123456789"]
}