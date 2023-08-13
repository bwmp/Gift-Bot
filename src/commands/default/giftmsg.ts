import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { Command } from '~/types/objects';

import gifts from '~/config/products.json';


export const giftmsg: Command = {
  description: "send the gift select menu message",
  permissions: ["ManageMessages"],
  ephemeral: true,
  execute: function (interaction, args) {

    const options: StringSelectMenuOptionBuilder[] = [];

    gifts.forEach((product) => {
      options.push(
        new StringSelectMenuOptionBuilder()
          .setLabel(product.name)
          .setValue(product.id)
          .setEmoji(product.emojiID ? { id: product.emoji } : product.emoji)
          .setDescription(product.description)
      )
    })

    const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents([
        new StringSelectMenuBuilder()
          .setCustomId("claim_gift")
          .setPlaceholder("Select a gift")
          .addOptions(options)
      ])

    interaction.channel?.send({
      content: "Select a gift to claim",
      components: [actionRow]
    })

    interaction.editReply({
      content: "Message Sent!",
    })
  }
}