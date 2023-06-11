import { Client, Guild } from "discord.js";
import prisma from "~/functions/database";

export default async (client: Client, guild: Guild) => {
  await prisma.settings.create({ data: { guildId: guild.id } });
}