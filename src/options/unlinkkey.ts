import { SlashCommandBuilder, SlashCommandStringOption } from "discord.js";

export default async function options(cmd: SlashCommandBuilder) {
    cmd.addStringOption(
        new SlashCommandStringOption()
            .setName("license_key")
            .setDescription("The license key to unlink.")
            .setRequired(true)
    )
}