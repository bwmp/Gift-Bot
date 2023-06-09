import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Command } from '~/types/objects';

export const ticket: Command = {
    description: "send the ticket message",
    ownerOnly: true,
    ephemeral: true,
    execute: async function (interaction, args) {
        const embed = new EmbedBuilder()
            .setTitle("Support Ticket")
            .setDescription("To create a ticket click the button below and fill out all valid information.")
            .setColor("#ffb8bf");

        const button = new ButtonBuilder()
            .setCustomId(`ticket_create`)
            .setLabel("Open Ticket")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button);

        interaction.channel?.send({ embeds: [embed], components: [row] });
    }
};
