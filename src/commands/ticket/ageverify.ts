import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Command } from '~/types/objects';

export const ageverify: Command = {
    description: "send age verify ticket message",
    ownerOnly: true,
    ephemeral: true,
    execute: async function (interaction, args) {
        const embed = new EmbedBuilder()
            .setTitle("Age Verification")
            .setDescription("Please click the button below to verify your age.")
            .setColor("#ffb8bf");

        const button = new ButtonBuilder()
            .setCustomId(`ageverify_create`)
            .setLabel("Verify")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button);

        interaction.channel?.send({ embeds: [embed], components: [row] });
    }
};
