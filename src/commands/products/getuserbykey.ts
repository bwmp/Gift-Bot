import { PrismaClient } from '@prisma/client';
import { Command } from '~/types/Objects';

export const getuserbykey: Command = {
  description: "gets a user by their license key",
  category: "products",
  ephemeral: true,
  ownerOnly: true,
  execute: async function (interaction, args) {
    const prisma = new PrismaClient();
    const key = args.getString("license_key", true);
    
    const user = await prisma.licenses.findUnique({
      where: { license_key: key },
    });

    if (!user) {
      interaction.editReply(`No user found for license key ${key}`);
      return;
    }
    const member = await interaction.guild!.members.fetch(user.userId);
    interaction.editReply(`User found for license key ${key}: ${member.user.tag}`);

    await prisma.$disconnect();
  }
};
