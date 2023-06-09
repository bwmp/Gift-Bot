import { Command } from '~/types/objects';
import { addLicenseKey } from '~/functions/database';
import { TextChannel } from 'discord.js';
import products from '~/config/products.json';
import verifyPurchase from '~/options/verifypurchase'

export const verifypurchase: Command = {
	description: "Verify your product purchase!",
	ephemeral: true,
	category: "products",
	options: verifyPurchase,
	execute: async function (interaction, args) {
		const key = args.getString('license_key', true);
		const product = args.getString('product', true);
		const channel = interaction.guild?.channels.cache.get(process.env.PRODUCT_LOG_CHANNEL as string) as TextChannel;
		const res: any = await fetch(`https://payhip.com/api/v1/license/verify?product_link=${product}&license_key=${key}`, {
			method: 'GET',
			headers: {
				'payhip-api-key': `${process.env.PAYHIP_API_KEY}`
			}
		}).then(res => res.json())
			.catch(err => {
				logger.error(err)
				interaction.editReply({ content: "An error occurred while verifying your purchase. Please try again later or contact support!" })
				return
			});

		if (!res.data) {
			interaction.editReply({ content: "An error occurred while verifying your purchase. Please try again later or contact support!" })
			return
		}
		if (res.data.enabled) {
			let tryKey = await addLicenseKey(key, product, interaction.user.id);
			if (tryKey == false) {
				channel.send(`${interaction.user.tag} (${interaction.user.id}) has tried verified their purchase of ${products[product as keyof typeof products].name} with the key ${key} but it has already been verified by another user.`);
			}

			const verifiedRole = interaction.guild?.roles.cache.get(products[product as keyof typeof products].role);
			const member = await interaction.guild!.members.fetch(interaction.user.id);
			if (verifiedRole && tryKey) {
				member.roles.add(verifiedRole);
			}
			channel.send(`${interaction.user.tag} (${interaction.user.id}) has verified their purchase of ${products[product as keyof typeof products].name} with the key ${key}.`);
			interaction.editReply({ content: `Your purchase of ${products[product as keyof typeof products].name} has been verified!` });
		} else {
			interaction.editReply({ content: "Your license key is not valid. Please check your key and try again." });
		}
	}
}