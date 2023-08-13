import { StringSelectMenuInteraction, TextChannel } from 'discord.js';
import { claimGift } from '~/functions/database';
import { Button } from '~/types/objects';

export const claim_gift: Button = {
  deferReply: true,
  ephemeral: true,
  execute: async function (interaction, args) {
    interaction = interaction as StringSelectMenuInteraction;
    const value = interaction.values[0];
    const response = await claimGift(interaction.user.id, value);
    if(response?.code == null){
      interaction.editReply({
        content: response?.message ?? "An unknown error occured!",
      })
    }else{
      interaction.editReply({
        content: response.message + response.code,
      })
      const logChannel = interaction.guild?.channels.cache.get(process.env.LOG_CHANNEL!) as TextChannel;
      logChannel.send({
        content: `${interaction.user} claimed gift code ${response.code} for product ${value}`
      })
    }
  }
}