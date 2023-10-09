const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["ping"], // Base Commands!
    description: "Check latency of bot!",
    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setDescription(`Pong....`)
            .setColor(client.color)

        return interaction.reply({ embeds: [embed] });
    }
}
