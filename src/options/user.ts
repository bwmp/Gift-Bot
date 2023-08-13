import { SlashCommandBuilder, SlashCommandUserOption } from "discord.js";

export default async function options(cmd: SlashCommandBuilder) {
    cmd.addUserOption(
        new SlashCommandUserOption()
            .setName("user")
            .setDescription("the users whos codes you want to check.")
            .setRequired(true)
    )
}