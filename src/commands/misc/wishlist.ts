import { Command } from '~/types/objects';
import wishlistOptions from '~/options/wishlist';
import { EmbedBuilder } from 'discord.js';
import { extractOpenGraph } from '@devmehq/open-graph-extractor';

export const wishlist: Command = {
    description: "adds something to your wishlist",
    ownerOnly: false,
    ephemeral: true,
    options: wishlistOptions,
    execute: async function (interaction, args) {
        const link = args.getString("link", true);
        const price = args.getString("price", true);
        const reward = args.getString("reward", false);
        const extra = args.getString("extra", false);

        const hmtl = await fetch(link).then(res => res.text());
        const embedData = extractOpenGraph(hmtl);

        const embed = new EmbedBuilder()
            .setTitle(embedData.ogTitle)
            .setURL(link)
            .setImage(embedData.ogImage.url)
            .setFields(
                { name: "Price", value: `$${price}`, inline: true },
            )

        if (reward) embed.addFields({ name: "Reward", value: reward, inline: true });
        if (extra) embed.addFields({ name: "Extra", value: extra, inline: false });

        interaction.editReply({ content: "Added to wishlist!", embeds: [embed] });

        interaction.channel?.send({ embeds: [embed] });
    }
}