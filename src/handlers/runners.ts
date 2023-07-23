import { Client, StageChannel, TextChannel, VoiceChannel } from 'discord.js';
import { getSettings } from '~/functions/database';

export default async (client: Client) => {
  setInterval(async () => {
    client.guilds.cache.forEach(async (guild) => {
      const settings = await getSettings(guild.id);
      if (settings.membercount.channel == "false") return;
      const MemberCountChannel = await client.channels.fetch(settings.membercount.channel) as TextChannel | VoiceChannel | StageChannel;
      const newName = settings.membercount.text.replace("{COUNT}", guild?.memberCount.toString());
      if(MemberCountChannel.name == newName) return;
      MemberCountChannel.setName(newName, 'Member count update');
    });
  }, 60000)
};