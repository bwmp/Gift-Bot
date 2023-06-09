import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import prisma from "./database";

export default async function manageTicketUsers(member: GuildMember, channel: TextChannel, targetMember: GuildMember, add: boolean){
    const ticketData = await prisma.ticketdata.findUnique({
        where: {
            channelID: channel.id
        }
    })

    if(!ticketData) {
      throw new Error("Ticket data not found");
    };

    if (ticketData.open === false) {
      throw new Error("Ticket is closed");
    }

    const ticketDataUsers = JSON.parse(ticketData.users);

    if (add && ticketDataUsers.includes(targetMember.id)) {
      throw new Error("User is already in this ticket");
    } else if (!add && !ticketDataUsers.includes(targetMember.id)) {
      throw new Error("User is not in this ticket");
    }
    add ? ticketDataUsers.push(targetMember.id) : ticketDataUsers.splice(ticketDataUsers.indexOf(targetMember.id), 1);
    await prisma.ticketdata.update({
      where: {
        channelID: channel.id
      },
      data: {
        users: JSON.stringify(ticketDataUsers)
      }
    });

    channel.permissionOverwrites.edit(targetMember, {
      ViewChannel: add,
      SendMessages: add,
      ReadMessageHistory: add,
    });

    const embed = new EmbedBuilder()
      .setTitle(add ? "User Added" : "User Removed")
      .setDescription(
        `${targetMember} has been ${
          add ? "added to" : "removed from"
        } this ticket by ${member}`
      )
      .setColor(add ? "#00ff00" : "#ff0000")
      .setTimestamp()
      
    channel.send({ embeds: [embed] });

    return `${targetMember} has been ${add ? "added to" : "removed from"} this ticket`;

}