import { EmbedBuilder } from 'discord.js';
import { getXp } from '~/functions/database';
import { Command } from '~/types/objects';

export const stats: Command = {
    description: "get your stats",
    category: "levels",
    guildOnly: true,
    execute: async function (interaction, args) {
        const user = await getXp(interaction.user.id, interaction.guild!.id);
        const embed = new EmbedBuilder()
            .setTitle("Stats")
            .addFields(
                {
                    name: "Level",
                    value: user.level.toString(),
                    inline: true
                },
                {
                    name: "XP",
                    value: `${user.xp.toString()}/${user.xp_needed.toString()}`,
                    inline: true
                }
            )

        interaction.editReply({ embeds: [embed] });
    }
}