import { Client, Message } from "discord.js";

import prisma, { getSettings } from "~/functions/database";

const messages = [
  "YOU IDIOT! YOU RUINED THE COUNT! THE NUMBER WAS {NUMBER}!",
  "You ruined the count! The number was {NUMBER}!",
  "Nice job, you ruined the count! The number was {NUMBER}!",
  "Nice job ruining the count... The number was {NUMBER} You should be ashamed of yourself.",
  "WOOOOOOOW YOU CALL YOURSELF A HUMAN? YOU RUINED THE COUNT! THE NUMBER WAS {NUMBER}!",
  "The highest number you guys counted to was {MAX}, BUT YOU RUINED IT! THE NUMBER WAS {NUMBER}!",
]

export default async (client: Client, message: Message) => {

  if (message.author.bot) return;

  const number = parseInt(message.content.split(" ")[0])

  if (Number.isNaN(number)) return;

  const { counting } = await getSettings(message.guild!.id);

  if (counting.channel != message.channel.id) return;

  if((counting.count += 1) != number) {
    message.react("❌");
    const msg = messages[Math.floor(Math.random() * messages.length)].replace("{NUMBER}", counting.count.toString()).replace("{MAX}", counting.maxcount.toString())
    message.reply({content: msg})
    counting.count = 0;
    await prisma.settings.update({
      where: {
        guildId: message.guild!.id
      },
      data: {
        counting: JSON.stringify(counting)
      }
    })
    return;
  }

  counting.count = number;
  if(number > counting.maxcount) counting.maxcount = number;
  await prisma.settings.update({
    where: {
      guildId: message.guild!.id
    },
    data: {
      counting: JSON.stringify(counting)
    }
  })
  message.react("✅");
};