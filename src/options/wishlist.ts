import { SlashCommandBuilder, SlashCommandStringOption } from "discord.js";

export default async function options(cmd: SlashCommandBuilder) {
    cmd.addStringOption(
        new SlashCommandStringOption()
            .setName("link")
            .setDescription("The link to the product.")
            .setRequired(true)
    ).addStringOption(
        new SlashCommandStringOption()
            .setName("price")
            .setDescription("The price of the product.")
            .setRequired(true)
    ).addStringOption(
        new SlashCommandStringOption()
            .setName("reward")
            .setDescription("The reward for buying.")
            .setRequired(false)
    ).addStringOption(
        new SlashCommandStringOption()
            .setName("extra")
            .setDescription("Extra information about the product.")
            .setRequired(false)
    )
}