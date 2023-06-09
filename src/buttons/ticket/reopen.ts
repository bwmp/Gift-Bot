import { Button } from '~/types/objects';
import prisma from '~/functions/database';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, Message, PermissionsBitField, TextChannel } from 'discord.js';
export const reopen: Button = {
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
        content: 'You cannot reopen this ticket!'
      });
      return;
    }

    ticketData = await prisma.ticketdata.update({
      where: {
        channelID: interaction.channel!.id
      },
      data: {
        open: true
      }
    });

    const embed = new EmbedBuilder()
      .setTitle('Ticket Reopened')
      .setDescription(`Ticket reopened by ${interaction.user.tag}`)
      .setColor('#00ff00')
      .setTimestamp();

    const ogmsgRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents([
        new ButtonBuilder()
          .setCustomId('ticket_close')
          .setLabel('Close Ticket')
          .setEmoji({ name: '🔒' })
          .setStyle(ButtonStyle.Danger)
          .setDisabled(false)
      ])
    const originalMessage = await interaction.channel?.messages.fetch(ticketData.originalMessage) as Message;
    await originalMessage.edit({
      components: [ogmsgRow]
    });

    await interaction.channel!.send({
      embeds: [embed],
      components: [ogmsgRow]
    });

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents([
        new ButtonBuilder()
          .setCustomId('ticket_del')
          .setLabel('Delete Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🗑️')
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('ticket_reopen')
          .setLabel('Reopen Ticket')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🔓')
          .setDisabled(true)
      ])

    await interaction.editReply({
      content: 'Ticket Reopened!',
      components: [row]
    });

    const channel = await interaction.guild!.channels.fetch(ticketData.channelID);

    channel?.edit({
      parent: process.env.TICKET_CATEGORY as string
    });

    const LogChannel = interaction.guild!.channels.cache.get(process.env.TICKET_LOG_CHANNEL as string) as TextChannel;

    const logEmbed = new EmbedBuilder()
      .setTitle('Ticket Reopened')
      .addFields(
        {
          name: 'Ticket',
          value: `<#${ticketData.channelID}>`
        },
        {
          name: 'Reopened By',
          value: `<@${interaction.user.id}>`
        },
        {
          name: 'Ticket ID',
          value: `${ticketData.id}`
        }
      )
      .setColor('#00ff00')
      .setTimestamp();

    await LogChannel.send({
      embeds: [logEmbed]
    });

  }
}