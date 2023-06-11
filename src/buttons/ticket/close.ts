import { Button } from '~/types/objects';
import prisma, { getSettings } from '~/functions/database';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, EmbedBuilder, GuildMember, PermissionsBitField, TextChannel } from 'discord.js';
import { createTranscript } from 'discord-html-transcripts';

export const close: Button = {
  deferReply: true,
  ephemeral: true,
  execute: async function (interaction, args) {

    const settings = await getSettings(interaction.guild!.id);

    let ticketInfo = await prisma.ticketdata.findUnique({
      where: {
        channelID: interaction.channel!.id
      }
    });

    const supportRole = await interaction.guild!.roles.fetch(settings.ticketdata.supportRole);
    const member = interaction.member as GuildMember;
    const isSupport = supportRole?.members.some(member => member.id === interaction.user.id) || member.permissions.has(PermissionsBitField.Flags.Administrator);

    if (!ticketInfo) {
      interaction.editReply({
        content: 'This channel is not a ticket!'
      });
      return;
    }

    if(!ticketInfo.open){
      interaction.editReply({
        content: 'This ticket is already closed!'
      });
      return;
    }

    if (ticketInfo.userId !== interaction.user.id || !isSupport) {
      interaction.editReply({
        content: 'You cannot close this ticket!'
      });
      return;
    }

    ticketInfo = await prisma.ticketdata.update({
      where: {
        guildId_id: {
          guildId: interaction.guild!.id,
          id: ticketInfo.id
        }
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
      content: 'Ticket closed!',
    });

    await interaction.channel!.send({
      embeds: [embed],
      components: [row]
    });

    const ogMsg = await interaction.channel!.messages.fetch(ticketInfo.originalMessage);

    await ogMsg.edit({
      components: [ogmsgRow]
    });

    const channel = await interaction.guild!.channels.fetch(ticketInfo.channelID);

    let parent = null;
    if (settings.ticketdata.categories.closed == "false"){
        parent = null
    }else{
        parent = await interaction.guild!.channels.fetch(settings.ticketdata.categories.closed) as CategoryChannel | undefined;
    }

    channel?.edit({
      parent: parent ? parent.id : null,
    });

    let LogChannel = null;
    if (settings.ticketdata.logChannel == "false"){
      LogChannel = null
    }else{
      LogChannel = await interaction.guild!.channels.fetch(settings.ticketdata.logChannel) as TextChannel;
    }

    const logEmbed = new EmbedBuilder()
      .setTitle('Ticket Closed')
      .addFields(
        {
          name: 'Ticket ID',
          value: ticketInfo.id.toString(),
        },
        {
          name: 'Ticket Owner',
          value: `<@${ticketInfo.userId}>`,
        },
        {
          name: 'Closed By',
          value: `<@${interaction.user.id}>`,
        }
      )
      .setColor('#ff0000')
      .setTimestamp();

    await LogChannel?.send({
      embeds: [logEmbed],
      files: [transcript]
    });

    const users = JSON.parse(ticketInfo.users);

    const creator = interaction.guild!.members.cache.get(ticketInfo.userId);

    if (creator) {
      await creator.send({
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