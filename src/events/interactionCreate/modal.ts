import { Client, InteractionType, ModalSubmitInteraction } from "discord.js";
import { Modal } from "~/types/objects";

export default async (client: Client, interaction: ModalSubmitInteraction) => {

  if (interaction.type != InteractionType.ModalSubmit) return;

  const id = interaction.customId;
  let modal

  try {
    modal = require(`../../modals/${id.replace("_", "/")}`)[id.split("_").at(-1)!] as Modal;
  } catch (err) {
    logger.error(`Cannot find modal ${id}`);
  }

  if (!modal) return;

  try {
    await interaction[modal.deferReply ? 'deferReply' : 'deferUpdate']({ ephemeral: modal.ephemeral });
    modal.execute(interaction, interaction.fields);
  } catch (e) {
    logger.error(e);
  }
}