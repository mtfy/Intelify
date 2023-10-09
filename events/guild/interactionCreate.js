const chalk = require('chalk'),
Logger = require('./../../utilities/helpers/log.js')
module.exports = async(client, interaction) => {
    if (interaction.isCommand || interaction.isContextMenuCommand || interaction.isModalSubmit || interaction.isChatInputCommand) {
        if (!client.is_ready) return;
		if (!interaction.guild) return;

        let subCommandName = "";
        try {
          subCommandName = interaction.options.getSubcommand();
        } catch { };
        let subCommandGroupName = "";
        try {
          subCommandGroupName = interaction.options.getSubcommandGroup();
        } catch { };
    
        const command = client.slash.find(command => {
          switch (command.name.length) {
            case 1: return command.name[0] == interaction.commandName;
            case 2: return command.name[0] == interaction.commandName && command.name[1] == subCommandName;
            case 3: return command.name[0] == interaction.commandName && command.name[1] == subCommandGroupName && command.name[2] == subCommandName;
          }
        });
    
        if (!command) return;
        if (!client.dev.includes(interaction.user.id) && client.dev.length > 0) { 
            interaction.reply(`I'm still under construction, only beta testers and developers can use me :slight_smile: Please check back later.`); 
            Logger(0, `Interactivity by ${chalk.white(interaction.user.tag)} rejected for a command.`); 
            return;
        }

        const g_Message = [
			`Interaction`,
			`${command.name[0]}`,
			`${command.name[1] || ""}`,
			`${command.name[2] || ""}`,
			`consumed by ${chalk.white((('string' === typeof interaction.user.discriminator && '0' === interaction.user.discriminator) ? interaction.user.username : interaction.user.tag))} in ${chalk.white(interaction.guild.name)})`,
        ]

        Logger(0, g_Message.join(' '));

    if (command) {
        try {
            command.run(client, interaction);
        } catch (error) {
            console.log(error)
            await interaction.reply({ content: `Something went wrong!`, ephmeral: true });
        }}
    }
}