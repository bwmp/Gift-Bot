import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, EmbedBuilder, GuildMember, PermissionsBitField } from 'discord.js';
import { ticket } from '~/commands/ticket/ticket';
import { Button } from '~/types/objects';

export const create: Button = {
    noDefer: true,
    ephemeral: true,
    execute: async function (interaction, args) {

        const member = interaction.member as GuildMember;

        if(member?.roles.cache.has("969015422160633866")) {
            interaction.reply({ content: "You are already verified.", ephemeral: true });
            return;
        }

        const parent = await interaction.guild!.channels.fetch(process.env.AGE_VERIFICATION_CATEGORY as string) as CategoryChannel | null;

        const ticketChannel = await interaction.guild!.channels.create({
            name: `Age Verification - ${interaction.user.tag}`,
            parent: parent ? parent.id : null,
            topic: `Age Verification Ticket for ${interaction.user.tag}`,
            type: ChannelType.GuildText,
            reason: `Age Verification Ticket for ${interaction.user.tag}`,
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
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new ButtonBuilder()
                    .setCustomId(`ageverify_approve-${interaction.user.id}`)
                    .setLabel('Approve')
                    .setEmoji('✅')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`ageverify_deny-${interaction.user.id}`)
                    .setLabel('Deny')
                    .setStyle(ButtonStyle.Danger),
            ])

        const embed = new EmbedBuilder()
            .setTitle('Age Verification')
            .setDescription(`To verify please send a picture of any form of identification that shows your age, as well as a piece of paper with your discord tag and the current date. Once you have sent this, please wait for a staff member to approve you.`)
            .setColor('#ffb8bf')

        ticketChannel.send({
            embeds: [embed],
            components: [row]
        })

        interaction.editReply({ content: `Your ticket has been created. <#${ticketChannel.id}>` });
    }
}