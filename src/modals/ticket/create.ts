import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, EmbedBuilder, PermissionsBitField, TextChannel } from 'discord.js';
import { Modal } from '~/types/objects';
import prisma from '~/functions/database';

export const create: Modal = {
    deferReply: true,
    ephemeral: true,
    execute: async function (interaction, args) {
        const description = interaction.fields.getTextInputValue('ticket_description') || 'No description provided';
        const parent = await interaction.guild!.channels.fetch(process.env.TICKET_CATEGORY as string) as CategoryChannel | null;

        const ticket = await prisma.ticketdata.create({
            data: {
                userId: interaction.user.id,
                ticketReason: description,
                channelID: "",
            }
        })

        const ticketChannel = await interaction.guild!.channels.create({
            name: `ticket-${ticket.id}`,
            parent: parent ? parent.id : null,
            topic: `Ticket created by ${interaction.user.tag} `,
            type: ChannelType.GuildText,
            reason: description,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                },
                {
                    id: interaction.guild!.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                }
            ],
        })

        const ticketEmbed = new EmbedBuilder()
            .setTitle('Ticket Created')
            .setFooter({ text: `Ticket created by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription('A ticket has been created, please wait for a staff member to assist you.')
            .addFields(
                {
                    name: 'Ticket ID',
                    value: `#${ticket.id}`,
                    inline: true,
                },
                {
                    name: 'Ticket Reason',
                    value: description,
                    inline: true,
                }
            )
            .setTimestamp()

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new ButtonBuilder()
                    .setCustomId('ticket_close')
                    .setLabel('Close Ticket')
                    .setEmoji({ name: '🔒' })
                    .setStyle(ButtonStyle.Danger)
            ])

        const msg = await ticketChannel.send({ embeds: [ticketEmbed], components: [row] })

        await prisma.ticketdata.update({
            where: {
                id: ticket.id,
            },
            data: {
                channelID: ticketChannel.id,
                originalMessage: msg.id,
            }
        })

    }
}