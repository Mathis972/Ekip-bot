const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const wait = require('util').promisify(setTimeout);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('yass')
        .setDescription('Replies with Pong!'),
    async execute (interaction, client) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .setMinValues(2)
                    .setMaxValues(3)
                    .addOptions([
                        {
                            label: 'Select me',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                        {
                            label: 'I am also an option',
                            description: 'This is a description as well',
                            value: 'third_option',
                        },
                    ]),
            );
        await interaction.reply({ content: 'Pong!', components: [row] });
        client.on('interactionCreate', async interaction => {
            if (!interaction.isSelectMenu()) return;
            if (interaction.customId === 'select') {
                await interaction.deferUpdate();
                await wait(1000);
                await interaction.editReply({ content: 'Something was selected!', components: [] });
            }
        });
    }
};
