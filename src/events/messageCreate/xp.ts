import { Client, Collection, Message } from "discord.js";
import rewards from "~/config/rewards.json";
import { addXp } from "~/functions/database";

const xpCooldowns = new Collection<string, number>();

export default async (client: Client, message: Message) => {
  if (message.author.bot) return;
  const userId = message.author.id;

  const cooldownExpiration = xpCooldowns.get(userId);
  const now = Date.now();

  if (cooldownExpiration && now < cooldownExpiration) return;

  xpCooldowns.set(userId, now + 5000);

  const xpAmount = Math.floor(Math.random() * 5) + 1;

  try {
    const newXp = await addXp(userId, xpAmount);
    if (newXp.leveledUp) {
      const user = client.users.cache.get(userId);
      const reward = rewards[String(newXp.leveledUp) as keyof typeof rewards];
      if (reward) {
        const role = message.guild?.roles.cache.get(reward.role);
        if (role) {
          message.member?.roles.add(role);
        }
        if (reward.message) {
          message.channel.send(reward.message.replace('{user}', user?.toString() || ''));
        }
      }
      message.channel.send(`Congratulations ${user!.username}! You have leveled up to level ${newXp.newLevel}!`);
    }
  } catch (err) {
    logger.error(err);
  }
};