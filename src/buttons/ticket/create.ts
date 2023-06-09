import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button } from '~/types/objects';

export const create: Button = {
    noDefer: true,
    ephemeral: true,
    execute: async function (interaction, args) {
        try {
            const modal = new ModalBuilder()
                .setTitle('Create a ticket')
                .setCustomId('ticket_create')
                .addComponents([
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents([
                            new TextInputBuilder()
                                .setLabel('Please explain your issue')
                                .setCustomId('ticket_description')
                                .setPlaceholder('Enter a description')
                                .setStyle(TextInputStyle.Paragraph)
                                .setMinLength(10)
                                .setMaxLength(1024)
                        ])
                ])

            interaction.showModal(modal)
        } catch (err) {
            logger.error(err)
        }
    }
}