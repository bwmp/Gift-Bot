import { Command } from '~/types/objects';
import opts from '~/options/user'
import prisma from '~/functions/database';
import { EmbedBuilder } from 'discord.js';
export const getallcodes: Command = {
  description: "checks the user associated with a code",
  permissions: ['Administrator'],
  options: opts,
  ephemeral: true,
  execute: async function (interaction, args) {
    const user = args.getUser('user', true);

    const codeExists = await prisma.usedCodes.findMany({
      where: {
        userId: user.id,
      }
    });

    if (!codeExists.length) {
      interaction.editReply({ content: "User not found" });
      return;
    }

    let codes = "";

    for (let code of codeExists) {
      codes += `Code: ${code.code} Product: ${code.product}\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle(`User: ${user.username} (${user.id})`)
      .addFields([
        { name: "Codes", value: codes },
        { name: "Total Codes", value: codeExists.length.toString() },
        { name: "Mention", value: `<@${user.id}>` }
      ])
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });

  }
}