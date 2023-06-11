import { Client, StageChannel, TextChannel, VoiceChannel } from 'discord.js';
import { getSettings } from '~/functions/database';

export default async (client: Client) => {
  setInterval(async () => {
    client.guilds.cache.forEach(async (guild) => {
      const settings = await getSettings(guild.id);
      if (settings.membercountchannel == "false") return;
      const MemberCountChannel = await client.channels.fetch(settings.membercountchannel) as TextChannel | VoiceChannel | StageChannel;
      const count = MemberCountChannel.name.replace('Members: ', '');
      const newCount = guild?.memberCount.toString();
      if (count == newCount) return;
      MemberCountChannel.setName(`Members: ${newCount}`, 'Member count update');
    });
  }, 60000)
};