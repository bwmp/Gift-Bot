import { SlashCommandBuilder, SlashCommandStringOption } from "discord.js";

export default async function options(cmd: SlashCommandBuilder){
    cmd.addStringOption(
        new SlashCommandStringOption()
        .setName("license_key")
        .setDescription("The license key provided with your purchase.")
        .setRequired(true)
    ).addStringOption(
        new SlashCommandStringOption()
        .setName("product")
        .setDescription("The product link provided with your purchase.")
        .setRequired(true)
        .setChoices(
            { name: "bwmp's tools", value: "VCP7a" }
        )
    )
}