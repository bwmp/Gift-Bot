import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Command } from '~/types/objects';
import reactRoleGroups from "~/config/reactRoles.json";

export const reactroles: Command = {
    description: "send react role group messages",
    ownerOnly: true,
    ephemeral: true,
    execute: async function (interaction, args) {
        for (const group of reactRoleGroups) {
            const roleFetchPromises = group.roles.map(role => interaction.guild?.roles.fetch(role.id));

            const fetchedRoles = await Promise.all(roleFetchPromises);

            const fields = group.roles.map((role, index) => ({
                name: fetchedRoles[index]!.name,
                value: role.description,
                inline: false
            }));

            const buttons = group.roles.map((role, index) =>
                new ButtonBuilder()
                    .setCustomId(`reactrole:${role.id}`)
                    .setLabel(fetchedRoles[index]!.name)
                    .setStyle(ButtonStyle.Primary)
            );

            const embed = new EmbedBuilder()
                .setTitle(group.id)
                .addFields(fields)
                .setColor("#ffb8bf");

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(buttons);

            interaction.channel?.send({ embeds: [embed], components: [row] });
        }
    }
};
