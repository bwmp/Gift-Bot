import { SlashCommandBuilder, SlashCommandStringOption } from "discord.js";

export default async function options(cmd: SlashCommandBuilder) {
    cmd.addStringOption(
        new SlashCommandStringOption()
            .setName("code")
            .setDescription("the code to check.")
            .setRequired(true)
    )
}