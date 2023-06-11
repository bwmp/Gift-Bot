import { EmbedBuilder, TextChannel } from 'discord.js';
import { Button } from '~/types/objects';
import prisma, { getSettings } from '~/functions/database';

export const del: Button = {
  noDefer: true,
  ephemeral: true,
  execute: async function (interaction, args) {

    const settings = await getSettings(interaction.guild!.id);

    const ticketInfo = await prisma.ticketdata.findUnique({
      where: {
        channelID: interaction.channel!.id
      }
    });

    if (!ticketInfo) {
      interaction.editReply({
        content: 'This channel is not a ticket!'
      });
      return;
    }

    if (ticketInfo.open) {
      interaction.editReply({
        content: 'Please close the ticket before deleting it!'
      });
      return;
    }

    interaction.channel?.delete();

    const channel = interaction.guild?.channels.cache.get(settings.ticketdata.logChannel) as TextChannel;

    const embed = new EmbedBuilder()
      .setTitle('Ticket Deleted')
      .setDescription(`Ticket deleted by ${interaction.user.tag}`)
      .addFields(
        {
          name: 'Ticket creator',
          value: `<@${ticketInfo.userId}>`,
          inline: true
        },
        {
          name: 'Ticket ID',
          value: `${ticketInfo.id}`,
        }
      )
      .setColor('#ff0000')
      .setTimestamp();


    await channel.send({
      embeds: [embed],
    });
  }
}