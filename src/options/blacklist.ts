import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";

export default async function options(cmd: SlashCommandBuilder) {
    cmd.addStringOption(
        new SlashCommandStringOption()
            .setName("type")
            .setDescription("add or remove the user from the backlist.")
            .addChoices(
                { name: "add", value: "add" },
                { name: "remove", value: "remove" }
            )
            .setRequired(true)
    ).addStringOption(
        new SlashCommandStringOption()
            .setName("reason")
            .setDescription("The reason for blacklisting the user.")
            .setRequired(true)
    ).addUserOption(
        new SlashCommandUserOption()
            .setName("user")
            .setDescription("The user to blacklist.")
            .setRequired(true)
    )
}