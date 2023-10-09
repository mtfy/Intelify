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
const { plsParseArgs } = require('plsargs');
const args = plsParseArgs(process.argv.slice(2));
const chillout = require("chillout");
const { makeSureFolderExists } = require("stuffs");
const path = require("path");
const readdirRecursive = require("recursive-readdir");
const { TOKEN } = require("./settings/config.js");
const Logger = require('./utilities/helpers/log.js');
const chalk = require('chalk');
const { ApplicationCommandOptionType, REST, Routes, ApplicationCommandManager } = require('discord.js');

(async () => {
	let command = [];

	const http_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36';

	let cleared = args.get(0) == "guild" ? args.get(2) == "clear" : (args.get(0) == "global" ? args.get(1) == "clear" : false);
	let deployed = args.get(0) == "guild" ? "guild" : args.get(0) == "global" ? "global" : null;

	if (!deployed) 
	{
		console.error(`Invalid sharing mode! Valid modes: guild, global`);
		console.error(`Usage example: node deploySlash.js guild <guildId> [clear]`);
		console.error(`Usage example: node deploySlash.js global [clear]`);
		return process.exit(1);
	}

	if (!cleared)
	{
		let interactionsFolder = path.resolve("./commands");

		await makeSureFolderExists(interactionsFolder);

		let store = [];

		Logger(0, 'Iterating over the interaction files')

		let interactionFilePaths = await readdirRecursive(interactionsFolder);
		interactionFilePaths = interactionFilePaths.filter(i => {
			let state = path.basename(i).startsWith("-");
			return !state;
		});

		await chillout.forEach(interactionFilePaths, (interactionFilePath) => {
			const cmd = require(interactionFilePath);
			Logger(0, chalk.white(`Interaction "${cmd.type == "CHAT_INPUT" ? `/${cmd.name.join(" ")}` : `${cmd.name[0]}`}" ${cmd.name[1] || ""} ${cmd.name[2] || ""} added to the transform list`));
			store.push(cmd);
		});

		store = store.sort((a, b) => a.name.length - b.name.length)

		command = store.reduce((all, current) => {
			switch (current.name.length) {
			case 1: {
				all.push({
				type: current.type,
				name: current.name[0],
				description: current.description,
				defaultPermission: current.defaultPermission,
				options: current.options
				});
				break;
			}
			case 2: {
				let baseItem = all.find((i) => {
					return i.name == current.name[0] && i.type == current.type
				});

				if (!baseItem) {
					all.push({
						type: current.type,
						name: current.name[0],
						description: `${current.name[0]} commands.`,
						defaultPermission: current.defaultPermission,
						options: [
						{
							type: ApplicationCommandOptionType.Subcommand,
							description: current.description,
							name: current.name[1],
							options: current.options
						}
						]
					});
				} else {
					baseItem.options.push({
						type: ApplicationCommandOptionType.Subcommand,
						description: current.description,
						name: current.name[1],
						options: current.options
					})
				}
				break;
			}
			case 3: {
				let SubItem = all.find((i) => {
				return i.name == current.name[0] && i.type == current.type
				});

				if (!SubItem) {
					all.push({
						type: current.type,
						name: current.name[0],
						description: `${current.name[0]} commands.`,
						defaultPermission: current.defaultPermission,
						options: [
						{
							type: ApplicationCommandOptionType.SubcommandGroup,
							description: `${current.name[1]} commands.`,
							name: current.name[1],
							options: [
							{
								type: ApplicationCommandOptionType.Subcommand,
								description: current.description,
								name: current.name[2],
								options: current.options
							}
							]
						}
						]
					});
				} else{
					let GroupItem = SubItem.options.find(i => {
						return i.name == current.name[1] && i.type == ApplicationCommandOptionType.SubcommandGroup
					});
					if (!GroupItem) {
						SubItem.options.push({
						type: ApplicationCommandOptionType.SubcommandGroup,
						description: `${current.name[1]} commands.`,
						name: current.name[1],
						options: [
							{
							type: ApplicationCommandOptionType.Subcommand,
							description: current.description,
							name: current.name[2],
							options: current.options
							}
						]
						})
					} else {
						GroupItem.options.push({
						type: ApplicationCommandOptionType.Subcommand,
						description: current.description,
						name: current.name[2],
						options: current.options
						})
					}
				}
			}
				break;
			}

			return all;
		}, []);

		command = command.map(i => ApplicationCommandManager.transformCommand(i));
	}
	else
		Logger(0, 'No interactions read. All existing ones will be cleared, if any.');

  var client = null;
  const rest = new REST({ version: '9', userAgentAppendix: http_user_agent }).setToken(TOKEN);
  await rest.get(Routes.user())
  .then((__client) => {
	client = __client;
	Logger(0, `Account information fetched! | ${chalk.whiteBright(client.username)}#${chalk.whiteBright(client.discriminator)} [${chalk.whiteBright(client.id)}]`)
  }).catch((err) => {
	Logger(2, err.toString());
	return;
  });

  Logger(0, 'Interactions are posted on Discord');

  switch (deployed) 
  {
    case 'guild': {
      let guildId = args.get(1);

      await rest.put(Routes.applicationGuildCommands(client.id, guildId), { body: command })
	  	.then((result) => {
			Logger(0, chalk.whiteBright(`${chalk.greenBright('Successfully')} deployed interactive commands for Guild ID ${chalk.whiteBright(guildId)} via HTTP PUT`));
			Logger(0, `Please notice that shared commands may take 3-5 seconds to arrive.`);
		}).catch((err) => {
			Logger(2, chalk.redBright.bold(err));
			return;
		});
		
      break;
    }
    case 'global': {
      await rest.put(Routes.applicationCommands(client.id), { body: command })
	  .then((result) => {
		Logger(0, chalk.whiteBright(`${chalk.greenBright('Successfully')} deployed global interactive commands via HTTP PUT`));
		Logger(0, `Please notice that shared commands may take an hour to arrive. Alternatively you may kick this bot from the server, and add it back immediately, to regenerate the cache.`);
	  }).catch((err) => {
		var msg = err.toString().split('\n    ', 1)[0];
		msg = msg.replace('\n', ' | ');
		Logger(2, chalk.whiteBright.bold(`HTTP ${chalk.yellow.bold(err.method)} returned status ${chalk.yellow.bold(err.status)} | `) + chalk.yellow('[0x' + String(err.rawError.code).padStart(8, '0') + ']') + '\n  ' + chalk.gray.bold(msg) + '\n  Message => "' + chalk.white(err.rawError.message) + '"\n  RAW PAYLOAD => "' + chalk.yellow(JSON.stringify(err.requestBody, null, '  ')) + '"');
		return;
	  });

      break;
    }
  }
})();

/// Credit https://github.com/akanora/Youtube-Together (Handler) || Edit by: https://github.com/Adivise