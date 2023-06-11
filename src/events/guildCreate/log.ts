import { Client, EmbedBuilder, Guild, TextChannel } from 'discord.js';

export default async (client: Client, guild: Guild) => {
  logger.info(`${client.user?.username} has been added to ${guild.name}`);
  const owner = await guild.fetchOwner();
  const createdTimestamp = Math.round(guild.createdTimestamp / 1000);
  const AddEmbed = new EmbedBuilder()
    .setColor('#ffb8bf')
    .setTitle(`${client.user?.username} has been added to ${guild.name}`)
    .setThumbnail(guild.iconURL())
    .setFooter({ text: `Owner: ${owner.user.username}`, iconURL: owner.user?.avatarURL() ?? undefined })
    .setDescription(`${client.user?.username} is now in ${client.guilds.cache.size} servers`)
    .addFields([
      { name: 'Created at', value: `<t:${createdTimestamp}>\n<t:${createdTimestamp}:R>`, inline: true },
      { name: 'Locale', value: guild.preferredLocale, inline: true },
      { name: 'Members', value: guild.memberCount.toString(), inline: true },
    ]);
  if (guild.vanityURLCode) AddEmbed.addFields([{ name: 'Vanity URL', value: `https://discord.gg/${guild.vanityURLCode}\n(${guild.vanityURLUses} uses)`, inline: true }]);
  if (guild.splash) AddEmbed.setImage(guild.discoverySplashURL());
  const logchannel = client.guilds.cache.get(process.env.GUILDID as string)!.channels.cache.get(process.env.ADD_REMOVE_CHANNEL as string)! as TextChannel;
  logchannel.send({ embeds: [AddEmbed] });
};