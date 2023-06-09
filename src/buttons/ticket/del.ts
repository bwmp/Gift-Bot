import { EmbedBuilder, TextChannel } from 'discord.js';
import { Button } from '~/types/objects';
import prisma from '~/functions/database';

export const del: Button = {
  noDefer: true,
  ephemeral: true,
  execute: async function (interaction, args) {

    const ticketData = await prisma.ticketdata.findUnique({
      where: {
        channelID: interaction.channel!.id
      }
    });

    if (!ticketData) {
      interaction.editReply({
        content: 'This channel is not a ticket!'
      });
      return;
    }

    if (ticketData.open) {
      interaction.editReply({
        content: 'Please close the ticket before deleting it!'
      });
      return;
    }

    interaction.channel?.delete();

    const channel = interaction.guild?.channels.cache.get(process.env.TICKET_LOG_CHANNEL as string) as TextChannel;

    const embed = new EmbedBuilder()
      .setTitle('Ticket Deleted')
      .setDescription(`Ticket deleted by ${interaction.user.tag}`)
      .addFields(
        {
          name: 'Ticket creator',
          value: `<@${ticketData.userId}>`,
          inline: true
        },
        {
          name: 'Ticket ID',
          value: `${ticketData.id}`,
        }
      )
      .setColor('#ff0000')
      .setTimestamp();


    await channel.send({
      embeds: [embed],
    });
  }
}