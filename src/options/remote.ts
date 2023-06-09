import { SlashCommandBuilder, SlashCommandUserOption } from "discord.js";

export default async function options(cmd: SlashCommandBuilder) {
    cmd.addUserOption(
        new SlashCommandUserOption()
            .setName("user")
            .setDescription("the user to remove from the ticket.")
            .setRequired(true)
    )
}