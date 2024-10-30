// commands/revivechat.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('revivechat')
        .setDescription('Revives the chat by sending a reminder message.'),
    async execute(interaction) {
        const channel = interaction.channel;
        const reviveMessage = "Hey everyone! Let's keep the conversation going!";

        // Send the revive message
        await channel.send(reviveMessage);
        
        // Acknowledge the command
        await interaction.reply({ content: 'Reviving the chat!', ephemeral: true });
    },
};