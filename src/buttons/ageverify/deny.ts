import { GuildMember, PermissionFlagsBits, PermissionsBitField } from 'discord.js';
import { Button } from '~/types/objects';

export const deny: Button = {
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

    target.send({ content: "You're age verification was denied." });

    interaction.channel?.delete();

  }
}