import { Command } from "~/types/Objects";
import { PrismaClient } from "@prisma/client";
import products from "~/config/products.json";
import { TextChannel } from "discord.js";

export const unlinkkey: Command = {
    description: "unlink users license key",
    category: "products",
    ownerOnly: true,
    ephemeral: true,
    execute: async function (interaction, args) {
        const prisma = new PrismaClient();
        const key = args.getString("license_key", true);

        await prisma.$transaction(async (tx) => {
            const user = await tx.licenses.findUnique({
                where: { license_key: key },
            });
            if (!user) {
                interaction.editReply(`No user found for license key ${key}`);
                return;
            }

            const member = await interaction.guild!.members.fetch(user.userId);
            const product = products[user.product as keyof typeof products];
            const productRole = interaction.guild!.roles.cache.get(product?.role);
            const logChannel = interaction.guild!.channels.cache.get(
                process.env.LOG_CHANNEL as string
            ) as TextChannel;

            await tx.licenses.delete({ where: { license_key: key } });

            if (productRole && member.roles.cache.has(productRole.id)) {
                await member.roles.remove(productRole);
            }

            await Promise.all([
                interaction.editReply(
                    `Unlinked license key ${key} from user ${member.user.tag}`
                ),
                logChannel.send(
                    `Unlinked license key ${key} from user ${member.user.tag} by ${interaction.user.tag}`
                ),
            ]);
        });

        await prisma.$disconnect();
    },
};
