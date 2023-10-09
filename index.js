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
const	Logger			=	require('./utilities/helpers/log.js'),
		mysql			=	require('mysql'),
		Clear			=	require('./utilities/helpers/clearStdin.js'),
		axios			=	require('axios').default,
		{
			Client,
			Collection,
			GatewayIntentBits
		} 				=	require('discord.js'),
		chalk			=	require('chalk')

const	client			=	new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
	],
});

if ( !client.hasOwnProperty('http_user_agent') ) {
	client.http_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
}

// Clear the console
Clear();

// Load config
client.config	= require('./settings/config.js');

if (!client.hasOwnProperty('is_ready'))
	client.is_ready = false;

if (!client.hasOwnProperty('db'))
{
	client.db = null;

	// Initialize
	client.db =  mysql.createConnection({
		user		:	client.config.MYSQL.USER,
		password	:	client.config.MYSQL.PASSWD,
		database	:	client.config.MYSQL.DATABASE,
		timezone	:	'+02:00',
		charset		:	'UTF8MB4_GENERAL_CI',
		ssl			:	false,
		port		:	client.config.MYSQL.PORT
	});

	// Attempt to connect
	client.db.connect(function(error) {
		if (error) {
			Logger(2, chalk.white(`Unable to initialize a MySQL connection.\n\t\t"${chalk.white(JSON.stringify(error, null, '  '))}"`))
			return process.exit(1);
		}

		Logger(0, `MySQL connection estabilished on TID ${chalk.yellow('0x' + String(client.db.threadId).padStart(8, '0'))}`);
	});
}

client.message_types = [
	0,  // MESSAGE
	19  // REPLY
];
client.owner = client.config.OWNER_ID;
client.initialized = (new Date().getTime());
client.dev = client.config.DEV_ID;
client.client_id = client.config.CLIENT_ID;
client.color = client.config.EMBED_COLOR;

console.log('\n' + chalk.blueBright(client.config.ASCII_LOGO));

if ( !client.hasOwnProperty('ip') )
{
	client.ip = 'N/A';
	axios.get('https://ipv4.myip.wtf/json', {
			headers: {
				'User-Agent': client.http_user_agent,
				'Accept': 'application/json'
			},
			timeout: 5000
	})
	.then(response => {
		if (response.status === 200) {
			const location = ((String(response.data.YourFuckingCity).length) ? `${response.data.YourFuckingCity}, ` : '') + response.data.YourFuckingCountry
			client.ip = `${response.data.YourFuckingIPAddress} | ${location}`;
		}
	}).catch((err) => {
		if (client.hasOwnProperty('db') && typeof client.db !== 'undefined' && client.db !== null)
			client.db.end();
		
		Logger(2, err.message);
		Logger(1, 'Aborting due to limited internet connectivity!');
		process.exit(1);
	});
}

var TitleThread = setInterval(async () => {
	var diff = (new Date().getTime()) - client.initialized;
	var h = Math.floor(diff / 3.6e6).toString();
	var m = Math.floor((diff % 3.6e6) / 6e4).toString();
	var s = Math.floor((diff % 6e4) / 1000).toString();

	if (h.length < 2)
		h = '0' + h;

	if (m.length < 2)
		m = '0' + m;

	if (s.length < 2)
		s = '0' + s;

	const ip = ( client.hasOwnProperty('ip') && typeof client.ip === 'string' ) ? ' | ' + client.ip : ''; 

	process.stdout.write(String.fromCharCode(27) + ']0;' + `Connected for ${h}:${m}:${s}${ip}` + String.fromCharCode(7));
}, 1000);

if(!client.hasOwnProperty('token') || typeof client.token !== 'string' || client.token === null)
	client.token = client.config.TOKEN;

process.on('unhandledRejection', async(error) => await Logger(2, chalk.whiteBright(error)));
process.on('uncaughtException', async(error) => await Logger(2, chalk.whiteBright(error)));

['slash'].forEach(x => client[x] = new Collection());
['loadCommand', 'loadEvent'].forEach(x => require(`./handlers/${x}`)(client));

client.login(client.token)
	.then(() =>{
		Logger(0, 'Logging in...');
	})
	.catch(err => {
		Logger(2, err.toString());
		return;
	});