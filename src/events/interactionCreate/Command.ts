import { Client, CommandInteraction } from "discord.js";
import commands from "~/lists/commands";

export default async (client: Client, interaction: CommandInteraction) => {

    if (!interaction.isChatInputCommand()) return;
    

    const command = commands.get(interaction.commandName);
    if (!command) return;

    if(command.guildOnly && !interaction.guild) return interaction.editReply({ content: "This command can only be used in a server" });

    const args = interaction.options;
    await interaction.deferReply({ ephemeral: command.ephemeral })

    if (command.ownerOnly && interaction.member!.user.id != process.env.OWNERID) return interaction.editReply({ content: "This command can only be used by the bot creator" });
    
    try {
        await command.execute(interaction, args);
    } catch (error) {
        logger.error(error);
        await interaction.editReply({ content: 'There was an error while executing this command!' });
    }
}