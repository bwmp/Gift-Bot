import { Command } from '~/types/objects';
import { GuildMember, TextChannel } from 'discord.js';
import addOptions from '~/options/add';
import manageTicketUsers from '~/functions/manageTicketUsers';

export const remove: Command = {
    description: "remove a user from the ticket",
    ephemeral: true,
    options: addOptions,
    execute: async function (interaction, args) {
        const member = interaction.member as GuildMember;

        const user = interaction.options.getUser('user', true);

        const channel = interaction.channel as TextChannel;

        const targetMember = interaction.guild!.members.cache.get(user.id);
        if(!targetMember) {
            interaction.editReply({ content: "User not found" });
            return;
        }

        try{
          const msg = await manageTicketUsers(member, channel, targetMember, false);

          interaction.editReply({ content: msg });
        }catch(err: any){
          interaction.editReply({ content: err.message });
        }
    }
}