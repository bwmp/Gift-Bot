import { Channel, Client, StageChannel, TextChannel, VoiceChannel } from 'discord.js';

export default async (client: Client) => {
  setInterval(async () => {
    const MemberCountChannel = await client.channels.fetch(process.env.MEMBER_COUNT_CHANNEL as string) as TextChannel | VoiceChannel | StageChannel;
    const count = MemberCountChannel.name.replace('Members: ', '');
    if (count == client.guilds.cache.get(process.env.GUILDID as string)?.memberCount.toString()) return;
    MemberCountChannel.setName(`Members: ${client.guilds.cache.get(process.env.GUILDID as string)?.memberCount}`, 'Member count update');
  }, 60000)
};