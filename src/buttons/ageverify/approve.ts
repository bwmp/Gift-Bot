import { GuildMember, PermissionFlagsBits, PermissionsBitField } from 'discord.js';
import { Button } from '~/types/objects';

export const approve: Button = {
  deferReply: true,
  ephemeral: true,
  execute: async function (interaction, args) {
    const member = interaction.member as GuildMember;

    const target = await interaction.guild?.members.fetch(args[0]);

    if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      interaction.editReply({ content: "You do not have permission to use this button." });
      return;
    }

    if (!target) {
      interaction.editReply({ content: "Cannot find user." });
      return;
    }

    const verifiedRole = interaction.guild?.roles.cache.get("969015422160633866");
    const unverifiedRole = interaction.guild?.roles.cache.get("968317142351118346");

    if (!verifiedRole || !unverifiedRole) {
      interaction.editReply({ content: "Cannot find roles." });
      return;
    }

    if (target.roles.cache.has(verifiedRole.id)) {
      interaction.editReply({ content: "user already verified."});
      return;
    }

    await target.roles.add(verifiedRole);
    await target.roles.remove(unverifiedRole);

    interaction.editReply({ content: "user verified." });

    target.send({ content: "You have been verified." });

    interaction.channel?.delete();

  }
}