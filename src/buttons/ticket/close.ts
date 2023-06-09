import { Button } from '~/types/objects';
import prisma from '~/functions/database';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, PermissionsBitField, TextChannel } from 'discord.js';
import { createTranscript } from 'discord-html-transcripts';

export const close: Button = {
  deferReply: true,
  ephemeral: true,
  execute: async function (interaction, args) {
    let ticketData = await prisma.ticketdata.findUnique({
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

    const member = interaction.member as GuildMember;

    if (ticketData.userId !== interaction.user.id || !member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      interaction.editReply({
        content: 'You cannot close this ticket!'
      });
      return;
    }

    ticketData = await prisma.ticketdata.update({
      where: {
        channelID: interaction.channel!.id
      },
      data: {
        open: false
      }
    });

    const transcript = await createTranscript(interaction.channel as TextChannel)

    const embed = new EmbedBuilder()
      .setTitle('Ticket Closed')
      .setDescription(`Ticket closed by ${interaction.user.tag}`)
      .setColor('#ff0000')
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents([
        new ButtonBuilder()
          .setCustomId('ticket_del')
          .setLabel('Delete Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🗑️'),
        new ButtonBuilder()
          .setCustomId('ticket_reopen')
          .setLabel('Reopen Ticket')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🔓')
      ])

    const ogmsgRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents([
        new ButtonBuilder()
          .setCustomId('ticket_close')
          .setLabel('Close Ticket')
          .setEmoji({ name: '🔒' })
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      ])

    await interaction.editReply({
      components: [ogmsgRow]
    });

    await interaction.channel!.send({
      embeds: [embed],
      components: [row]
    });

    const channel = await interaction.guild!.channels.fetch(ticketData.channelID);

    channel?.edit({
      parent: process.env.CLOSED_TICKET_CATEGORY as string
    });

    const LogChannel = interaction.guild!.channels.cache.get(process.env.TICKET_LOG_CHANNEL as string) as TextChannel;

    const logEmbed = new EmbedBuilder()
    .setTitle('Ticket Closed')
    .addFields(
      {
        name: 'Ticket ID',
        value: ticketData.id.toString(),
      },
      {
        name: 'Ticket Owner',
        value: `<@${ticketData.userId}>`,
      },
      {
        name: 'Closed By',
        value: `<@${interaction.user.id}>`,
      }
    )
    .setColor('#ff0000')
    .setTimestamp();

    await LogChannel.send({
      embeds: [logEmbed],
      files: [transcript]
    });

    const users = JSON.parse(ticketData.users);

    const creatordm = await interaction.guild!.members.cache.get(ticketData.userId)?.createDM();

    if (creatordm) {
      await creatordm.send({
        embeds: [embed],
        files: [transcript]
      });
    }

    users.forEach(async (user: string) => {
      interaction.guild!.members.cache.get(user)?.send({
        embeds: [embed],
        files: [transcript]
      });
    });

  }
}